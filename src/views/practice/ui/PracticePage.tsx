"use client";

import {
  ArrowLeftIcon,
  ChartBarIcon,
  CheckIcon,
  ClockIcon,
  TrophyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTransitionRouter } from "next-view-transitions";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  GEMINI_SYSTEM_PROMPT,
  PRACTICE_LEADERBOARD,
  PRACTICE_QUESTIONS,
  TOTAL_TEST_TIME,
} from "@/shared/constants";

import {
  QuestionType,
  type Answer,
  type UserAnswer,
} from "@/entities/question";
import { GeminiChat } from "@/features/gemini-chat";

/**
 * Confetti animation component
 */
const Confetti = ({ show }: { show: boolean }) => {
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        color: ["#3BCBFF", "#50EBFF", "#ED0A35", "#FFD700"][
          Math.floor(Math.random() * 4)
        ],
      })),
    [],
  );

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: "-10%",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: piece.color }}
          />
        </div>
      ))}
    </div>
  );
};

/**
 * PracticePage Component
 * @description Test system with timer, multiple question types, and scoring
 */
export function PracticePage() {
  const router = useTransitionRouter();
  const [isClient, setIsClient] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Map<number, UserAnswer>>(
    new Map(),
  );
  const [startTime] = useState(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateRank, setAnimateRank] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    setIsClient(true);
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const currentQuestion = useMemo(
    () => PRACTICE_QUESTIONS[currentQuestionIndex],
    [currentQuestionIndex],
  );

  const isAnswerCorrect = useCallback(() => {
    if (currentQuestion.type === QuestionType.Text) {
      return (
        textAnswer.toLowerCase().trim() ===
        currentQuestion.correctText?.toLowerCase()
      );
    } else if (currentQuestion.type === QuestionType.Single) {
      const correct = currentQuestion.answers?.find((a: Answer) => a.isCorrect);
      return selectedAnswers[0] === correct?.id;
    } else if (currentQuestion.type === QuestionType.Multiple) {
      const correctIds =
        currentQuestion.answers
          ?.filter((a: Answer) => a.isCorrect)
          .map((a: Answer) => a.id) || [];
      return (
        correctIds.length === selectedAnswers.length &&
        correctIds.every((id: number) => selectedAnswers.includes(id))
      );
    }
    return false;
  }, [currentQuestion, selectedAnswers, textAnswer]);

  const triggerVibration = useCallback(
    (pattern: number | number[]) => {
      if (isClient && "vibrate" in navigator) {
        navigator.vibrate(pattern);
      }
    },
    [isClient],
  );

  const handleSingleAnswer = useCallback(
    (answerId: number) => {
      if (showResult) return;
      setSelectedAnswers([answerId]);
      triggerVibration(50);
    },
    [showResult, triggerVibration],
  );

  const handleMultipleAnswer = useCallback(
    (answerId: number) => {
      if (showResult) return;
      setSelectedAnswers((prev) =>
        prev.includes(answerId)
          ? prev.filter((id) => id !== answerId)
          : [...prev, answerId],
      );
      triggerVibration(30);
    },
    [showResult, triggerVibration],
  );

  const handleFinishTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mountedRef.current) {
      setIsFinished(true);
      triggerVibration([100, 50, 100]);
    }
  }, [triggerVibration]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion.type === QuestionType.Text && !textAnswer.trim()) {
      triggerVibration(100);
      return;
    }

    if (
      currentQuestion.type !== QuestionType.Text &&
      selectedAnswers.length === 0
    ) {
      triggerVibration(100);
      return;
    }

    if (!showResult) {
      setShowResult(true);
      setUserAnswers((prev) => {
        const newMap = new Map(prev);
        const answer =
          currentQuestion.type === QuestionType.Text
            ? textAnswer
            : [...selectedAnswers];
        newMap.set(currentQuestion.id, answer);
        return newMap;
      });
      triggerVibration(50);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (!mountedRef.current) return;

      if (currentQuestionIndex < PRACTICE_QUESTIONS.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswers([]);
        setTextAnswer("");
        setShowResult(false);
      } else {
        handleFinishTest();
      }
      setIsLoading(false);
    }, 300);
  }, [
    currentQuestion,
    currentQuestionIndex,
    handleFinishTest,
    selectedAnswers,
    showResult,
    textAnswer,
    triggerVibration,
  ]);

  useEffect(() => {
    if (!isClient) return;

    const TOTAL = TOTAL_TEST_TIME * 60;
    setRemaining(TOTAL);

    timerRef.current = setInterval(() => {
      if (!mountedRef.current) return;

      setRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isClient, handleFinishTest]);

  const calculateResults = useCallback(() => {
    let correctAnswers = 0;
    let totalPoints = 0;
    const wrongTopics = new Set<string>();

    PRACTICE_QUESTIONS.forEach((q) => {
      const userAnswer = userAnswers.get(q.id);
      if (!userAnswer) return;

      if (q.type === QuestionType.Text) {
        if (
          typeof userAnswer === "string" &&
          userAnswer.toLowerCase().trim() === q.correctText?.toLowerCase()
        ) {
          correctAnswers++;
          totalPoints += q.points;
        } else {
          wrongTopics.add(q.topic);
        }
      } else if (q.type === QuestionType.Single && Array.isArray(userAnswer)) {
        const correct = q.answers?.find((a: Answer) => a.isCorrect);
        if (userAnswer[0] === correct?.id) {
          correctAnswers++;
          totalPoints += q.points;
        } else {
          wrongTopics.add(q.topic);
        }
      } else if (
        q.type === QuestionType.Multiple &&
        Array.isArray(userAnswer)
      ) {
        const correctIds =
          q.answers
            ?.filter((a: Answer) => a.isCorrect)
            .map((a: Answer) => a.id) || [];
        const selectedCorrect = userAnswer.filter((id) =>
          correctIds.includes(id),
        ).length;
        const selectedIncorrect = userAnswer.filter(
          (id) => !correctIds.includes(id),
        ).length;

        const partialPoints = selectedCorrect - selectedIncorrect;

        if (partialPoints === correctIds.length && selectedIncorrect === 0) {
          correctAnswers++;
          totalPoints += q.points;
        } else if (partialPoints > 0) {
          totalPoints += partialPoints * 0.25;
          wrongTopics.add(q.topic);
        } else {
          wrongTopics.add(q.topic);
        }
      }
    });

    const timeTaken = Math.floor((Date.now() - startTime) / 1000 / 60);
    const percentage = (correctAnswers / PRACTICE_QUESTIONS.length) * 100;
    const userRank =
      PRACTICE_LEADERBOARD.filter((l) => l.points > totalPoints).length + 1;

    return {
      correctAnswers,
      totalPoints,
      wrongTopics: Array.from(wrongTopics),
      percentage,
      timeTaken,
      userRank,
    };
  }, [userAnswers, startTime]);

  const results = useMemo(
    () => (isFinished ? calculateResults() : null),
    [isFinished, calculateResults],
  );

  useEffect(() => {
    if (isFinished && results && results.percentage >= 70) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isFinished, results]);

  useEffect(() => {
    if (isFinished && results) {
      const timer = setTimeout(() => setAnimateRank(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isFinished, results]);

  const handleExitClick = useCallback(() => {
    setShowExitModal(true);
  }, []);

  const handleConfirmExit = useCallback(() => {
    handleFinishTest();
    setShowExitModal(false);
  }, [handleFinishTest]);

  const formatTime = useCallback(
    (seconds: number) =>
      `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`,
    [],
  );

  const encodedSystemPrompt = useMemo(() => {
    if (!isClient) return "";
    try {
      return btoa(encodeURIComponent(GEMINI_SYSTEM_PROMPT));
    } catch {
      return "";
    }
  }, [isClient]);

  // Loading state
  if (!isClient) {
    return (
      <div className="w-full min-h-screen py-6 px-4 flex flex-col gap-6">
        <div className="flex flex-row w-full items-center justify-between">
          <div className="p-3 bg-neutral-800 rounded-full">
            <XMarkIcon className="size-6 text-neutral-400" />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-full">
            <ClockIcon className="size-5 text-[#3BCBFF]" />
            <p className="text-neutral-300 text-sm font-medium">
              Осталось: —:—
            </p>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="bg-neutral-800 rounded-3xl p-6 h-32 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-neutral-800 rounded-3xl p-5 h-20" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (isFinished && results) {
    const getStatusMessage = () => {
      if (results.percentage >= 90)
        return { text: "Идеально!", color: "text-[#3BCBFF]" };
      if (results.percentage >= 70)
        return { text: "Отлично!", color: "text-[#3BCBFF]" };
      if (results.percentage >= 50)
        return { text: "Почти готово!", color: "text-[#50EBFF]" };
      return { text: "Продолжайте!", color: "text-neutral-300" };
    };

    const status = getStatusMessage();

    return (
      <div
        className="w-full min-h-screen py-6 px-4 flex flex-col gap-6"
        data-system-prompt={encodedSystemPrompt}
      >
        <Confetti show={showConfetti} />

        <div className="flex flex-row w-full items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/block")}
            className="p-3 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
            aria-label="Вернуться назад"
          >
            <ArrowLeftIcon className="size-6 text-neutral-400" />
          </button>
        </div>

        <div className="w-full p-8 bg-neutral-800 rounded-3xl">
          <h1 className={`text-4xl font-bold mb-2 ${status.color}`}>
            {status.text}
          </h1>
          <p className="text-neutral-300 text-lg">
            Вы набрали {results.totalPoints.toFixed(1)} баллов
          </p>
        </div>

        <div className="bg-neutral-800 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrophyIcon className="size-6 text-[#3BCBFF]" />
            Ваши коллеги
          </h2>
          <div className="space-y-3" role="list" aria-label="Таблица лидеров">
            {PRACTICE_LEADERBOARD.map((entry, idx) => (
              <div
                key={`${entry.name}-${idx}`}
                className="flex items-center gap-4 p-4 bg-neutral-900 rounded-2xl"
                role="listitem"
              >
                <div
                  className="size-12 rounded-full bg-[#3BCBFF] flex items-center justify-center text-black font-bold"
                  aria-label={`Аватар ${entry.name}`}
                >
                  {entry.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{entry.name}</p>
                  <p className="text-neutral-400 text-sm">
                    за {entry.time} минуты
                  </p>
                </div>
                <div className="text-[#3BCBFF] font-bold text-xl">
                  {entry.points}
                </div>
              </div>
            ))}

            <div
              className="flex items-center gap-4 p-4 bg-[#3BCBFF] rounded-2xl"
              role="listitem"
              aria-label="Ваш результат"
            >
              <div className="size-12 rounded-full bg-black flex items-center justify-center text-[#3BCBFF] font-bold">
                ВЫ
              </div>
              <div className="flex-1">
                <p className="text-black font-medium">Вы</p>
                <p className="text-black/70 text-sm">
                  за {results.timeTaken} минут
                </p>
              </div>
              <div className="text-black font-bold text-xl">
                {results.totalPoints.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-3xl p-6 relative overflow-hidden">
          {showConfetti && results.percentage >= 70 && (
            <div className="absolute inset-0 bg-[#3BCBFF]/5 animate-pulse" />
          )}
          <p className="text-neutral-300 text-center mb-4 relative z-10">
            Вы правильно ответили на{" "}
            <span className="text-[#3BCBFF] font-bold">
              {results.correctAnswers}
            </span>{" "}
            из <span className="font-bold">{PRACTICE_QUESTIONS.length}</span>{" "}
            вопросов
          </p>

          {results.wrongTopics.length > 0 && (
            <>
              <p className="text-neutral-400 text-sm text-center mb-4">
                Просмотрите эти темы, чтобы улучшить результаты:
              </p>
              <div className="space-y-2">
                {PRACTICE_QUESTIONS.filter((q) =>
                  results.wrongTopics.includes(q.topic),
                ).map((q) => (
                  <a
                    key={q.id}
                    href={q.topicLink}
                    className="flex items-center justify-between p-4 bg-neutral-900 rounded-2xl hover:bg-neutral-700 transition-colors"
                    aria-label={`Ссылка на тему: ${q.topic}`}
                  >
                    <span className="text-white">{q.topic}</span>
                    <span className="text-neutral-500 text-sm truncate ml-2 max-w-[100px]">
                      {q.topicLink.replace("/docs/", "").replace(".md", "")}
                    </span>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="bg-neutral-800 rounded-3xl p-6 relative overflow-hidden">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <ChartBarIcon className="size-6 text-[#3BCBFF]" />
            Ваш рейтинг
          </h2>
          <div className="text-center">
            <div
              className={`text-5xl font-bold text-[#3BCBFF] mb-2 transition-all duration-1000 ${
                animateRank ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
              aria-live="polite"
              aria-label={`Ваше место: ${results.userRank}`}
            >
              {results.userRank}
            </div>
            <p className="text-neutral-400">место в блоке</p>
          </div>

          {animateRank && (
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#3BCBFF]/20 rounded-full animate-ping" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => router.push("/block")}
          className="py-4 rounded-full bg-[#3BCBFF] text-black font-semibold hover:bg-[#2CDB8E] transition-colors"
        >
          Продолжайте практиковаться!
        </button>

        <style jsx>{`
          @keyframes confetti {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          .animate-confetti {
            animation: confetti linear forwards;
          }
        `}</style>
      </div>
    );
  }

  // Question screen
  return (
    <div
      className="w-full min-h-screen py-6 px-4 flex flex-col gap-6 select-none"
      data-system-prompt={encodedSystemPrompt}
    >
      <div className="flex flex-row w-full items-center justify-between sticky top-0 z-20 backdrop-blur-sm ">
        <button
          type="button"
          onClick={handleExitClick}
          className="p-3 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
          aria-label="Выйти из теста"
        >
          <XMarkIcon className="size-6 text-neutral-400" />
        </button>

        <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-full">
          <ClockIcon className="size-5 text-[#3BCBFF]" />
          <p
            className="text-neutral-300 text-sm font-medium"
            aria-live="polite"
          >
            Осталось: {remaining === null ? "—" : formatTime(remaining)}
          </p>
        </div>
      </div>

      <div className="bg-neutral-800 rounded-3xl p-6">
        <div className="mb-4">
          <span className="text-sm text-neutral-400">
            {currentQuestionIndex + 1}/{PRACTICE_QUESTIONS.length} вопрос
          </span>
        </div>

        {/* Question image if available */}
        {currentQuestion.imageUrl && (
          <div className="mb-4">
            <img
              src={currentQuestion.imageUrl}
              alt="Изображение к вопросу"
              className="w-full rounded-2xl object-cover max-h-48"
            />
          </div>
        )}

        <h1 className="text-2xl font-bold text-[#3BCBFF] mb-3">
          {currentQuestion.title}
        </h1>
        <p className="text-neutral-300">{currentQuestion.description}</p>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {currentQuestion.type === QuestionType.Text ? (
          <div className="bg-neutral-800 rounded-3xl p-1">
            <input
              type="text"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={showResult}
              placeholder="Введите ваш ответ..."
              className={`
                w-full px-6 py-5 bg-transparent text-white placeholder-neutral-500 outline-none text-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  showResult &&
                  (isAnswerCorrect() ? "text-[#3BCBFF]" : "text-[#ED0A35]")
                }
              `}
              aria-label="Поле для ответа"
              aria-invalid={showResult && !isAnswerCorrect()}
              aria-describedby={
                showResult && !isAnswerCorrect() ? "answer-feedback" : undefined
              }
            />
          </div>
        ) : (
          <div
            className="space-y-3"
            role="radiogroup"
            aria-label="Варианты ответов"
          >
            {currentQuestion.answers?.map((answer) => {
              const isSelected = selectedAnswers.includes(answer.id);
              const isCorrect = answer.isCorrect;

              let buttonClass = `w-full flex gap-4 items-start px-5 py-5 rounded-3xl text-left transition-all duration-300 disabled:cursor-not-allowed`;

              if (!showResult) {
                buttonClass += ` bg-neutral-800 hover:bg-neutral-700 ${
                  isSelected ? "ring-2 ring-[#3BCBFF]" : ""
                }`;
              } else {
                if (isSelected && isCorrect) {
                  buttonClass += " bg-[#3BCBFF]";
                } else if (isSelected && !isCorrect) {
                  buttonClass += " bg-[#ED0A35]";
                } else if (isCorrect) {
                  buttonClass += " bg-[#3BCBFF]";
                } else {
                  buttonClass += " bg-neutral-800 opacity-50";
                }
              }

              const role =
                currentQuestion.type === QuestionType.Single
                  ? "radio"
                  : "checkbox";
              const ariaChecked = isSelected ? "true" : "false";

              return (
                <div key={answer.id}>
                  <button
                    type="button"
                    role={role}
                    aria-checked={ariaChecked}
                    onClick={() =>
                      currentQuestion.type === QuestionType.Single
                        ? handleSingleAnswer(answer.id)
                        : handleMultipleAnswer(answer.id)
                    }
                    disabled={showResult}
                    className={buttonClass}
                    aria-label={`${answer.text} ${isSelected ? "выбран" : ""}`}
                  >
                    <span
                      className={`size-10 rounded-full flex items-center justify-center transition-all ${
                        isSelected && !showResult
                          ? "bg-[#3BCBFF] border-0"
                          : "border border-neutral-600"
                      } ${
                        showResult && (isCorrect || (isSelected && !isCorrect))
                          ? "border-0"
                          : ""
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && !showResult && (
                        <CheckIcon className="size-6 text-neutral-900" />
                      )}

                      {showResult && isCorrect && (
                        <CheckIcon className="size-6 text-black" />
                      )}

                      {showResult && isSelected && !isCorrect && (
                        <XMarkIcon className="size-6 text-white" />
                      )}
                    </span>

                    <p
                      className={`flex-1 ${
                        showResult && (isCorrect || isSelected)
                          ? "text-white"
                          : ""
                      }`}
                    >
                      {answer.text}
                    </p>
                  </button>

                  {showResult &&
                    isSelected &&
                    !isCorrect &&
                    answer.explanation && (
                      <div
                        id="answer-feedback"
                        className="mt-2 ml-14 text-sm text-neutral-300 bg-neutral-800 p-4 rounded-2xl"
                        role="alert"
                      >
                        {answer.explanation}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleNextQuestion}
        disabled={
          (!showResult &&
            ((currentQuestion.type === QuestionType.Text &&
              !textAnswer.trim()) ||
              (currentQuestion.type !== QuestionType.Text &&
                selectedAnswers.length === 0))) ||
          isLoading
        }
        className="py-4 rounded-full bg-[#3BCBFF] text-black font-semibold hover:bg-[#3BCBFF]/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={
          isLoading
            ? "Загрузка"
            : showResult
              ? "Следующий вопрос"
              : "Проверить ответ"
        }
      >
        {isLoading
          ? "Загрузка..."
          : showResult
            ? currentQuestionIndex < PRACTICE_QUESTIONS.length - 1
              ? "Следующий вопрос"
              : "Завершить тест"
            : "Проверить"}
      </button>

      {/* Gemini Chat */}
      <GeminiChat />

      {showExitModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-modal-title"
        >
          <div className="bg-neutral-900 p-6 rounded-3xl max-w-sm w-full">
            <h2
              id="exit-modal-title"
              className="text-xl font-bold text-white mb-2"
            >
              Завершить тест?
            </h2>
            <p className="text-neutral-400 text-sm mb-6">
              Вы завершите тест и получите баллы только за {userAnswers.size} из{" "}
              {PRACTICE_QUESTIONS.length} вопросов
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-3 rounded-full border border-neutral-700 text-white hover:bg-neutral-800 transition-colors"
                aria-label="Продолжить тест"
              >
                Продолжить
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="flex-1 py-3 rounded-full bg-[#3BCBFF] text-black font-semibold hover:bg-[#2CDB8E] transition-colors"
                aria-label="Завершить тест"
              >
                Завершить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
