"use client";

import { QuestionType, type Answer, type Question } from "@/entities/question";
import { Modal } from "@/shared/ui/organisms/Modal";
import { PhotoIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface QuestionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  question?: Question;
  onSave: (question: Omit<Question, "id"> & { id?: number }) => void;
  nextId: number;
}

export function QuestionEditModal({
  isOpen,
  onClose,
  question,
  onSave,
  nextId,
}: QuestionEditModalProps) {
  const [type, setType] = useState<QuestionType>(QuestionType.Single);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [points, setPoints] = useState(1);
  const [answers, setAnswers] = useState<Answer[]>([
    { id: 1, text: "", isCorrect: false },
    { id: 2, text: "", isCorrect: false },
  ]);
  const [correctText, setCorrectText] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (question) {
        // Edit mode
        setType(question.type);
        setTitle(question.title);
        setImageUrl(question.imageUrl || "");
        setPoints(question.points);
        if (question.answers) {
          setAnswers(question.answers);
        }
        if (question.correctText) {
          setCorrectText(question.correctText);
        }
      } else {
        // Create mode - reset
        setType(QuestionType.Single);
        setTitle("");
        setImageUrl("");
        setPoints(1);
        setAnswers([
          { id: 1, text: "", isCorrect: false },
          { id: 2, text: "", isCorrect: false },
        ]);
        setCorrectText("");
      }
    }
  }, [isOpen, question]);

  const handleSave = () => {
    const newQuestion: Omit<Question, "id"> & { id?: number } = {
      id: question?.id || nextId,
      type,
      title,
      description: "", // Пустое описание
      imageUrl: imageUrl || undefined,
      points,
      topic: "", // Пустая тема - теперь на уровне блока
      topicLink: "", // Пустая ссылка - теперь на уровне блока
    };

    if (type === QuestionType.Text) {
      newQuestion.correctText = correctText;
    } else {
      newQuestion.answers = answers.filter((a) => a.text.trim() !== "");
    }

    onSave(newQuestion);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const addAnswer = () => {
    const newId = Math.max(...answers.map((a) => a.id), 0) + 1;
    setAnswers([...answers, { id: newId, text: "", isCorrect: false }]);
  };

  const removeAnswer = (id: number) => {
    if (answers.length > 2) {
      setAnswers(answers.filter((a) => a.id !== id));
    }
  };

  const updateAnswer = (id: number, text: string) => {
    setAnswers(answers.map((a) => (a.id === id ? { ...a, text } : a)));
  };

  const toggleCorrect = (id: number) => {
    if (type === QuestionType.Single) {
      // Only one correct answer for single choice
      setAnswers(
        answers.map((a) => ({
          ...a,
          isCorrect: a.id === id ? !a.isCorrect : false,
        })),
      );
    } else {
      // Multiple correct answers for multiple choice
      setAnswers(
        answers.map((a) =>
          a.id === id ? { ...a, isCorrect: !a.isCorrect } : a,
        ),
      );
    }
  };

  const updateExplanation = (id: number, explanation: string) => {
    setAnswers(answers.map((a) => (a.id === id ? { ...a, explanation } : a)));
  };

  const isValid = () => {
    if (!title.trim()) return false;
    if (points < 1) return false;

    if (type === QuestionType.Text) {
      return correctText.trim() !== "";
    } else {
      const validAnswers = answers.filter((a) => a.text.trim() !== "");
      const hasCorrect = validAnswers.some((a) => a.isCorrect);
      return validAnswers.length >= 2 && hasCorrect;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} position="bottom">
      <div className="bg-[#121212] rounded-t-[32px] p-6 border-t border-white/10 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col">
          <div className="w-12 h-1.5 bg-neutral-800 rounded-full mb-6 mx-auto" />

          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-6">
            {question ? "Редактировать вопрос" : "Новый вопрос"}
          </h2>

          {/* Question Type */}
          <div className="space-y-2 mb-6">
            <label className="text-sm text-neutral-400">Тип вопроса</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: QuestionType.Single, label: "Один ответ" },
                { value: QuestionType.Multiple, label: "Множественный" },
                { value: QuestionType.Text, label: "Текст" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setType(option.value)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    type === option.value
                      ? "bg-[#3BCBFF] text-black"
                      : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question Title */}
          <div className="space-y-2 mb-6">
            <label className="text-sm text-neutral-400">Текст вопроса</label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#3BCBFF] transition-colors resize-none"
              placeholder="Введите вопрос"
              rows={3}
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2 mb-6">
            <label className="text-sm text-neutral-400">
              Изображение (URL)
            </label>
            <div className="relative">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-neutral-900 border border-neutral-800 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#3BCBFF] transition-colors"
                placeholder="https://example.com/image.jpg"
              />
              <PhotoIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            </div>
            {imageUrl && (
              <div className="relative mt-2">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Points */}
          <div className="space-y-2 mb-6">
            <label className="text-sm text-neutral-400">Баллы за ответ</label>
            <input
              type="number"
              min="1"
              value={points}
              onChange={(e) =>
                setPoints(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#3BCBFF] transition-colors"
            />
          </div>

          {/* Answers Section */}
          {type === QuestionType.Text ? (
            <div className="space-y-2 mb-6">
              <label className="text-sm text-neutral-400">
                Правильный ответ
              </label>
              <input
                type="text"
                value={correctText}
                onChange={(e) => setCorrectText(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#3BCBFF] transition-colors"
                placeholder="Введите правильный ответ"
              />
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <label className="text-sm text-neutral-400">
                  Варианты ответов
                  {type === QuestionType.Multiple && (
                    <span className="ml-2 text-xs text-neutral-500">
                      (можно выбрать несколько правильных)
                    </span>
                  )}
                </label>
                <button
                  onClick={addAnswer}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#3BCBFF]/10 text-[#3BCBFF] rounded-lg text-sm font-medium hover:bg-[#3BCBFF]/20 transition"
                >
                  <PlusIcon className="w-4 h-4" />
                  Добавить
                </button>
              </div>

              {answers.map((answer, idx) => (
                <div
                  key={answer.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox/Radio */}
                    <button
                      onClick={() => toggleCorrect(answer.id)}
                      className={`flex-none mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        answer.isCorrect
                          ? "bg-[#3BCBFF] border-[#3BCBFF]"
                          : "border-neutral-700 bg-neutral-800"
                      }`}
                    >
                      {answer.isCorrect && (
                        <svg
                          className="w-4 h-4 text-black"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* Answer text */}
                    <input
                      type="text"
                      value={answer.text}
                      onChange={(e) => updateAnswer(answer.id, e.target.value)}
                      className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#3BCBFF] transition-colors"
                      placeholder={`Вариант ${idx + 1}`}
                    />

                    {/* Delete button */}
                    {answers.length > 2 && (
                      <button
                        onClick={() => removeAnswer(answer.id)}
                        className="flex-none p-2 hover:bg-red-500/10 rounded-lg text-neutral-600 hover:text-red-500 transition"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Explanation for all answers */}
                  <input
                    type="text"
                    value={answer.explanation || ""}
                    onChange={(e) =>
                      updateExplanation(answer.id, e.target.value)
                    }
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-[#3BCBFF] transition-colors"
                    placeholder={
                      answer.isCorrect
                        ? "Подсказка для правильного ответа (опционально)"
                        : "Объяснение почему ответ неверный (опционально)"
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCancel}
              className="flex-1 py-4 rounded-2xl bg-neutral-900 text-white font-semibold border border-neutral-800 active:scale-95 transition-all duration-200 hover:bg-neutral-800"
            >
              Отменить
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid()}
              className={`flex-1 py-4 rounded-2xl text-black font-bold active:scale-95 transition-all duration-200 shadow-lg ${
                isValid()
                  ? "bg-[#3BCBFF] hover:bg-[#2CDB8E]"
                  : "bg-neutral-700 text-neutral-500 cursor-not-allowed"
              }`}
            >
              {question ? "Сохранить" : "Создать"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
