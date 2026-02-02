"use client";

import type { BlockLabel } from "@/entities/block";
import * as HeroIcons from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Link } from "next-view-transitions";

interface BlockGridProps {
  blocks: BlockLabel[];
  editMode: boolean;
  onEditBlock: (block: BlockLabel) => void;
  onAddBlock: () => void;
}

/**
 * Get icon component by name from HeroIcons
 */
function getIconComponent(iconName: string) {
  const IconComponent = (HeroIcons as any)[iconName];
  return IconComponent || HeroIcons.AcademicCapIcon;
}

/**
 * BlockGrid Widget
 * @description Grid of learning blocks with edit mode support
 */
export function BlockGrid({
  blocks,
  editMode,
  onEditBlock,
  onAddBlock,
}: BlockGridProps) {
  return (
    <div className="grid grid-cols-2 gap-0.5">
      {blocks.map((block) => {
        const IconComponent = getIconComponent(block.icon);

        return (
          <div key={block.id} className="relative">
            <Link
              href="/block"
              className="py-5 bg-neutral-800 rounded-full flex flex-col items-center gap-1 active:scale-95 transition-all duration-300 ease-initial hover:bg-neutral-700"
            >
              <IconComponent
                className="size-8"
                style={{ color: block.color }}
              />
              <span className="text-sm font-light text-nowrap text-center">
                {block.text}
              </span>
            </Link>
            {editMode && (
              <button
                aria-label="Редактировать блок"
                className="absolute -right-2 -top-1 border-dashed text-white rounded-full p-1 transition-colors backdrop-blur-sm bg-neutral-800/50 cursor-pointer"
                onClick={() => onEditBlock(block)}
              >
                <PencilIcon className="size-3" />
              </button>
            )}
          </div>
        );
      })}
      {editMode && (
        <button
          onClick={onAddBlock}
          className="py-5 rounded-full flex flex-col items-center gap-1 active:scale-95 transition-all duration-300 ease-initial border border-[#3BCBFF] text-[#3BCBFF] flex-1 hover:bg-neutral-700"
        >
          <span className="size-8 flex items-center justify-center rounded-full font-bold text-2xl">
            +
          </span>
          <span className="text-sm font-light">Добавить блок</span>
        </button>
      )}
    </div>
  );
}
