"use client";

import type { LeaderboardEntry } from "@/entities/user";
import { RainbowAvatar } from "@/shared/ui/atoms/RainbowAvatar";
import { ChartBarIcon } from "@heroicons/react/24/outline";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
}

/**
 * Leaderboard Widget
 * @description Full leaderboard with live indicator and current user highlight
 */
export function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  return (
    <section className="bg-neutral-800 rounded-4xl p-6">
      <div className="w-full flex flex-row items-center justify-between mb-4">
        <div className="flex items-center justify-center ">
          <h3 className="text-white font-semibold flex items-center justify-center gap-2">
            <ChartBarIcon className="size-5 text-[#3BCBFF]" />
            Рейтинг
          </h3>
        </div>
        <div className="flex items-center justify-center ">
          <div className="flex items-center justify-center gap-2 w-full">
            <div className="animate-ping bg-red-500 size-2 rounded-full" />
            <span>LIVE</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {entries.map((u, i) => {
          const isCurrent = u.id === currentUserId;
          return (
            <div key={u.id} className="relative">
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 text-7xl font-black text-white opacity-5 pointer-events-none select-none"
                style={{ zIndex: 100 - i }}
              >
                {i + 1}
              </div>
              <div
                className={`relative z-10 flex items-center gap-3 p-3 rounded-2xl transition-transform ${
                  isCurrent
                    ? "bg-gradient-to-r from-neutral-800/70 to-neutral-800/40 ring-1 ring-[#3BCBFF]/30 scale-[1.01]"
                    : "bg-neutral-800"
                }`}
              >
                <div
                  className={`${
                    isCurrent ? "ring-2 ring-[#3BCBFF]" : ""
                  } rounded-full`}
                >
                  <RainbowAvatar
                    avatarUrl={u.avatarUrl}
                    avatarText={u.avatarText}
                    size={40}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {u.name}
                  </p>
                </div>
                <div className="text-white font-bold">{u.points}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
