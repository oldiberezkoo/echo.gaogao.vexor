"use client";

import type { LeaderboardEntry } from "@/entities/user";
import { RainbowAvatar } from "@/shared/ui/atoms/RainbowAvatar";

interface TopThreeProps {
  entries: LeaderboardEntry[];
}

/**
 * TopThree Widget
 * @description Displays top 3 leaderboard entries with avatars
 */
export function TopThree({ entries }: TopThreeProps) {
  const top3 = entries.slice(0, 3);

  return (
    <section className="bg-neutral-800 rounded-4xl p-6">
      <h2 className="text-xl font-bold text-[#3BCBFF] mb-6">Топ рейтинга</h2>
      <div className="grid grid-cols-3 gap-4 items-end">
        {top3.map((u) => (
          <div key={u.id} className="flex flex-col items-center text-center">
            <RainbowAvatar
              avatarUrl={u.avatarUrl}
              avatarText={u.avatarText}
              size={64}
            />
            <span className="mt-3 text-[12px] font-semibold text-white">
              {u.name}
            </span>
            <span className="mt-1 text-[10px] text-neutral-400">
              {u.points} очков
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
