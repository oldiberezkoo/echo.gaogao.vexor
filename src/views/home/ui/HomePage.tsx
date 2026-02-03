"use client";

import { PencilSquareIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useAtom, useAtomValue } from "jotai";
import { Link, useTransitionRouter } from "next-view-transitions";
import { useMemo, useState } from "react";

import { MOCK_LEADERBOARD } from "@/shared/constants";
import { blocksAtom } from "@/shared/model/blocks";
import { userAtom } from "@/shared/model/telegram-store";
import { Modal } from "@/shared/ui/organisms/Modal";

import type { BlockLabel } from "@/entities/block";
import type { LeaderboardEntry } from "@/entities/user";

import { LabelEditModal } from "@/features/label-edit";

import { BlockGrid } from "@/widgets/block-grid";
import { Leaderboard, TopThree } from "@/widgets/leaderboard";
import { UserProgress } from "@/widgets/user-progress";

/**
 * HomePage Component
 * @description Main page with leaderboard, user progress, and block grid
 */
export function HomePage() {
  const router = useTransitionRouter();
  const currentUserId = "me";
  const user = useAtomValue(userAtom);

  // Build current user's leaderboard entry from Telegram data
  const meEntry: LeaderboardEntry = useMemo(() => {
    if (user) {
      return {
        id: "me",
        name: [user.firstName, user.lastName].filter(Boolean).join(" "),
        avatarText: user.firstName
          ? user.firstName.slice(0, 2).toUpperCase()
          : "ВЫ",
        avatarUrl: user.photoUrl,
        points: 980,
      };
    }
    return {
      id: "me",
      name: "Вы",
      avatarText: "ВЫ",
      avatarUrl:
        "https://cdn4.telesco.pe/file/nW3q8DT8mU3MxAOHK5AMSQo1mvVUwqTBfvVV5RyACnyCLwuwjj5XL_ygbj-JNAx3vjQuTDddWDGw6zhhS5aezhPAOU5-B4nnhGRpEt7otS1-zijT2_pMIT053H_oMjO1VIw9O4NfoP1DbSXUfQsRFEju0Cmy2hdHcZcIuSGzfbNfh-tcw1Z67k8r4lDCewIqUAW4iYRN6nUEZAXr7p7zGZA2vKy-CjnyzVFGd2ptglDPO7oSeu4D9OttB3IEZC_HiShlsSZkPc3Tg11_nO1QQczx97O6OGZgCzQKMxpzHIvckalgwevEqSxK01sYQMUDkuXPX4XWDekgyn7YkbtTug.jpg",
      points: 980,
    };
  }, [user]);

  // Build full leaderboard
  const leaderboard: LeaderboardEntry[] = useMemo(
    () => [...MOCK_LEADERBOARD.slice(0, 5), meEntry, MOCK_LEADERBOARD[5]],
    [meEntry],
  );

  // Calculate rankings
  const {
    sorted,
    userRank,
    userEntry,
    nextHigher,
    diffToNext,
    progressPercent,
  } = useMemo(() => {
    const sorted = [...leaderboard].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return a.name.localeCompare(b.name);
    });

    const userIndex = sorted.findIndex((u) => u.id === currentUserId);
    const userRank = userIndex >= 0 ? userIndex + 1 : null;
    const userEntry = userIndex >= 0 ? sorted[userIndex] : null;
    const nextHigher = userRank && userRank > 1 ? sorted[userRank - 2] : null;
    const diffToNext =
      userEntry && nextHigher
        ? Math.max(0, nextHigher.points - userEntry.points)
        : 0;
    const progressPercent =
      userEntry && nextHigher
        ? Math.min(
            100,
            Math.round((userEntry.points / nextHigher.points) * 100),
          )
        : 100;

    return {
      sorted,
      userRank,
      userEntry,
      nextHigher,
      diffToNext,
      progressPercent,
    };
  }, [leaderboard, currentUserId]);

  // Edit mode state
  const [viewModeEdit, setViewModeEdit] = useState(false);
  const [viewBoxCurrentModalEdit, setViewBoxCurrentModalEdit] = useState(false);

  // Blocks state from atom
  const [blocks, setBlocks] = useAtom(blocksAtom);

  // Only for creating new blocks
  const [showAddModal, setShowAddModal] = useState(false);

  const handleEditBlock = (block: BlockLabel) => {
    if (viewModeEdit) {
      router.push(`/editor/${block.id}`);
    } else {
      router.push(`/block?id=${block.id}`);
    }
  };

  const handleAddBlock = (
    label: string,
    icon: string,
    color: string,
    isVisible: boolean,
  ) => {
    const newBlock: BlockLabel = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      text: label || "Новый блок",
      icon,
      color,
      isVisible,
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const visibleBlocks = useMemo(() => {
    return viewModeEdit ? blocks : blocks.filter((b) => b.isVisible !== false);
  }, [blocks, viewModeEdit]);

  return (
    <div className="w-full max-w-[768px] mx-auto min-h-screen px-4 py-6 flex flex-col gap-6 relative">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <a
          href="https://gaoinside.netlify.app/"
          target="_blank"
          className="text-xl text-white flex leading-tight gap-0.5"
        >
          vexor.gao.inside
          <span className="text-[10px] text-neutral-400 tracking-wide items-start justify-start">
            поддерживает Danil T.
          </span>
        </a>
        <div className="flex items-ceter justify-center">
          {" "}
          <Link
            href="/p"
            className="p-2 bg-neutral-800 rounded-full flex items-center justify-center gap-2
          group
          
            transition-all duration-200 ease-in-out
            hover:bg-[#3BCBFF] hover:text-neutral-800
          "
            aria-label="Профиль"
          >
            <UserCircleIcon className="size-6 text-neutral-400 group-hover:text-neutral-800" />
            <p className="max-w-[100px] truncate">
              {user ? user.username || user.firstName : "Loading"}
            </p>
          </Link>
          <button
            className="p-2 rounded-full bg-neutral-800 xanimte duration-200 ease-in-out hover:bg-[#3BCBFF] group"
            onClick={() => setViewModeEdit((prev) => !prev)}
          >
            <PencilSquareIcon className="size-5 group-hover:group-hover:text-neutral-800" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-start font-sans leading-7 text-[26px]">
        <h1 className="text-white">Проверьте свои знания</h1>
        <p>выберите</p>
        <p>подходящий блок</p>
      </div>

      {/* TOP 3 */}
      <TopThree entries={sorted} />

      {/* USER PROGRESS */}
      {userEntry && userRank && (
        <UserProgress
          userEntry={userEntry}
          userRank={userRank}
          nextHigher={nextHigher}
          progressPercent={progressPercent}
          diffToNext={diffToNext}
        />
      )}

      {/* LEADERBOARD */}
      <Leaderboard entries={sorted} currentUserId={currentUserId} />

      {/* BLOCK GRID */}
      <BlockGrid
        blocks={visibleBlocks}
        editMode={viewModeEdit}
        onEditBlock={handleEditBlock}
        onAddBlock={() => {
          setShowAddModal(true);
        }}
      />

      {/* Exit Modal */}
      <Modal
        isOpen={viewBoxCurrentModalEdit}
        onClose={() => setViewBoxCurrentModalEdit(false)}
        position="bottom"
        className=""
      >
        <div className="bg-[#121212] rounded-t-[32px] p-6 border-t border-white/10 ">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-1.5 bg-neutral-800 rounded-full mb-8" />

            <h2 className="text-2xl font-bold text-white mb-3">
              Завершить тест?
            </h2>
            <p className="text-neutral-400 text-sm mb-8 max-w-[260px] leading-relaxed">
              Вы завершите тест и получите баллы только за{" "}
              <span className="text-white font-semibold">2 вопроса</span>
            </p>

            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setViewBoxCurrentModalEdit(false)}
                className="flex-1 py-4 rounded-2xl bg-neutral-900 text-white font-semibold border border-neutral-800 active:scale-95 transition-all duration-200"
                aria-label="Продолжить тест"
              >
                Продолжить
              </button>
              <button
                type="button"
                onClick={() => setViewBoxCurrentModalEdit(false)}
                className="flex-1 py-4 rounded-2xl bg-[#3BCBFF] text-black font-bold active:scale-95 transition-all duration-200 shadow-lg shadow-[#3BCBFF]/20"
                aria-label="Завершить тест"
              >
                Завершить
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Label Edit Modal (Add only) */}
      <LabelEditModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Добавить блок обучения"
        onSave={handleAddBlock}
      />
    </div>
  );
}
