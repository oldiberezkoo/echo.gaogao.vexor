"use client";

import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
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
  title: string;
  description: string;
  answers: Answer[];
};

export default function PracticePage() {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isVibrationSupported, setIsVibrationSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /** ВАЖНО: отдельно управляем раскрытием результатов */
  const [isRevealed, setIsRevealed] = useState(false);

  /** Таймер (только клиент) */
  const [remaining, setRemaining] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const questions: Question[] = [
    {
      id: 1,
      title: "Название вопроса 1",
      description: "Описание вопроса и практика",
      answers: [
        { id: 1, text: "Правильный ответ", isCorrect: true },
        {
          id: 2,
          text: "Неправильный ответ",
          isCorrect: false,
          explanation: "Это неправильно, потому что...",
        },
        { id: 3, text: "Еще один неправильный ответ", isCorrect: false },
        { id: 4, text: "Тоже неправильный ответ", isCorrect: false },
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  /* ---------------- Vibration ---------------- */

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

  /* ---------------- Timer (10 min) ---------------- */

  useEffect(() => {
    const TOTAL = 10 * 60;
    setRemaining(TOTAL);

    timerRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev === null || prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsRevealed(true);
          setIsDialogOpen(true);
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

  /* ---------------- Answers logic ---------------- */

  const handleAnswerSelect = (answerId: number) => {
    if (selectedAnswerId !== null) return;
    setSelectedAnswerId(answerId);
    triggerVibration(50);
  };

  const handleNextQuestion = () => {
    if (selectedAnswerId === null) {
      triggerVibration(100);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswerId(null);
        setIsRevealed(false);
      } else {
        setIsDialogOpen(true);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleFinishTest = () => {
    setIsRevealed(true);
    setIsDialogOpen(false);
    if (timerRef.current) clearInterval(timerRef.current);
    triggerVibration([100, 50, 100]);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    triggerVibration(50);
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDialogOpen) {
        handleCloseDialog();
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isDialogOpen]);

  /** Результаты показываем ТОЛЬКО после завершения */
  const showResult = isRevealed;

  /* ======================== UI ======================== */

  return (
    <div className="w-full h-full min-h-screen py-6 px-4 flex flex-col gap-6 ">
      {/* Header */}
      <div className="flex flex-row w-full items-center justify-between">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="p-3 bg-neutral-800 rounded-full"
        >
          <XMarkIcon className="size-6 text-neutral-400" />
        </button>

        <p className="text-neutral-300 text-sm font-medium">
          {remaining === null ? "—" : `Осталось ${formatTime(remaining)}`}
        </p>
      </div>

      {/* Progress */}
      <div className="w-full bg-neutral-800 rounded-full h-2">
        <div
          className="bg-[#36F79A] h-full rounded-full transition-all duration-500"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-[#36F79A]">
          {currentQuestion.title}
        </h1>
        <p className="text-neutral-300">{currentQuestion.description}</p>
      </div>

      {/* Answers */}
      <div className="flex flex-col gap-2 flex-1">
        {currentQuestion.answers.map((answer) => {
          const isSelected = selectedAnswerId === answer.id;
          const isCorrect = answer.isCorrect;

          let buttonClass = `
            w-full flex gap-4 items-start px-5 py-5 rounded-3xl text-left
            transition-all duration-300 focus:outline-none
          `;

          if (!showResult) {
            buttonClass += `
              bg-neutral-800 hover:bg-neutral-700
              ${isSelected ? "ring-2 ring-[#36F79A]" : ""}
            `;
          } else if (isSelected && isCorrect) {
            buttonClass += " bg-gradient-to-r from-[#36F79A] to-[#2CDB8E]";
          } else if (isSelected && !isCorrect) {
            buttonClass += " bg-gradient-to-r from-[#ED0A35] to-[#D60930]";
          } else if (isCorrect) {
            buttonClass += " bg-[#36F79A]/20";
          } else {
            buttonClass += " opacity-50";
          }

          return (
            <div key={answer.id}>
              <button
                onClick={() => handleAnswerSelect(answer.id)}
                disabled={selectedAnswerId !== null}
                className={buttonClass}
              >
                <span className="size-10 rounded-full flex items-center justify-center border">
                  {/* ✔ выбран (до завершения) */}
                  {isSelected && !showResult && (
                    <CheckIcon className="size-6 text-neutral-400" />
                  )}

                  {/* ✔ после завершения — правильный */}
                  {showResult && isSelected && isCorrect && (
                    <CheckIcon className="size-6 text-[#36F79A]" />
                  )}

                  {/* ✖ после завершения — неправильный */}
                  {showResult && isSelected && !isCorrect && (
                    <XMarkIcon className="size-6 text-white" />
                  )}
                </span>

                <p className="flex-1">{answer.text}</p>
              </button>

              {showResult && isSelected && !isCorrect && answer.explanation && (
                <div className="mt-2 ml-14 text-sm text-neutral-300">
                  {answer.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Next */}
      <button
        onClick={handleNextQuestion}
        disabled={selectedAnswerId === null || isLoading}
        className="py-4 rounded-full bg-gradient-to-r from-[#50EBFF] to-[#36F79A] text-neutral-900 font-semibold disabled:opacity-40"
      >
        {currentQuestionIndex < questions.length - 1
          ? "Следующий вопрос"
          : "Завершить тест"}
      </button>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-neutral-900 p-6 rounded-2xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Завершить тест?</h2>
            <div className="flex gap-3">
              <button
                onClick={handleCloseDialog}
                className="flex-1 py-3 rounded-full border"
              >
                Продолжить
              </button>
              <button
                onClick={handleFinishTest}
                className="flex-1 py-3 rounded-full bg-[#36F79A] text-black"
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
