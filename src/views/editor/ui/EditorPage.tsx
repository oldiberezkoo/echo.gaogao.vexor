"use client";

import {
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  Cog6ToothIcon,
  PencilIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { Link, useTransitionRouter } from "next-view-transitions";
import { useState } from "react";

import { QuestionType, type Question } from "@/entities/question";
import { LabelEditModal } from "@/features/label-edit";
import { QuestionEditModal } from "@/features/question-edit";
import { blocksAtom } from "@/shared/model/blocks";
import { questionsAtom } from "@/shared/model/questions";

interface EditorPageProps {
  blockId: string;
}

// Types for Knowledge Base
interface Product {
  id: string;
  name: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  products: Product[];
}

// Mock Knowledge Base Data (замените на реальные данные из вашего API)
const KNOWLEDGE_BASE: Category[] = [
  {
    id: "electronics",
    name: "Электроника",
    products: [
      {
        id: "iphone15",
        name: "iPhone 15 Pro",
        description: "Флагманский смартфон Apple с титановым корпусом",
      },
      {
        id: "samsung-s24",
        name: "Samsung Galaxy S24",
        description: "Флагманский Android смартфон с AI функциями",
      },
      {
        id: "macbook-pro",
        name: "MacBook Pro M3",
        description: "Профессиональный ноутбук на чипе M3",
      },
    ],
  },
  {
    id: "appliances",
    name: "Бытовая техника",
    products: [
      {
        id: "lg-fridge",
        name: "Холодильник LG InstaView",
        description: "Умный холодильник с прозрачной дверцей",
      },
      {
        id: "bosch-washer",
        name: "Стиральная машина Bosch Serie 8",
        description: "Стиральная машина премиум класса",
      },
      {
        id: "dyson-vacuum",
        name: "Пылесос Dyson V15",
        description: "Беспроводной пылесос с лазерной подсветкой",
      },
    ],
  },
  {
    id: "software",
    name: "Программное обеспечение",
    products: [
      {
        id: "claude-ai",
        name: "Claude AI",
        description: "AI-ассистент от Anthropic",
      },
      {
        id: "notion",
        name: "Notion",
        description: "Универсальное рабочее пространство",
      },
      {
        id: "figma",
        name: "Figma",
        description: "Инструмент для дизайна и прототипирования",
      },
    ],
  },
];

export function EditorPage({ blockId }: EditorPageProps) {
  const router = useTransitionRouter();
  const [blocks, setBlocks] = useAtom(blocksAtom);
  const [questionsMap, setQuestionsMap] = useAtom(questionsAtom);

  const block = blocks.find((b) => b.id === blockId);
  const questions = questionsMap[blockId] || [];

  const [showSettings, setShowSettings] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>(
    undefined,
  );
  const [showTimeSettings, setShowTimeSettings] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  if (!block) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Блок не найден
      </div>
    );
  }

  const handleUpdateBlock = (
    label: string,
    description: string,
    topicLink: string,
    icon: string,
    color: string,
    isVisible: boolean,
  ) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? {
              ...b,
              text: label,
              description,
              topicLink,
              icon,
              color,
              isVisible,
            }
          : b,
      ),
    );
  };

  const handleDeleteBlock = () => {
    if (confirm("Вы уверены, что хотите удалить этот блок?")) {
      setBlocks((prev) => prev.filter((b) => b.id !== blockId));
      setQuestionsMap((prev) => {
        const newMap = { ...prev };
        delete newMap[blockId];
        return newMap;
      });
      router.push("/");
    }
  };

  const handleDeleteQuestion = (questionId: number) => {
    if (confirm("Удалить этот вопрос?")) {
      setQuestionsMap((prev) => ({
        ...prev,
        [blockId]: prev[blockId].filter((q) => q.id !== questionId),
      }));
    }
  };

  const handleSaveQuestion = (
    questionData: Omit<Question, "id"> & { id?: number },
  ) => {
    setQuestionsMap((prev) => {
      const currentQuestions = prev[blockId] || [];

      if (
        questionData.id &&
        currentQuestions.some((q) => q.id === questionData.id)
      ) {
        // Update existing question
        return {
          ...prev,
          [blockId]: currentQuestions.map((q) =>
            q.id === questionData.id ? (questionData as Question) : q,
          ),
        };
      } else {
        // Add new question
        const newId =
          currentQuestions.length > 0
            ? Math.max(...currentQuestions.map((q) => q.id)) + 1
            : 1;
        return {
          ...prev,
          [blockId]: [
            ...currentQuestions,
            { ...questionData, id: newId } as Question,
          ],
        };
      }
    });

    setShowQuestionModal(false);
    setEditingQuestion(undefined);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(undefined);
    setShowQuestionModal(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowQuestionModal(true);
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const getNextQuestionId = () => {
    const currentQuestions = questionsMap[blockId] || [];
    return currentQuestions.length > 0
      ? Math.max(...currentQuestions.map((q) => q.id)) + 1
      : 1;
  };

  const handleAIUpdate = (updates: {
    blockName?: string;
    blockDescription?: string;
    timeLimit?: number;
    questions?: Question[];
  }) => {
    if (
      updates.blockName ||
      updates.blockDescription ||
      updates.timeLimit !== undefined
    ) {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === blockId
            ? {
                ...b,
                ...(updates.blockName && { text: updates.blockName }),
                ...(updates.blockDescription && {
                  description: updates.blockDescription,
                }),
                ...(updates.timeLimit !== undefined && {
                  timeLimit: updates.timeLimit || undefined,
                }),
              }
            : b,
        ),
      );
    }

    if (updates.questions) {
      setQuestionsMap((prev) => ({
        ...prev,
        [blockId]: updates.questions!,
      }));
    }
  };

  return (
    <div className="w-full max-w-[568px] mx-auto min-h-screen px-4 py-6 text-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition"
        >
          <ArrowLeftIcon className="size-6 text-neutral-400" />
        </Link>
        <h1 className="text-xl font-bold truncate px-4">{block.text}</h1>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition"
        >
          <Cog6ToothIcon className="size-6 text-neutral-400" />
        </button>
      </div>

      {/* Block Description */}
      {block.description && (
        <div className="mb-6 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <p className="text-neutral-300 text-sm leading-relaxed">
            {block.description}
          </p>
        </div>
      )}

      {/* Quiz Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="text-neutral-400 text-sm mb-1">Всего вопросов</div>
          <div className="text-2xl font-bold text-white">
            {questions.length}
          </div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="text-neutral-400 text-sm mb-1">Всего баллов</div>
          <div className="text-2xl font-bold text-[#3BCBFF]">{totalPoints}</div>
        </div>
      </div>

      {/* Time Settings Button */}
      <button
        onClick={() => setShowTimeSettings(true)}
        className="w-full mb-6 flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-2xl hover:bg-neutral-800 transition"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3BCBFF]/10 rounded-xl">
            <ClockIcon className="w-6 h-6 text-[#3BCBFF]" />
          </div>
          <div className="text-left">
            <div className="text-white font-medium">Время на тест</div>
            <div className="text-neutral-400 text-sm">
              {block.timeLimit ? `${block.timeLimit} минут` : "Не ограничено"}
            </div>
          </div>
        </div>
        <PencilIcon className="w-5 h-5 text-neutral-500" />
      </button>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-neutral-200">
            Вопросы ({questions.length})
          </h2>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-full text-sm font-medium hover:bg-neutral-800 hover:text-white transition"
              onClick={() => setShowAIModal(true)}
            >
              <SparklesIcon className="size-4" />
              AI
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#3BCBFF]/10 text-[#3BCBFF] rounded-full text-sm font-medium hover:bg-[#3BCBFF]/20 transition"
              onClick={handleAddQuestion}
            >
              <PlusIcon className="size-4" />
              Добавить
            </button>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900 rounded-3xl border border-neutral-800 border-dashed">
            <p className="text-neutral-500 mb-4">
              В этом блоке пока нет вопросов
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-6 py-3 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-xl font-semibold hover:bg-neutral-800 hover:text-white transition flex items-center gap-2"
                onClick={() => setShowAIModal(true)}
              >
                <SparklesIcon className="size-5" />
                Сгенерировать с AI
              </button>
              <button
                className="px-6 py-3 bg-[#3BCBFF] text-black rounded-xl font-semibold hover:bg-[#2CDB8E] transition"
                onClick={handleAddQuestion}
              >
                Создать вручную
              </button>
            </div>
          </div>
        ) : (
          questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition group"
            >
              <div className="flex gap-4">
                <div className="flex-none flex items-center justify-center size-8 bg-neutral-800 rounded-full text-sm text-neutral-400 font-medium">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-medium text-white line-clamp-2">
                      {q.title}
                    </p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditQuestion(q)}
                        className="p-1.5 hover:bg-[#3BCBFF]/10 rounded-lg text-neutral-600 hover:text-[#3BCBFF] transition"
                      >
                        <PencilIcon className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 hover:bg-red-500/10 rounded-lg text-neutral-600 hover:text-red-500 transition"
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-400 border border-neutral-700">
                      {q.type === QuestionType.Single
                        ? "Один ответ"
                        : q.type === QuestionType.Multiple
                          ? "Множественный"
                          : "Текст"}
                    </span>
                    <span className="text-[#3BCBFF] font-medium">
                      {q.points} {q.points === 1 ? "балл" : "баллов"}
                    </span>
                  </div>

                  {q.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={q.imageUrl}
                        alt=""
                        className="w-full h-24 object-cover rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Show answers preview */}
                  {q.answers && q.answers.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {q.answers.slice(0, 3).map((answer, ansIdx) => (
                        <div
                          key={answer.id}
                          className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 ${
                            answer.isCorrect
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                          }`}
                        >
                          <span className="opacity-50">
                            {String.fromCharCode(65 + ansIdx)}.
                          </span>
                          <span className="truncate">{answer.text}</span>
                        </div>
                      ))}
                      {q.answers.length > 3 && (
                        <div className="text-xs text-neutral-500 px-3">
                          +{q.answers.length - 3} вариантов
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <LabelEditModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title={`Настройки блока "${block.text}"`}
        initialLabel={block.text}
        initialDescription={block.description}
        initialTopicLink={block.topicLink}
        initialIcon={block.icon}
        initialColor={block.color}
        initialIsVisible={block.isVisible}
        onSave={handleUpdateBlock}
        onDelete={handleDeleteBlock}
      />

      <QuestionEditModal
        isOpen={showQuestionModal}
        onClose={() => {
          setShowQuestionModal(false);
          setEditingQuestion(undefined);
        }}
        question={editingQuestion}
        onSave={handleSaveQuestion}
        nextId={getNextQuestionId()}
      />

      <TimeSettingsModal
        isOpen={showTimeSettings}
        onClose={() => setShowTimeSettings(false)}
        currentTimeLimit={block.timeLimit}
        onSave={(timeLimit) => {
          setBlocks((prev) =>
            prev.map((b) => (b.id === blockId ? { ...b, timeLimit } : b)),
          );
        }}
      />

      <AIGenerationModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        blockId={blockId}
        currentBlock={{
          name: block.text,
          description: block.description,
          timeLimit: block.timeLimit,
        }}
        currentQuestions={questions}
        categories={KNOWLEDGE_BASE}
        onUpdate={handleAIUpdate}
      />
    </div>
  );
}

// Time Settings Modal Component
interface TimeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimeLimit?: number;
  onSave: (timeLimit: number | undefined) => void;
}

function TimeSettingsModal({
  isOpen,
  onClose,
  currentTimeLimit,
  onSave,
}: TimeSettingsModalProps) {
  const [enabled, setEnabled] = useState(!!currentTimeLimit);
  const [minutes, setMinutes] = useState(currentTimeLimit || 30);

  const handleSave = () => {
    onSave(enabled ? minutes : undefined);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end transition-all duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-[568px] mx-auto bg-[#121212] rounded-t-[32px] p-6 border-t border-white/10 transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-12 h-1.5 bg-neutral-800 rounded-full mb-6 mx-auto" />

        <h2 className="text-xl font-bold text-white mb-6">Настройка времени</h2>

        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-2xl mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                enabled
                  ? "bg-[#3BCBFF]/10 text-[#3BCBFF]"
                  : "bg-neutral-800 text-neutral-500"
              }`}
            >
              <ClockIcon className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-medium">Ограничить время</span>
              <span className="text-neutral-400 text-xs">
                {enabled ? "Тест с таймером" : "Без ограничения времени"}
              </span>
            </div>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-14 h-8 rounded-full p-1 transition-colors ${
              enabled ? "bg-[#3BCBFF]" : "bg-neutral-800"
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                enabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Time Input */}
        {enabled && (
          <div className="space-y-2 mb-6">
            <label className="text-sm text-neutral-400">
              Время на прохождение (минуты)
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMinutes(Math.max(1, minutes - 5))}
                className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-bold hover:bg-neutral-800 transition"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={minutes}
                onChange={(e) =>
                  setMinutes(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="flex-1 text-center px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white text-2xl font-bold focus:outline-none focus:border-[#3BCBFF] transition-colors"
              />
              <button
                onClick={() => setMinutes(minutes + 5)}
                className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-bold hover:bg-neutral-800 transition"
              >
                +
              </button>
            </div>
            <p className="text-xs text-neutral-500 text-center">
              Пользователи должны пройти тест за {minutes}{" "}
              {minutes === 1 ? "минуту" : "минут"}
            </p>
          </div>
        )}

        {/* Preset times */}
        {enabled && (
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[15, 30, 45, 60].map((preset) => (
              <button
                key={preset}
                onClick={() => setMinutes(preset)}
                className={`py-3 rounded-xl font-medium transition-all ${
                  minutes === preset
                    ? "bg-[#3BCBFF] text-black"
                    : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800"
                }`}
              >
                {preset}м
              </button>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl bg-neutral-900 text-white font-semibold border border-neutral-800 active:scale-95 transition-all duration-200 hover:bg-neutral-800"
          >
            Отменить
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 rounded-2xl bg-[#3BCBFF] text-black font-bold active:scale-95 transition-all duration-200 shadow-lg hover:bg-[#2CDB8E]"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

// AI Generation Modal Component
interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockId: string;
  currentBlock: {
    name: string;
    description?: string;
    timeLimit?: number;
  };
  currentQuestions: Question[];
  categories: Category[];
  onUpdate: (updates: {
    blockName?: string;
    blockDescription?: string;
    timeLimit?: number;
    questions?: Question[];
  }) => void;
}

function AIGenerationModal({
  isOpen,
  onClose,
  blockId,
  currentBlock,
  currentQuestions,
  categories,
  onUpdate,
}: AIGenerationModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, string[]>
  >({});
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [actionMode, setActionMode] = useState<"add" | "replace" | "modify">(
    "add",
  );
  const [allowBlockChanges, setAllowBlockChanges] = useState(true);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        // Remove category and its products
        const newSelected = prev.filter((id) => id !== categoryId);
        setSelectedProducts((prevProducts) => {
          const { [categoryId]: _, ...rest } = prevProducts;
          return rest;
        });
        return newSelected;
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const toggleProduct = (categoryId: string, productId: string) => {
    setSelectedProducts((prev) => {
      const currentProducts = prev[categoryId] || [];
      if (currentProducts.includes(productId)) {
        const newProducts = currentProducts.filter((id) => id !== productId);
        return newProducts.length > 0
          ? { ...prev, [categoryId]: newProducts }
          : Object.fromEntries(
              Object.entries(prev).filter(([key]) => key !== categoryId),
            );
      } else {
        return {
          ...prev,
          [categoryId]: [...currentProducts, productId],
        };
      }
    });
  };

  const getSelectedProductsInfo = () => {
    const info: Array<{
      category: string;
      product: string;
      description?: string;
    }> = [];

    Object.entries(selectedProducts).forEach(([categoryId, productIds]) => {
      const category = categories.find((c) => c.id === categoryId);
      if (!category) return;

      productIds.forEach((productId) => {
        const product = category.products.find((p) => p.id === productId);
        if (product) {
          info.push({
            category: category.name,
            product: product.name,
            description: product.description,
          });
        }
      });
    });

    return info;
  };

  const canGenerate =
    Object.keys(selectedProducts).length > 0 || customPrompt.trim();

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);

    try {
      const selectedInfo = getSelectedProductsInfo();

      // Формируем контекст из выбранных продуктов
      const productsContext = selectedInfo
        .map(
          (item) =>
            `Категория: ${item.category}\nПродукт: ${item.product}${
              item.description ? `\nОписание: ${item.description}` : ""
            }`,
        )
        .join("\n\n");

      // Формируем контекст текущих вопросов
      const questionsContext =
        currentQuestions.length > 0
          ? `\n\nТекущие вопросы в блоке (${currentQuestions.length} шт.):\n${currentQuestions
              .map(
                (q, idx) =>
                  `${idx + 1}. ID: ${q.id}, Вопрос: "${q.title}", Тип: ${q.type}, Баллы: ${q.points}${
                    q.answers?.length
                      ? `\n   Ответы: ${q.answers.map((a) => `"${a.text}" ${a.isCorrect ? "(✓)" : ""}`).join(", ")}`
                      : ""
                  }`,
              )
              .join("\n")}`
          : "";

      // Формируем системный промпт с типизацией
      const systemPrompt = `Ты - AI ассистент для создания опросов и тестов. Твоя задача - ${
        actionMode === "add"
          ? "создать НОВЫЕ вопросы и добавить их к существующим"
          : actionMode === "replace"
            ? "создать НОВЫЕ вопросы, которые ЗАМЕНЯТ все существующие"
            : "ИЗМЕНИТЬ существующие вопросы (удалить ненужные, улучшить формулировки, добавить новые)"
      }.

${
  allowBlockChanges
    ? `Ты МОЖЕШЬ изменить настройки блока:
- Название блока
- Описание блока
- Время на прохождение теста (в минутах)`
    : `Ты НЕ МОЖЕШЬ изменять настройки блока (название, описание, время).`
}

Текущие настройки блока:
- Название: "${currentBlock.name}"
- Описание: "${currentBlock.description || "не указано"}"
- Время на прохождение: ${currentBlock.timeLimit ? `${currentBlock.timeLimit} минут` : "не ограничено"}
${questionsContext}

${productsContext ? `\nКонтекст из базы знаний:\n${productsContext}` : ""}

Типы вопросов:
- "single" - один правильный ответ из нескольких вариантов (должно быть 4 варианта)
- "multiple" - несколько правильных ответов из нескольких вариантов (должно быть 4-6 вариантов)
- "text" - текстовый ответ (без вариантов ответа)

Верни ответ СТРОГО в формате JSON без каких-либо пояснений, markdown или дополнительного текста:
{
  ${
    allowBlockChanges
      ? `"blockName": "Новое название блока или null если не меняем",
  "blockDescription": "Новое описание блока или null если не меняем",
  "timeLimit": число_минут или null если не меняем или 0 если убираем ограничение,`
      : ""
  }
  "questions": [
    {
      ${
        actionMode === "modify"
          ? `"action": "keep" | "delete" | "update" | "add",
      "id": номер_существующего_вопроса или null для новых,`
          : ""
      }
      "title": "Текст вопроса",
      "type": "single" | "multiple" | "text",
      "points": число от 1 до 10,
      "answers": [
        {
          "text": "Вариант ответа",
          "isCorrect": true/false
        }
      ]
    }
  ]
}`;

      const userPrompt = customPrompt.trim()
        ? customPrompt
        : `Создай интересные и разнообразные вопросы на основе предоставленной информации о продуктах.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          messages: [
            {
              role: "user",
              content: `${systemPrompt}\n\nЗапрос пользователя:\n${userPrompt}`,
            },
          ],
        }),
      });

      const data = await response.json();

      if (!data.content || data.content.length === 0) {
        throw new Error("Пустой ответ от AI");
      }

      const content = data.content.find((c: any) => c.type === "text")?.text;

      if (!content) {
        throw new Error("Не найден текстовый контент в ответе");
      }

      // Извлекаем JSON из ответа
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Не удалось найти JSON в ответе");
      }

      const generated = JSON.parse(jsonMatch[0]);

      if (!generated.questions || !Array.isArray(generated.questions)) {
        throw new Error("Неверный формат ответа от AI");
      }

      // Обрабатываем вопросы в зависимости от режима
      let finalQuestions: Question[];

      if (actionMode === "modify") {
        // Режим модификации - обрабатываем действия для каждого вопроса
        const existingQuestionsMap = new Map(
          currentQuestions.map((q) => [q.id, q]),
        );
        const processedIds = new Set<number>();
        const newQuestions: Question[] = [];
        let nextId =
          currentQuestions.length > 0
            ? Math.max(...currentQuestions.map((q) => q.id)) + 1
            : 1;

        generated.questions.forEach((q: any) => {
          if (q.action === "keep" && q.id) {
            // Оставляем существующий вопрос
            const existing = existingQuestionsMap.get(q.id);
            if (existing) {
              newQuestions.push(existing);
              processedIds.add(q.id);
            }
          } else if (q.action === "update" && q.id) {
            // Обновляем существующий вопрос
            newQuestions.push({
              id: q.id,
              title: q.title,
              type: q.type as QuestionType,
              points: q.points,
              answers:
                q.answers?.map((a: any, idx: number) => ({
                  id: idx + 1,
                  text: a.text,
                  isCorrect: a.isCorrect,
                })) || [],
              imageUrl: q.imageUrl,
            });
            processedIds.add(q.id);
          } else if (q.action === "add" || !q.action) {
            // Добавляем новый вопрос
            newQuestions.push({
              id: nextId++,
              title: q.title,
              type: q.type as QuestionType,
              points: q.points,
              answers:
                q.answers?.map((a: any, idx: number) => ({
                  id: idx + 1,
                  text: a.text,
                  isCorrect: a.isCorrect,
                })) || [],
              imageUrl: q.imageUrl,
            });
          }
          // action === "delete" - просто не добавляем вопрос
        });

        finalQuestions = newQuestions;
      } else if (actionMode === "replace") {
        // Режим замены - полностью заменяем все вопросы
        finalQuestions = generated.questions.map((q: any, idx: number) => ({
          id: idx + 1,
          title: q.title,
          type: q.type as QuestionType,
          points: q.points,
          answers:
            q.answers?.map((a: any, aIdx: number) => ({
              id: aIdx + 1,
              text: a.text,
              isCorrect: a.isCorrect,
            })) || [],
          imageUrl: q.imageUrl,
        }));
      } else {
        // Режим добавления - добавляем к существующим
        const startId =
          currentQuestions.length > 0
            ? Math.max(...currentQuestions.map((q) => q.id)) + 1
            : 1;

        const newQuestions = generated.questions.map((q: any, idx: number) => ({
          id: startId + idx,
          title: q.title,
          type: q.type as QuestionType,
          points: q.points,
          answers:
            q.answers?.map((a: any, aIdx: number) => ({
              id: aIdx + 1,
              text: a.text,
              isCorrect: a.isCorrect,
            })) || [],
          imageUrl: q.imageUrl,
        }));

        finalQuestions = [...currentQuestions, ...newQuestions];
      }

      // Применяем обновления
      const updates: any = {
        questions: finalQuestions,
      };

      if (allowBlockChanges) {
        if (generated.blockName && generated.blockName !== currentBlock.name) {
          updates.blockName = generated.blockName;
        }
        if (generated.blockDescription) {
          updates.blockDescription = generated.blockDescription;
        }
        if (generated.timeLimit !== undefined && generated.timeLimit !== null) {
          updates.timeLimit =
            generated.timeLimit === 0 ? null : generated.timeLimit;
        }
      }

      onUpdate(updates);

      // Сбрасываем форму
      setSelectedCategories([]);
      setSelectedProducts({});
      setCustomPrompt("");
      setActionMode("add");

      onClose();
    } catch (error) {
      console.error("AI generation error:", error);
      alert(
        error instanceof Error
          ? `Ошибка: ${error.message}`
          : "Ошибка при генерации вопросов. Попробуйте снова.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedProductsCount = Object.values(selectedProducts).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end transition-all duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isGenerating ? onClose : undefined}
      />
      <div
        className={`relative w-full max-w-[568px] mx-auto bg-[#121212] rounded-t-[32px] p-6 border-t border-white/10 transform transition-transform duration-300 max-h-[90vh] overflow-y-auto ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-12 h-1.5 bg-neutral-800 rounded-full mb-6 mx-auto" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl">
              <SparklesIcon className="w-5 h-5 text-neutral-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Генератор</h2>
              <p className="text-xs text-neutral-500">
                Создайте вопросы автоматически
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 hover:bg-neutral-900 rounded-lg transition disabled:opacity-50"
          >
            <XMarkIcon className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Action Mode - только если есть текущие вопросы */}
        {currentQuestions.length > 0 && (
          <div className="mb-6 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <label className="text-sm text-neutral-400 font-medium mb-3 block">
              Режим работы
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "add", label: "Добавить", desc: "К существующим" },
                { value: "replace", label: "Заменить", desc: "Все вопросы" },
                { value: "modify", label: "Изменить", desc: "Выборочно" },
              ].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setActionMode(mode.value as any)}
                  disabled={isGenerating}
                  className={`p-3 rounded-xl font-medium transition-all text-left ${
                    actionMode === mode.value
                      ? "bg-[#3BCBFF] text-black"
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  } disabled:opacity-50`}
                >
                  <div className="text-sm font-semibold">{mode.label}</div>
                  <div className="text-xs opacity-75">{mode.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Allow Block Changes Toggle */}
        <div className="mb-6 flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <div>
            <div className="text-sm font-medium text-white">
              Разрешить изменение блока
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">
              Название, описание, время
            </div>
          </div>
          <button
            onClick={() => setAllowBlockChanges(!allowBlockChanges)}
            disabled={isGenerating}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              allowBlockChanges ? "bg-[#3BCBFF]" : "bg-neutral-800"
            } disabled:opacity-50`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                allowBlockChanges ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Categories Selection */}
        <div className="mb-4">
          <label className="text-sm text-neutral-400 font-medium mb-3 block">
            База знаний (необязательно)
          </label>
          <div className="space-y-3">
            {categories.map((category) => {
              const isCategorySelected = selectedCategories.includes(
                category.id,
              );
              const categoryProducts = selectedProducts[category.id] || [];

              return (
                <div key={category.id} className="space-y-2">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    disabled={isGenerating}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      isCategorySelected
                        ? "bg-neutral-900 border border-neutral-700"
                        : "bg-neutral-900 border border-neutral-800 hover:border-neutral-700"
                    } disabled:opacity-50`}
                  >
                    <span className="text-white font-medium text-sm">
                      {category.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {categoryProducts.length > 0 && (
                        <span className="text-xs bg-[#3BCBFF] text-black px-2 py-0.5 rounded-full font-medium">
                          {categoryProducts.length}
                        </span>
                      )}
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isCategorySelected
                            ? "bg-[#3BCBFF] border-[#3BCBFF]"
                            : "border-neutral-600"
                        }`}
                      >
                        {isCategorySelected && (
                          <CheckIcon className="w-3 h-3 text-black" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Products */}
                  {isCategorySelected && (
                    <div className="ml-4 space-y-2 pl-3 border-l-2 border-neutral-800">
                      {category.products.map((product) => {
                        const isProductSelected = categoryProducts.includes(
                          product.id,
                        );

                        return (
                          <button
                            key={product.id}
                            onClick={() =>
                              toggleProduct(category.id, product.id)
                            }
                            disabled={isGenerating}
                            className={`w-full text-left p-3 rounded-lg transition-all ${
                              isProductSelected
                                ? "bg-neutral-800 border border-neutral-700"
                                : "bg-neutral-900 border border-neutral-800 hover:bg-neutral-800"
                            } disabled:opacity-50`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-white font-medium mb-1">
                                  {product.name}
                                </div>
                                {product.description && (
                                  <div className="text-xs text-neutral-500 line-clamp-2">
                                    {product.description}
                                  </div>
                                )}
                              </div>
                              <div
                                className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                  isProductSelected
                                    ? "bg-[#3BCBFF] border-[#3BCBFF]"
                                    : "border-neutral-600"
                                }`}
                              >
                                {isProductSelected && (
                                  <CheckIcon className="w-2.5 h-2.5 text-black" />
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedProductsCount > 0 && (
            <div className="mt-3 p-3 bg-[#3BCBFF]/10 border border-[#3BCBFF]/20 rounded-xl">
              <div className="text-xs text-[#3BCBFF]">
                Выбрано продуктов: {selectedProductsCount}
              </div>
            </div>
          )}
        </div>

        {/* Custom Prompt */}
        <div className="mb-6">
          <label className="text-sm text-neutral-400 font-medium mb-2 block">
            Дополнительные инструкции
          </label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="Например: Создай вопросы о технических характеристиках, добавь сложные вопросы для экспертов, измени формулировку вопроса 3..."
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#3BCBFF] transition-colors resize-none disabled:opacity-50"
            rows={4}
          />
          <p className="text-xs text-neutral-500 mt-2">
            AI автоматически создаст нужное количество вопросов на основе вашего
            запроса
          </p>
        </div>

        {/* Current Questions Info */}
        {currentQuestions.length > 0 && (
          <div className="mb-6 p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
            <div className="text-xs text-neutral-400 mb-2">
              Текущих вопросов в блоке:
            </div>
            <div className="text-2xl font-bold text-white">
              {currentQuestions.length}
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || isGenerating}
          className="w-full py-4 px-6 bg-[#3BCBFF] text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#2CDB8E] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#3BCBFF] disabled:active:scale-100 mb-3"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Генерация...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              {actionMode === "add"
                ? "Добавить вопросы"
                : actionMode === "replace"
                  ? "Заменить все вопросы"
                  : "Изменить вопросы"}
            </>
          )}
        </button>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          disabled={isGenerating}
          className="w-full py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 font-medium hover:bg-neutral-800 hover:text-white transition disabled:opacity-50"
        >
          Отменить
        </button>
      </div>
    </div>
  );
}
