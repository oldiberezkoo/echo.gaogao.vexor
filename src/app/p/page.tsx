"use client";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  FireIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import Chart from "chart.js/auto";
import { useTransitionRouter } from "next-view-transitions";
import { useEffect, useRef, useState } from "react";
const USER_DATA = {
  firstName: "₹ᴏʟᴅɪʙᴇʀᴇᴢᴋᴏ",
  lastName: "",
  avatar:
    "https://cdn4.telesco.pe/file/nW3q8DT8mU3MxAOHK5AMSQo1mvVUwqTBfvVV5RyACnyCLwuwjj5XL_ygbj-JNAx3vjQuTDddWDGw6zhhS5aezhPAOU5-B4nnhGRpEt7otS1-zijT2_pMIT053H_oMjO1VIw9O4NfoP1DbSXUfQsRFEju0Cmy2hdHcZcIuSGzfbNfh-tcw1Z67k8r4lDCewIqUAW4iYRN6nUEZAXr7p7zGZA2vKy-CjnyzVFGd2ptglDPO7oSeu4D9OttB3IEZC_HiShlsSZkPc3Tg11_nO1QQczx97O6OGZgCzQKMxpzHIvckalgwevEqSxK01sYQMUDkuXPX4XWDekgyn7YkbtTug.jpg",
  status: "*̷* Его надо запомнить.",
  position: "gaogao.inside.dev",
  experience: "4 года 3 месяца",
  totalPoints: 1375,
  globalRank: 2,
  streak: 12,
};

// Рейтинг по категориям алкоголя
const BLOCK_RATINGS = [
  { name: "Односолодовый виски", points: 240, maxPoints: 250, rank: 1 },
  { name: "Ирландский виски", points: 215, maxPoints: 250, rank: 2 },
  { name: "Бурбон", points: 200, maxPoints: 250, rank: 3 },
  { name: "Скотч", points: 190, maxPoints: 250, rank: 4 },
  { name: "Японский виски", points: 180, maxPoints: 250, rank: 5 },
  { name: "Водка", points: 230, maxPoints: 250, rank: 2 },
  { name: "Джин", points: 175, maxPoints: 250, rank: 6 },
  { name: "Коньяк", points: 210, maxPoints: 250, rank: 3 },
  { name: "Ликеры", points: 165, maxPoints: 250, rank: 7 },
  { name: "Ром", points: 185, maxPoints: 250, rank: 5 },
  { name: "Текила", points: 170, maxPoints: 250, rank: 6 },
  { name: "Саке и соджу", points: 160, maxPoints: 250, rank: 7 },
  { name: "Пиво", points: 220, maxPoints: 250, rank: 2 },
  { name: "Коктейли", points: 225, maxPoints: 250, rank: 2 },
  { name: "Вино красное", points: 205, maxPoints: 250, rank: 3 },
  { name: "Вино белое", points: 195, maxPoints: 250, rank: 4 },
  { name: "Шампанское", points: 190, maxPoints: 250, rank: 4 },
  { name: "Безалкогольные коктейли", points: 150, maxPoints: 250, rank: 8 },
  { name: "Лимонады", points: 145, maxPoints: 250, rank: 9 },
  { name: "Чай авторский", points: 210, maxPoints: 250, rank: 3 },
];

// Категории для Doughnut
const KNOWLEDGE_BLOCKS = [
  { label: "Односолодовый виски", value: 92, color: "#36F79A" },
  { label: "Ирландский виски", value: 85, color: "#50EBFF" },
  { label: "Бурбон", value: 78, color: "#FFD700" },
  { label: "Скотч", value: 71, color: "#FF6B9D" },
  { label: "Японский виски", value: 88, color: "#9D50FF" },
  { label: "Водка", value: 90, color: "#4ADE80" },
  { label: "Джин", value: 76, color: "#60A5FA" },
  { label: "Коньяк", value: 84, color: "#F59E0B" },
  { label: "Ром", value: 79, color: "#FB7185" },
  { label: "Вино", value: 86, color: "#A78BFA" },
];

// Активность — без изменений
const ACTIVITY_DATA = [
  { date: "13.01", tasks: 5 },
  { date: "14.01", tasks: 8 },
  { date: "15.01", tasks: 3 },
  { date: "16.01", tasks: 12 },
  { date: "17.01", tasks: 7 },
  { date: "18.01", tasks: 4 },
  { date: "19.01", tasks: 9 },
  { date: "20.01", tasks: 6 },
  { date: "21.01", tasks: 11 },
  { date: "22.01", tasks: 8 },
  { date: "23.01", tasks: 5 },
  { date: "24.01", tasks: 13 },
  { date: "25.01", tasks: 7 },
  { date: "26.01", tasks: 10 },
];
function DoughnutChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<"doughnut", number[], string> | null>(
    null
  );

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: KNOWLEDGE_BLOCKS.map((b) => b.label),
        datasets: [
          {
            data: KNOWLEDGE_BLOCKS.map((b) => b.value),
            backgroundColor: KNOWLEDGE_BLOCKS.map((b) => b.color),
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "70%",
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#171717",
            titleColor: "#fff",
            bodyColor: "#a3a3a3",
            padding: 12,
            cornerRadius: 12,
            displayColors: true,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return <canvas ref={chartRef} />;
}

function ActivityChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<"bar", number[], string> | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ACTIVITY_DATA.map((d) => d.date),
        datasets: [
          {
            label: "Задачи",
            data: ACTIVITY_DATA.map((d) => d.tasks),
            backgroundColor: "#36F79A",
            borderRadius: 8,
            barThickness: 12,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#404040",
            },
            ticks: {
              color: "#737373",
              font: { size: 10 },
              stepSize: 5,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#737373",
              font: { size: 9 },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#171717",
            titleColor: "#fff",
            bodyColor: "#a3a3a3",
            padding: 8,
            cornerRadius: 8,
            displayColors: false,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return <canvas ref={chartRef} />;
}

export default function ProfilePage() {
  const router = useTransitionRouter();
  const [activeTab, setActiveTab] = useState("stats");

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

        <button className="p-2 bg-neutral-800 rounded-full active:scale-90 transition">
          <Cog6ToothIcon className="size-6 text-neutral-400" />
        </button>
      </div>

      {/* Profile Card */}
      <section className="bg-neutral-800 rounded-4xl p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img
              src={USER_DATA.avatar}
              alt={`${USER_DATA.firstName.trim()} ${USER_DATA.lastName.trim()}`}
              className="size-20 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 size-7 bg-[#36F79A] rounded-full flex items-center justify-center border-2 border-neutral-800">
              <span className="text-black text-xs font-bold">
                {USER_DATA.globalRank}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-white text-xl font-bold">
              {USER_DATA.firstName} {USER_DATA.lastName}
            </h1>
            <p className="text-neutral-400 text-sm mt-1">{USER_DATA.status}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <TrophyIcon className="size-4 text-[#36F79A]" />
                <span className="text-white text-sm font-semibold">
                  {USER_DATA.totalPoints}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <FireIcon className="size-4 text-[#FF6B9D]" />
                <span className="text-white text-sm font-semibold">
                  {USER_DATA.streak} дней
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-neutral-900 rounded-2xl p-3">
            <p className="text-neutral-400 text-xs mb-1">Позиция</p>
            <p className="text-white font-semibold">{USER_DATA.position}</p>
          </div>
          <div className="bg-neutral-900 rounded-2xl p-3">
            <p className="text-neutral-400 text-xs mb-1">Стаж </p>
            <p className="text-white font-semibold">{USER_DATA.experience}</p>
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
                <DoughnutChart />
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
              <ActivityChart />
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
              {[
                {
                  title: "Single Malt Mindset",
                  desc: "Односолодовый виски освоен на высоком уровне",
                  icon: "🥃",
                },
                {
                  title: "Три школы виски",
                  desc: "Ирландский, шотландский и японский виски изучены",
                  icon: "🏴‍☠️",
                },
                {
                  title: "Чистая база",
                  desc: "Водка и джин — стабильный профиль",
                  icon: "🧊",
                },
                {
                  title: "Старый свет",
                  desc: "Коньяк и вино на уровне уверенного знания",
                  icon: "🍷",
                },
                {
                  title: "Архитектор коктейлей",
                  desc: "Коктейли входят в топ категорий",
                  icon: "🍸",
                },
                {
                  title: "Восточный профиль",
                  desc: "Саке и соджу освоены выше среднего",
                  icon: "🍶",
                },
                {
                  title: "Баланс вкуса",
                  desc: "Алкоголь и безалкогольные категории сбалансированы",
                  icon: "⚖️",
                },
                {
                  title: "Профиль сформирован",
                  desc: "Все ключевые категории открыты и развиты",
                  icon: "🏆",
                },
              ].map((achievement, idx) => (
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
