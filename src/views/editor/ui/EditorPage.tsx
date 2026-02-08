"use client";

import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { Link, useTransitionRouter } from "next-view-transitions";
import { useState } from "react";

import { QuestionType } from "@/entities/question";
import { LabelEditModal } from "@/features/label-edit";
import { blocksAtom } from "@/shared/model/blocks";
import { questionsAtom } from "@/shared/model/questions";

interface EditorPageProps {
  blockId: string;
}

export function EditorPage({ blockId }: EditorPageProps) {
  const router = useTransitionRouter();
  const [blocks, setBlocks] = useAtom(blocksAtom);
  const [questionsMap, setQuestionsMap] = useAtom(questionsAtom);

  const block = blocks.find((b) => b.id === blockId);
  const questions = questionsMap[blockId] || [];
console.log("blocks:", blocks);
console.log("blockId:", blockId);

  const [showSettings, setShowSettings] = useState(false);

  if (!block) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Блок не найден
      </div>
    );
  }

  const handleUpdateBlock = (
    label: string,
    icon: string,
    color: string,
    isVisible: boolean,
  ) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId ? { ...b, text: label, icon, color, isVisible } : b,
      ),
    );
  };

  const handleDeleteBlock = () => {
    if (confirm("Вы уверены, что хотите удалить этот блок?")) {
      setBlocks((prev) => prev.filter((b) => b.id !== blockId));
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

  return (
    <div className="w-full max-w-[768px] mx-auto min-h-screen px-4 py-6 text-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
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

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-neutral-200">
            Вопросы ({questions.length})
          </h2>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#3BCBFF]/10 text-[#3BCBFF] rounded-full text-sm font-medium hover:bg-[#3BCBFF]/20 transition"
            onClick={() => alert("Функционал добавления вопросов в разработке")}
          >
            <PlusIcon className="size-4" />
            Добавить
          </button>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900 rounded-3xl border border-neutral-800 border-dashed">
            <p className="text-neutral-500 mb-4">
              В этом блоке пока нет вопросов
            </p>
            <button
              className="px-6 py-3 bg-[#3BCBFF] text-black rounded-xl font-semibold hover:bg-[#2CDB8E] transition"
              onClick={() =>
                alert("Функционал добавления вопросов в разработке")
              }
            >
              Создать первый вопрос
            </button>
          </div>
        ) : (
          questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 flex gap-4"
            >
              <div className="flex-none flex items-center justify-center size-8 bg-neutral-800 rounded-full text-sm text-neutral-400 font-medium">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-white mb-1 line-clamp-2">
                    {q.title}
                  </p>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 hover:bg-red-500/10 rounded-lg text-neutral-600 hover:text-red-500 transition"
                  >
                    <TrashIcon className="size-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-400 border border-neutral-700">
                    {q.type === QuestionType.Single
                      ? "Один ответ"
                      : q.type === QuestionType.Multiple
                        ? "Множественный"
                        : "Текст"}
                  </span>
                  <span>{q.points} баллов</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <LabelEditModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title={`Настройки блока "${block.text}"`}
        initialLabel={block.text}
        initialIcon={block.icon}
        initialColor={block.color}
        initialIsVisible={block.isVisible}
        onSave={handleUpdateBlock}
        onDelete={handleDeleteBlock}
      />
    </div>
  );
}
