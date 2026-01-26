"use client";

import {
  AcademicCapIcon,
  ChartBarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/* =========================
   TYPES
========================= */
type LeaderboardEntry = {
  id: string;
  name: string;
  avatarText: string;
  avatarUrl?: string;
  points: number;
};

/* =========================
   AVATAR WITH ANIMATED RING
========================= */
function RainbowAvatar({
  avatarUrl,
  avatarText,
  size = 64,
}: {
  avatarUrl?: string;
  avatarText: string;
  size?: number;
}) {
  return (
    <div
      className="relative rounded-full shrink-0"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-[-3px] rounded-full rainbow-ring" />
      <div className="relative z-10 w-full h-full rounded-full overflow-hidden bg-neutral-700 flex items-center justify-center text-white font-semibold">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          avatarText
        )}
      </div>
    </div>
  );
}

/* =========================
   PAGE
========================= */
export default function Home() {
  // The original file shows at error: "Invalid or unexpected token"
  // This may be caused if you accidentally have a BOM or invisible character or some syntax error.
  // Here is the same logic, but carefully reformatted.

  const currentUserId = "me";

  const leaderboard: LeaderboardEntry[] = useMemo(
    () => [
      {
        id: "u1",
        name: "Борис Лебедев",
        avatarText: "СК",
        avatarUrl: "https://i.pravatar.cc/100",
        points: 1375,
      },
      {
        id: "u2",
        name: "Егор Ковалев",
        avatarText: "ДА",
        avatarUrl: "https://i.pravatar.cc/101",
        points: 1375,
      },
      {
        id: "u3",
        name: "Асилбек Гайратов",
        avatarText: "АГ",
        avatarUrl: "https://i.pravatar.cc/102",
        points: 1325,
      },
      {
        id: "u4",
        name: "Алексей К.",
        avatarText: "АК",
        avatarUrl: "https://i.pravatar.cc/103",
        points: 1210,
      },
      {
        id: "u5",
        name: "Мария С.",
        avatarText: "МС",
        avatarUrl: "https://i.pravatar.cc/104",
        points: 1180,
      },
      {
        id: "me",
        name: "Вы",
        avatarText: "ВЫ",
        avatarUrl:
          "https://cdn4.telesco.pe/file/nW3q8DT8mU3MxAOHK5AMSQo1mvVUwqTBfvVV5RyACnyCLwuwjj5XL_ygbj-JNAx3vjQuTDddWDGw6zhhS5aezhPAOU5-B4nnhGRpEt7otS1-zijT2_pMIT053H_oMjO1VIw9O4NfoP1DbSXUfQsRFEju0Cmy2hdHcZcIuSGzfbNfh-tcw1Z67k8r4lDCewIqUAW4iYRN6nUEZAXr7p7zGZA2vKy-CjnyzVFGd2ptglDPO7oSeu4D9OttB3IEZC_HiShlsSZkPc3Tg11_nO1QQczx97O6OGZgCzQKMxpzHIvckalgwevEqSxK01sYQMUDkuXPX4XWDekgyn7YkbtTug.jpg",
        points: 980,
      },
      {
        id: "u23",
        name: "E.",
        avatarText: "МС",
        avatarUrl: "https://i.pravatar.cc/104",
        points: 700,
      },
    ],
    []
  );

  const {
    sorted,
    top3,
    userIndex,
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

    const top3 = sorted.slice(0, 3);
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
            Math.round((userEntry.points / nextHigher.points) * 100)
          )
        : 100;

    return {
      sorted,
      top3,
      userIndex,
      userRank,
      userEntry,
      nextHigher,
      diffToNext,
      progressPercent,
    };
  }, [leaderboard, currentUserId]);

  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    if (!userEntry) return;

    setAnimateProgress(true);
    const timer = setTimeout(() => setAnimateProgress(false), 900);
    return () => clearTimeout(timer);
  }, [userEntry?.points]);

  return (
    <div className="w-full max-w-[568px] mx-auto min-h-screen px-4 py-6 flex flex-col gap-6">
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
        <Link
          href="/p"
          className="p-2 bg-neutral-800 rounded-full flex items-center justify-center gap-2
          group
          
            transition-all duration-200 ease-in-out
            hover:bg-[#36F79A] hover:text-neutral-800
          "
          aria-label="Профиль"
        >
          <UserCircleIcon className="size-6 text-neutral-400 group-hover:text-neutral-800" />
          <p>₹ᴏʟᴅɪʙᴇʀᴇᴢᴋᴏ</p>
        </Link>
      </div>

      <div className="flex flex-col items-start font-sans leading-7 text-[26px]">
        <h1 className="text-white">Проверьте свои знания</h1>
        <p>выберите</p>
        <p>подходящий блок</p>
        <h1 className="my-6">ПРОТОТИП</h1>
      </div>

      {/* TOP 3 */}
      <section className="bg-neutral-800 rounded-4xl p-6">
        <h2 className="text-xl font-bold text-[#36F79A] mb-6">Топ рейтинга</h2>
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

      {/* USER PROGRESS */}
      {userEntry && userRank && (
        <section className="bg-neutral-800 rounded-4xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <ChartBarIcon className="size-5 text-[#36F79A]" />
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
                      className="h-full bg-[#36F79A]"
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
      )}

      {/* LEADERBOARD */}
      <section className="bg-neutral-800 rounded-4xl p-6">
        <div className="w-full flex flex-row items-center justify-between mb-4">
          <div className="flex items-center justify-center ">
            <h3 className="text-white font-semibold flex items-center justify-center gap-2">
              <ChartBarIcon className="size-5 text-[#36F79A]" />
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
          {sorted.map((u, i) => {
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
                      ? "bg-gradient-to-r from-neutral-800/70 to-neutral-800/40 ring-1 ring-[#36F79A]/30 scale-[1.01]"
                      : "bg-neutral-800"
                  }`}
                >
                  <div
                    className={`${
                      isCurrent ? "ring-2 ring-[#36F79A]" : ""
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

      {/* BLOCK GRID */}
      <div className="grid grid-cols-2 gap-0.5">
        {[
          "ОДНОСОЛОДОВЫЙ ВИСКИ",
          "ИРЛАНДСКИЙ ВИСКИ",
          "БУРБОН ВИСКИ",
          "СКОТЧ ВИСКИ",
          "ЯПОНСКИЙ ВИСКИ",
          "ВОДКА",
          "ДЖИН",
          "КОНЬЯК",
          "ЛИКЕРЫ",
          "РОМ",
          "ТЕКИЛА",
          "САКЕ И СОДЖУ",
          "ПИВО",
          "КОКТЕЙЛИ",
          "ВИНО КРАСНОЕ",
          "ВИНО БЕЛОЕ",
          "ШАМПАНСКОЕ",
          "БЕЗАЛКОГОЛЬНЫЕ КОКТЕЙЛИ",
          "ЛИМОНАДЫ",
          "ЧАЙ АВТОРСКИЙ",
        ].map((label, i) => (
          <a
            key={i}
            href="/block"
            className="py-5 bg-neutral-800 rounded-full flex flex-col items-center gap-1 active:scale-95 transition-all duration-300 ease-initial hover:bg-neutral-700"
          >
            <AcademicCapIcon className="size-8" />
            <span className="text-sm font-light">{label}</span>
          </a>
        ))}
      </div>

      {/* STYLES */}
      <style jsx>{`
        .rainbow-ring {
          background: conic-gradient(
            #ff004c,
            #ff8a00,
            #ffea00,
            #20c997,
            #00d0ff,
            #7b5cff,
            #ff004c
          );
          animation: spin 6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
