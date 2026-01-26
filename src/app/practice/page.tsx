"use client";

import {
  ArrowLeftIcon,
  ChartBarIcon,
  CheckIcon,
  ClockIcon,
  TrophyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type Answer = {
  id: number;
  text: string;
  isCorrect: boolean;
  explanation?: string;
};

type Question = {
  id: number;
  type: "single" | "multiple" | "text";
  title: string;
  description: string;
  answers?: Answer[];
  correctText?: string;
  points: number;
  topic: string;
  topicLink: string;
};

type LeaderboardEntry = {
  name: string;
  avatar: string;
  points: number;
  time: number;
};

export default function PracticePage() {
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [isVibrationSupported, setIsVibrationSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Map<number, any>>(new Map());
  const [startTime] = useState(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateRank, setAnimateRank] = useState(false);

  const [remaining, setRemaining] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // Mock данные
  const questions: Question[] = [
    {
      id: 1,
      type: "single",
      title: "Что такое SwiftUI?",
      description: "Выберите наиболее точное определение",
      points: 1,
      topic: "SwiftUI Basics",
      topicLink: "/docs/swiftui-basics.md",
      answers: [
        {
          id: 1,
          text: "Декларативный фреймворк для создания UI",
          isCorrect: true,
        },
        {
          id: 2,
          text: "Язык программирования",
          isCorrect: false,
          explanation: "SwiftUI - это фреймворк, а не язык программирования",
        },
        {
          id: 3,
          text: "Библиотека для работы с сетью",
          isCorrect: false,
        },
        { id: 4, text: "Инструмент для тестирования", isCorrect: false },
      ],
    },
    {
      id: 2,
      type: "multiple",
      title: "Какие из этих паттернов используются в iOS?",
      description: "Выберите все правильные варианты",
      points: 1,
      topic: "Архитектура iOS",
      topicLink: "/docs/architecture.md",
      answers: [
        { id: 5, text: "MVC", isCorrect: true },
        { id: 6, text: "MVVM", isCorrect: true },
        {
          id: 7,
          text: "Django",
          isCorrect: false,
          explanation: "Django - это веб-фреймворк для Python",
        },
        { id: 8, text: "VIPER", isCorrect: true },
      ],
    },
    {
      id: 3,
      type: "text",
      title: "Напишите модификатор для изменения цвета фона в SwiftUI",
      description: "Введите название метода (без параметров)",
      correctText: "background",
      points: 3,
      topic: "SwiftUI Modifiers",
      topicLink: "/docs/swiftui-modifiers.md",
    },
    {
      id: 4,
      type: "single",
      title: "Что такое Combine?",
      description: "Определите правильное назначение фреймворка",
      points: 1,
      topic: "Reactive Programming",
      topicLink: "/docs/combine.md",
      answers: [
        {
          id: 9,
          text: "Фреймворк для реактивного программирования",
          isCorrect: true,
        },
        { id: 10, text: "Инструмент для объединения файлов", isCorrect: false },
        { id: 11, text: "База данных", isCorrect: false },
        {
          id: 12,
          text: "Тестовый фреймворк",
          isCorrect: false,
          explanation: "Для тестирования используется XCTest",
        },
      ],
    },
  ];

  const leaderboard: LeaderboardEntry[] = [
    { name: "Алексей К.", avatar: "AK", points: 29, time: 3 },
    { name: "Мария С.", avatar: "МС", points: 27, time: 4 },
    { name: "Иван П.", avatar: "ИП", points: 25, time: 5 },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const totalTestTime = 15;

  // Вибрация
  useEffect(() => {
    setIsVibrationSupported(
      typeof window !== "undefined" && "vibrate" in navigator
    );
  }, []);

  const triggerVibration = useCallback(
    (pattern: number | number[]) => {
      if (isVibrationSupported) {
        navigator.vibrate(pattern);
      }
    },
    [isVibrationSupported]
  );

  // Таймер
  useEffect(() => {
    const TOTAL = totalTestTime * 60;
    setRemaining(TOTAL);

    timerRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev === null || prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // Логика ответов
  const handleSingleAnswer = (answerId: number) => {
    if (showResult) return;
    setSelectedAnswers([answerId]);
    triggerVibration(50);
  };

  const handleMultipleAnswer = (answerId: number) => {
    if (showResult) return;
    setSelectedAnswers((prev) =>
      prev.includes(answerId)
        ? prev.filter((id) => id !== answerId)
        : [...prev, answerId]
    );
    triggerVibration(30);
  };

  const handleNextQuestion = () => {
    const answer =
      currentQuestion.type === "text" ? textAnswer : selectedAnswers;

    if (
      (currentQuestion.type === "text" && !textAnswer.trim()) ||
      (currentQuestion.type !== "text" && selectedAnswers.length === 0)
    ) {
      triggerVibration(100);
      return;
    }

    if (!showResult) {
      setShowResult(true);
      setUserAnswers((prev) => new Map(prev).set(currentQuestion.id, answer));
      triggerVibration(50);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswers([]);
        setTextAnswer("");
        setShowResult(false);
      } else {
        handleFinishTest();
      }
      setIsLoading(false);
    }, 300);
  };

  const handleFinishTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsFinished(true);
    triggerVibration([100, 50, 100]);
  };

  const handleExitClick = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    handleFinishTest();
    setShowExitModal(false);
  };

  // Подсчет результатов с учетом частично правильных ответов
  const calculateResults = () => {
    let correctAnswers = 0;
    let totalPoints = 0;
    let wrongTopics = new Set<string>();

    questions.forEach((q) => {
      const userAnswer = userAnswers.get(q.id);
      if (!userAnswer) return;

      if (q.type === "text") {
        if (userAnswer.toLowerCase().trim() === q.correctText?.toLowerCase()) {
          correctAnswers++;
          totalPoints += q.points;
        } else {
          wrongTopics.add(q.topic);
        }
      } else if (q.type === "single") {
        const correct = q.answers?.find((a) => a.isCorrect);
        if (userAnswer[0] === correct?.id) {
          correctAnswers++;
          totalPoints += q.points;
        } else {
          wrongTopics.add(q.topic);
        }
      } else if (q.type === "multiple") {
        const correctIds =
          q.answers?.filter((a) => a.isCorrect).map((a) => a.id) || [];
        const selectedCorrect = userAnswer.filter((id: number) =>
          correctIds.includes(id)
        ).length;
        const selectedIncorrect = userAnswer.filter(
          (id: number) => !correctIds.includes(id)
        ).length;

        const partialPoints = selectedCorrect - selectedIncorrect;

        if (partialPoints === correctIds.length && selectedIncorrect === 0) {
          correctAnswers++;
          totalPoints += q.points;
        } else if (partialPoints > 0) {
          totalPoints += partialPoints * 0.25; // Частичный балл
          wrongTopics.add(q.topic);
        } else {
          wrongTopics.add(q.topic);
        }
      }
    });

    const timeTaken = Math.floor((Date.now() - startTime) / 1000 / 60);
    const percentage = (correctAnswers / questions.length) * 100;
    const userRank =
      leaderboard.filter((l) => l.points > totalPoints).length + 1;

    return {
      correctAnswers,
      totalPoints,
      wrongTopics: Array.from(wrongTopics),
      percentage,
      timeTaken,
      userRank,
    };
  };

  const results = isFinished ? calculateResults() : null;

  // Анимация конфетти
  useEffect(() => {
    if (isFinished && results && results.percentage >= 70) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [isFinished, results]);

  // Анимация рейтинга
  useEffect(() => {
    if (isFinished && results) {
      setTimeout(() => setAnimateRank(true), 500);
    }
  }, [isFinished, results]);

  const isAnswerCorrect = () => {
    if (currentQuestion.type === "text") {
      return (
        textAnswer.toLowerCase().trim() ===
        currentQuestion.correctText?.toLowerCase()
      );
    } else if (currentQuestion.type === "single") {
      const correct = currentQuestion.answers?.find((a) => a.isCorrect);
      return selectedAnswers[0] === correct?.id;
    } else if (currentQuestion.type === "multiple") {
      const correctIds =
        currentQuestion.answers?.filter((a) => a.isCorrect).map((a) => a.id) ||
        [];
      return (
        correctIds.length === selectedAnswers.length &&
        correctIds.every((id: number) => selectedAnswers.includes(id))
      );
    }
    return false;
  };

  // Конфетти компонент
  const Confetti = () => {
    if (!showConfetti) return null;

    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: "-10%",
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: ["#36F79A", "#50EBFF", "#ED0A35", "#FFD700"][
                  Math.floor(Math.random() * 4)
                ],
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  // Результаты
  if (isFinished && results) {
    const getStatusMessage = () => {
      if (results.percentage >= 90)
        return { text: "Идеально!", color: "text-[#36F79A]" };
      if (results.percentage >= 70)
        return { text: "Отлично!", color: "text-[#36F79A]" };
      if (results.percentage >= 50)
        return { text: "Почти готово!", color: "text-[#50EBFF]" };
      return { text: "Продолжайте!", color: "text-neutral-300" };
    };

    const status = getStatusMessage();

    return (
      <div className="w-full min-h-screen py-6 px-4 flex flex-col gap-6">
        <Confetti />

        <div className="flex flex-row w-full items-center justify-between">
          <button
            onClick={() => router.push("/block")}
            className="p-3 bg-neutral-800 rounded-full"
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
            <TrophyIcon className="size-6 text-[#36F79A]" />
            Ваши коллеги
          </h2>
          <div className="space-y-3">
            {leaderboard.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 bg-neutral-900 rounded-2xl"
              >
                <div className="size-12 rounded-full bg-[#36F79A] flex items-center justify-center text-black font-bold">
                  {entry.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{entry.name}</p>
                  <p className="text-neutral-400 text-sm">
                    за {entry.time} минуты
                  </p>
                </div>
                <div className="text-[#36F79A] font-bold text-xl">
                  {entry.points}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-4 p-4 bg-[#36F79A] rounded-2xl">
              <div className="size-12 rounded-full bg-black flex items-center justify-center text-[#36F79A] font-bold">
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
            <div className="absolute inset-0 bg-[#36F79A]/5 animate-pulse" />
          )}
          <p className="text-neutral-300 text-center mb-4 relative z-10">
            Вы правильно ответили на{" "}
            <span className="text-[#36F79A] font-bold">
              {results.correctAnswers}
            </span>{" "}
            из <span className="font-bold">{questions.length}</span> вопросов
          </p>

          {results.wrongTopics.length > 0 && (
            <>
              <p className="text-neutral-400 text-sm text-center mb-4">
                Просмотрите эти темы, чтобы улучшить результаты:
              </p>
              <div className="space-y-2">
                {questions
                  .filter((q) => results.wrongTopics.includes(q.topic))
                  .map((q) => (
                    <a
                      key={q.id}
                      href={q.topicLink}
                      className="flex items-center justify-between p-4 bg-neutral-900 rounded-2xl hover:bg-neutral-700 transition"
                    >
                      <span className="text-white">{q.topic}</span>
                      <span className="text-neutral-500 text-sm">
                        {q.topicLink}
                      </span>
                    </a>
                  ))}
              </div>
            </>
          )}
        </div>

        <div className="bg-neutral-800 rounded-3xl p-6 relative overflow-hidden">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <ChartBarIcon className="size-6 text-[#36F79A]" />
            Ваш рейтинг
          </h2>
          <div className="text-center">
            <div
              className={`text-5xl font-bold text-[#36F79A] mb-2 transition-all duration-1000 ${
                animateRank ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            >
              {results.userRank}
            </div>
            <p className="text-neutral-400">место в блоке</p>
          </div>

          {animateRank && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#36F79A]/20 rounded-full animate-ping" />
            </div>
          )}
        </div>

        <button
          onClick={() => router.push("/block")}
          className="py-4 rounded-full bg-[#36F79A] text-black font-semibold"
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

  return (
    <div className="w-full min-h-screen py-6 px-4 flex flex-col gap-6">
      <div className="flex flex-row w-full items-center justify-between">
        <button
          onClick={handleExitClick}
          className="p-3 bg-neutral-800 rounded-full"
        >
          <XMarkIcon className="size-6 text-neutral-400" />
        </button>

        <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-full">
          <ClockIcon className="size-5 text-[#36F79A]" />
          <p className="text-neutral-300 text-sm font-medium">
            Осталось: {remaining === null ? "—" : formatTime(remaining)}
          </p>
        </div>
      </div>

      <div className="bg-neutral-800 rounded-3xl p-6">
        <div className="mb-4">
          <span className="text-sm text-neutral-400">
            {currentQuestionIndex + 1}/{questions.length} вопрос
          </span>
        </div>

        <h1 className="text-2xl font-bold text-[#36F79A] mb-3">
          {currentQuestion.title}
        </h1>
        <p className="text-neutral-300">{currentQuestion.description}</p>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {currentQuestion.type === "text" ? (
          <div className="bg-neutral-800 rounded-3xl p-1">
            <input
              type="text"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={showResult}
              placeholder="Введите ваш ответ..."
              className={`
                w-full px-6 py-5 bg-transparent text-white placeholder-neutral-500 outline-none text-lg
                ${
                  showResult &&
                  (isAnswerCorrect() ? "text-[#36F79A]" : "text-[#ED0A35]")
                }
              `}
            />
          </div>
        ) : (
          currentQuestion.answers?.map((answer) => {
            const isSelected = selectedAnswers.includes(answer.id);
            const isCorrect = answer.isCorrect;

            let buttonClass = `w-full flex gap-4 items-start px-5 py-5 rounded-3xl text-left transition-all duration-300`;

            if (!showResult) {
              buttonClass += ` bg-neutral-800 hover:bg-neutral-700 ${
                isSelected ? "ring-2 ring-[#36F79A]" : ""
              }`;
            } else {
              if (isSelected && isCorrect) {
                buttonClass += " bg-[#36F79A]";
              } else if (isSelected && !isCorrect) {
                buttonClass += " bg-[#ED0A35]";
              } else if (isCorrect) {
                buttonClass += " bg-[#36F79A]";
              } else {
                buttonClass += " bg-neutral-800 opacity-50";
              }
            }

            return (
              <div key={answer.id}>
                <button
                  onClick={() =>
                    currentQuestion.type === "single"
                      ? handleSingleAnswer(answer.id)
                      : handleMultipleAnswer(answer.id)
                  }
                  disabled={showResult}
                  className={buttonClass}
                >
                  <span
                    className={`size-10 rounded-full flex items-center justify-center transition-all ${
                      isSelected && !showResult
                        ? "bg-[#36F79A] border-0"
                        : "border border-neutral-600"
                    } ${
                      showResult && (isCorrect || (isSelected && !isCorrect))
                        ? "border-0"
                        : ""
                    }`}
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
                    <div className="mt-2 ml-14 text-sm text-neutral-300 bg-neutral-800 p-4 rounded-2xl">
                      {answer.explanation}
                    </div>
                  )}
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={handleNextQuestion}
        disabled={
          (!showResult &&
            ((currentQuestion.type === "text" && !textAnswer.trim()) ||
              (currentQuestion.type !== "text" &&
                selectedAnswers.length === 0))) ||
          isLoading
        }
        className="py-4 rounded-full bg-[#36F79A] text-black font-semibold disabled:opacity-40"
      >
        {isLoading
          ? "Загрузка..."
          : showResult
          ? currentQuestionIndex < questions.length - 1
            ? "Следующий вопрос"
            : "Завершить тест"
          : "Проверить"}
      </button>

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-neutral-900 p-6 rounded-3xl max-w-sm w-full">
            <h2 className="text-xl font-bold text-white mb-2">
              Завершить тест?
            </h2>
            <p className="text-neutral-400 text-sm mb-6">
              Вы завершите тест и получите баллы только за {userAnswers.size} из{" "}
              {questions.length} вопросов
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-3 rounded-full border border-neutral-700 text-white hover:bg-neutral-800 transition"
              >
                Продолжить
              </button>
              <button
                onClick={handleConfirmExit}
                className="flex-1 py-3 rounded-full bg-[#36F79A] text-black font-semibold hover:bg-[#2CDB8E] transition"
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
