"use client";

import type { LeaderboardEntry } from "@/entities/user";
import { RainbowAvatar } from "@/shared/ui/atoms/RainbowAvatar";
import { ChartBarIcon } from "@heroicons/react/24/outline";

interface UserProgressProps {
  userEntry: LeaderboardEntry;
  userRank: number;
  nextHigher: LeaderboardEntry | null;
  progressPercent: number;
  diffToNext: number;
}

/**
 * UserProgress Widget
 * @description Shows current user's ranking progress
 */
export function UserProgress({
  userEntry,
  userRank,
  nextHigher,
  progressPercent,
  diffToNext,
}: UserProgressProps) {
  return (
    <section className="bg-neutral-800 rounded-4xl p-6">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <ChartBarIcon className="size-5 text-[#3BCBFF]" />
        Ваш прогресс
      </h3>

      <div className="flex items-center gap-4">
        <RainbowAvatar
          avatarUrl={userEntry.avatarUrl}
          avatarText={userEntry.avatarText}
          size={56}
        />

        <div className="flex-1">
          <p className="text-white font-medium">{userRank} место в блоке</p>
          <p className="text-neutral-400 text-[11px]">
            {userEntry.points} очков
          </p>

          {nextHigher && (
            <div className="mt-3">
              <div className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3BCBFF]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-neutral-400 mt-1">
                <span>{diffToNext} до следующего места</span>
                <span>{progressPercent}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
