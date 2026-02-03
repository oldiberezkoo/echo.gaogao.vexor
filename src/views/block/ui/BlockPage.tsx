"use client";

import * as HeroIcons from "@heroicons/react/24/outline";
import {
  ArrowLeftIcon,
  PencilIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Link } from "next-view-transitions";
import { useState } from "react";

import type { BlockLabel } from "@/entities/block";
import { LabelEditModal } from "@/features/label-edit";

/**
 * Get icon component by name from HeroIcons
 */
function getIconComponent(iconName: string) {
  const IconComponent = (HeroIcons as any)[iconName];
  return IconComponent || HeroIcons.AcademicCapIcon;
}

/**
 * Block categories for the wine block
 */
const BLOCK_CATEGORIES = [
  "Сорта винограда",
  "Типы вин",
  "Технологии производства",
  "Винные регионы",
];

/**
 * BlockPage Component
 * @description Block detail page with editing capabilities similar to home page
 */
export function BlockPage() {
  // Edit mode state
  const [editMode, setEditMode] = useState(false);

  // Blocks state for sub-categories
  const [subBlocks, setSubBlocks] = useState<BlockLabel[]>([
    {
      id: "sub1",
      text: "Сорта винограда",
      icon: "AcademicCapIcon",
      color: "#3BCBFF",
    },
    { id: "sub2", text: "Типы вин", icon: "AcademicCapIcon", color: "#3BCBFF" },
    {
      id: "sub3",
      text: "Технологии производства",
      icon: "AcademicCapIcon",
      color: "#3BCBFF",
    },
    {
      id: "sub4",
      text: "Винные регионы",
      icon: "AcademicCapIcon",
      color: "#3BCBFF",
    },
  ]);

  const [editingBlock, setEditingBlock] = useState<BlockLabel | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditBlock = (block: BlockLabel) => {
    setEditingBlock(block);
    setShowEditModal(true);
  };

  const handleSaveBlock = (
    label: string,
    icon: string,
    color: string,
    isVisible: boolean,
  ) => {
    if (editingBlock) {
      setSubBlocks((prev) =>
        prev.map((b) =>
          b.id === editingBlock.id
            ? { ...b, text: label, icon, color, isVisible }
            : b,
        ),
      );
    } else {
      const newBlock: BlockLabel = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        text: label || "Новый раздел",
        icon,
        color,
        isVisible,
      };
      setSubBlocks((prev) => [...prev, newBlock]);
    }
  };

  const handleDeleteBlock = () => {
    if (editingBlock) {
      setSubBlocks((prev) => prev.filter((b) => b.id !== editingBlock.id));
    }
  };

  return (
    <div className="w-full h-full py-6 px-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-row w-full items-center justify-between">
        <Link
          href={"/"}
          prefetch={true}
          className="p-2 bg-neutral-800 rounded-full xanimate active:scale-90 "
        >
          <ArrowLeftIcon className="size-6 text-neutral-400" />
        </Link>
        <button
          className="p-2 rounded-full bg-neutral-800 xanimte duration-200 ease-in-out hover:bg-[#3BCBFF] group"
          onClick={() => setEditMode((prev) => !prev)}
        >
          <PencilSquareIcon className="size-5 group-hover:text-neutral-800" />
        </button>
      </div>

      {/* Block Title */}
      <div className="flex flex-col items-start font-sans my-4">
        <div className="flex flex-row items-center justify-between w-full font-medium">
          <h1 className="text-[#3BCBFF] leading-7 text-[26px] ">
            Вино: основы и регионы
          </h1>
          <span className="text-[#3BCBFF] text-[28px] ">0/{5 * 4}</span>
        </div>
        <p className="py-4 text-balance ">
          Пройдите практические задания по основным сортам винограда, видам
          вина, основным винодельческим регионам и процессам производства.
          Проверьте и углубите свои знания, чтобы уверенно разбираться в мире
          вин.
        </p>
      </div>

      {/* Sub-blocks Grid */}
      <div className="flex flex-col gap-0.5">
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-1 w-full">
          {subBlocks.map((block) => {
            const IconComponent = getIconComponent(block.icon);

            return (
              <div key={block.id} className="relative">
                <Link
                  href="/practice"
                  className="py-8 w-full flex flex-col items-center justify-center gap-1 hover:bg-[#3BCBFF] hover:text-neutral-800 bg-neutral-800 rounded-4xl transition active:scale-95"
                >
                  <IconComponent
                    className="size-8"
                    style={{ color: block.color }}
                  />
                  <h1 className="text-sm font-light text-nowrap text-center">
                    {block.text}
                  </h1>
                </Link>
                {editMode && (
                  <button
                    aria-label="Редактировать раздел"
                    className="absolute -right-2 -top-1 border-dashed text-white rounded-full p-1 transition-colors backdrop-blur-sm bg-neutral-800/50 cursor-pointer"
                    onClick={() => handleEditBlock(block)}
                  >
                    <PencilIcon className="size-3" />
                  </button>
                )}
              </div>
            );
          })}
          {editMode && (
            <button
              onClick={() => {
                setEditingBlock(null);
                setShowEditModal(true);
              }}
              className="py-8 w-full flex flex-col items-center justify-center gap-1 border border-[#3BCBFF] text-[#3BCBFF] rounded-4xl transition active:scale-95 hover:bg-neutral-700"
            >
              <span className="size-8 flex items-center justify-center rounded-full font-bold text-2xl">
                +
              </span>
              <span className="text-sm font-light">Добавить раздел</span>
            </button>
          )}
        </div>

        {/* Practice Errors Section */}
        <Link
          href="/practice"
          prefetch={false}
          className="py-8 px-4 w-full flex flex-col items-start justify-start gap-1 bg-[#50EBFF] text-neutral-800 rounded-4xl transition active:scale-95 "
        >
          <h1 className="font-sans font-medium text-[15px] mb-2">
            Практика ошибок: (5)
          </h1>
          <p className="text-[14px]">
            Практикуйте больше те задания, которые у вас хуже всего. <br /> Вы
            справитесь!
          </p>
        </Link>
      </div>

      {/* Label Edit Modal */}
      <LabelEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingBlock(null);
        }}
        title={editingBlock ? "Изменить раздел" : "Добавить раздел"}
        initialLabel={editingBlock?.text || ""}
        initialIcon={editingBlock?.icon || "AcademicCapIcon"}
        initialColor={editingBlock?.color || "#3BCBFF"}
        initialIsVisible={editingBlock?.isVisible}
        onSave={handleSaveBlock}
        onDelete={editingBlock ? handleDeleteBlock : undefined}
      />
    </div>
  );
}
