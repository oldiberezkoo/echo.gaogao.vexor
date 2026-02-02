"use client";

import {
  ArrowLeftIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentArrowDownIcon,
  FireIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { useTransitionRouter } from "next-view-transitions";
import { useState } from "react";

import {
  ACHIEVEMENTS,
  ACTIVITY_DATA,
  BLOCK_RATINGS,
  KNOWLEDGE_BLOCKS,
  MOCK_USER_DATA,
} from "@/shared/constants";

import { downloadProfilePdf } from "@/features/pdf-export";
import { ActivityChart, DoughnutChart } from "@/widgets/charts";

/**
 * ProfilePage Component
 * @description User profile with stats, charts, and PDF export for admins
 */
export function ProfilePage() {
  const router = useTransitionRouter();
  const [activeTab, setActiveTab] = useState("stats");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      await downloadProfilePdf(MOCK_USER_DATA, BLOCK_RATINGS, {
        adminNotes: "Экспортировано через панель администратора",
      });
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-[568px] mx-auto min-h-screen px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 bg-neutral-800 rounded-full active:scale-90 transition"
        >
          <ArrowLeftIcon className="size-6 text-neutral-400" />
        </button>

        <div className="flex items-center gap-2">
          {/* Admin PDF Export Button */}
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="p-2 bg-neutral-800 rounded-full active:scale-90 transition hover:bg-[#3BCBFF] group disabled:opacity-50"
            aria-label="Экспорт в PDF"
          >
            <DocumentArrowDownIcon className="size-6 text-neutral-400 group-hover:text-neutral-800" />
          </button>
          <button className="p-2 bg-neutral-800 rounded-full active:scale-90 transition">
            <Cog6ToothIcon className="size-6 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <section className="bg-neutral-800 rounded-4xl p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img
              src={MOCK_USER_DATA.avatar}
              alt={`${MOCK_USER_DATA.firstName.trim()} ${MOCK_USER_DATA.lastName.trim()}`}
              className="size-20 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 size-7 bg-[#36F79A] rounded-full flex items-center justify-center border-2 border-neutral-800">
              <span className="text-black text-xs font-bold">
                {MOCK_USER_DATA.globalRank}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-white text-xl font-bold">
              {MOCK_USER_DATA.firstName} {MOCK_USER_DATA.lastName}
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              {MOCK_USER_DATA.status}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <TrophyIcon className="size-4 text-[#36F79A]" />
                <span className="text-white text-sm font-semibold">
                  {MOCK_USER_DATA.totalPoints}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <FireIcon className="size-4 text-[#FF6B9D]" />
                <span className="text-white text-sm font-semibold">
                  {MOCK_USER_DATA.streak} дней
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-neutral-900 rounded-2xl p-3">
            <p className="text-neutral-400 text-xs mb-1">Позиция</p>
            <p className="text-white font-semibold">
              {MOCK_USER_DATA.position}
            </p>
          </div>
          <div className="bg-neutral-900 rounded-2xl p-3">
            <p className="text-neutral-400 text-xs mb-1">Стаж </p>
            <p className="text-white font-semibold">
              {MOCK_USER_DATA.experience}
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-2 bg-neutral-800 rounded-full p-1">
        <button
          onClick={() => setActiveTab("stats")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeTab === "stats"
              ? "bg-[#36F79A] text-black"
              : "text-neutral-400"
          }`}
        >
          Статистика
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeTab === "activity"
              ? "bg-[#36F79A] text-black"
              : "text-neutral-400"
          }`}
        >
          Активность
        </button>
      </div>

      {activeTab === "stats" ? (
        <>
          {/* Block Ratings */}
          <section className="bg-neutral-800 rounded-4xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <ChartBarIcon className="size-5 text-[#36F79A]" />
              Рейтинг по блокам
            </h3>

            <div className="space-y-3">
              {BLOCK_RATINGS.map((block, idx) => (
                <div key={idx} className="bg-neutral-900 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">
                      {block.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#36F79A] font-bold">
                        {block.points}
                      </span>
                      <span className="text-neutral-500 text-sm">
                        / {block.maxPoints}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#36F79A] transition-all duration-500"
                      style={{
                        width: `${(block.points / block.maxPoints) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-neutral-500 text-xs">
                      #{block.rank} место
                    </span>
                    <span className="text-neutral-400 text-xs">
                      {Math.round((block.points / block.maxPoints) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Knowledge Blocks */}
          <section className="bg-neutral-800 rounded-4xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrophyIcon className="size-5 text-[#FFD700]" />
              Отрасли знаний
            </h3>

            <div className="grid grid-cols-2 gap-6 items-center">
              <div className="w-full aspect-square">
                <DoughnutChart data={KNOWLEDGE_BLOCKS} />
              </div>

              <div className="space-y-3">
                {KNOWLEDGE_BLOCKS.map((block, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: block.color }}
                      />
                      <span className="text-neutral-300 text-xs">
                        {block.label}
                      </span>
                    </div>
                    <span className="text-white font-bold text-sm">
                      {block.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Activity Chart */}
          <section className="bg-neutral-800 rounded-4xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="size-5 text-[#50EBFF]" />
              Активность за 14 дней
            </h3>

            <div className="h-48">
              <ActivityChart data={ACTIVITY_DATA} />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-neutral-900 rounded-2xl p-3 text-center">
                <p className="text-[#36F79A] text-2xl font-bold">
                  {ACTIVITY_DATA.reduce((sum, d) => sum + d.tasks, 0)}
                </p>
                <p className="text-neutral-400 text-xs mt-1">Всего задач</p>
              </div>
              <div className="bg-neutral-900 rounded-2xl p-3 text-center">
                <p className="text-[#50EBFF] text-2xl font-bold">
                  {(
                    ACTIVITY_DATA.reduce((sum, d) => sum + d.tasks, 0) /
                    ACTIVITY_DATA.length
                  ).toFixed(1)}
                </p>
                <p className="text-neutral-400 text-xs mt-1">В среднем/день</p>
              </div>
              <div className="bg-neutral-900 rounded-2xl p-3 text-center">
                <p className="text-[#FFD700] text-2xl font-bold">
                  {Math.max(...ACTIVITY_DATA.map((d) => d.tasks))}
                </p>
                <p className="text-neutral-400 text-xs mt-1">Макс. в день</p>
              </div>
            </div>
          </section>

          {/* Recent Achievements */}
          <section className="bg-neutral-800 rounded-4xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FireIcon className="size-5 text-[#FF6B9D]" />
              Недавние достижения
            </h3>

            <div className="space-y-3">
              {ACHIEVEMENTS.map((achievement, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-neutral-900 rounded-2xl p-4"
                >
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">
                      {achievement.title}
                    </p>
                    <p className="text-neutral-400 text-xs mt-0.5">
                      {achievement.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
