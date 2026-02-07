"use client";

import {
  ArrowLeftIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  Cog6ToothIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  FireIcon,
  TrophyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTransitionRouter } from "next-view-transitions";
import { useMemo, useState } from "react";

import {
  ACHIEVEMENTS,
  ACTIVITY_DATA,
  BLOCK_RATINGS,
  KNOWLEDGE_BLOCKS,
  MOCK_USER_DATA,
  PDF_SOURCE_DOMAIN,
} from "@/shared/constants";

import { downloadProfilePdf } from "@/features/pdf-export";
import { SettingsModal } from "@/features/user-settings";
import { ActivityChart, DoughnutChart } from "@/widgets/charts";

// Mock data for quiz logs - replace with actual data from your backend
const QUIZ_LOGS = [
  {
    id: 1,
    quizTitle: "Сертификация сомелье: Вина Франции",
    instructor: "Дюпон Жан-Пьер",
    date: "16 Мая 2024",
    time: "14:30",
    score: 87,
    maxScore: 100,
    duration: 2145, // seconds
    avgTimePerQuestion: 107, // seconds
    answers: [
      {
        question: "Какой регион Франции известен производством Шабли?",
        userAnswer: "Бургундия",
        correctAnswer: "Бургундия",
        isCorrect: true,
      },
      {
        question: "Основной сорт винограда для производства Шампанского?",
        userAnswer: "Пино Нуар",
        correctAnswer: "Шардоне, Пино Нуар, Пино Менье",
        isCorrect: false,
      },
      {
        question: "При какой температуре подавать Божоле Нуво?",
        userAnswer: "12-14°C",
        correctAnswer: "12-14°C",
        isCorrect: true,
      },
      {
        question: "Что означает термин 'Sur Lie' в виноделии?",
        userAnswer: "Выдержка на осадке",
        correctAnswer: "Выдержка на осадке",
        isCorrect: true,
      },
      {
        question: "Минимальная выдержка для Бордо Grand Cru?",
        userAnswer: "12 месяцев",
        correctAnswer: "18 месяцев",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    quizTitle: "Барменское дело: Классические коктейли",
    instructor: "Иванов Алексей",
    date: "3 Мая 2024",
    time: "10:15",
    score: 92,
    maxScore: 100,
    duration: 1680,
    avgTimePerQuestion: 84,
    answers: [
      {
        question: "Из каких ингредиентов состоит коктейль Негрони?",
        userAnswer: "Джин, Кампари, Вермут",
        correctAnswer: "Джин, Кампари, Вермут",
        isCorrect: true,
      },
      {
        question: "Какой метод приготовления используется для Мохито?",
        userAnswer: "Билд (Build)",
        correctAnswer: "Мадл (Muddle) + Билд",
        isCorrect: false,
      },
      {
        question: "Основа коктейля Old Fashioned?",
        userAnswer: "Бурбон или Рай виски",
        correctAnswer: "Бурбон или Рай виски",
        isCorrect: true,
      },
      {
        question: "Какой гарнир используется в Мартини?",
        userAnswer: "Оливка или лимонная цедра",
        correctAnswer: "Оливка или лимонная цедра",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    quizTitle: "Дегустация виски: Скотч и Бурбон",
    instructor: "Макдональд Дункан",
    date: "20 Апреля 2024",
    time: "16:00",
    score: 78,
    maxScore: 100,
    duration: 2520,
    avgTimePerQuestion: 126,
    answers: [
      {
        question: "В чем основное отличие производства скотча от бурбона?",
        userAnswer: "Использование ячменного солода",
        correctAnswer: "Использование ячменного солода и торфа для скотча",
        isCorrect: true,
      },
      {
        question: "Минимальная выдержка для виски в Шотландии?",
        userAnswer: "5 лет",
        correctAnswer: "3 года",
        isCorrect: false,
      },
      {
        question: "Какой регион Шотландии известен торфяным скотчем?",
        userAnswer: "Айла (Islay)",
        correctAnswer: "Айла (Islay)",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    quizTitle: "Крафтовое пивоварение: Стили и технологии",
    instructor: "Смирнов Дмитрий",
    date: "8 Апреля 2024",
    time: "12:00",
    score: 85,
    maxScore: 100,
    duration: 1920,
    avgTimePerQuestion: 96,
    answers: [
      {
        question: "Что характеризует стиль IPA (India Pale Ale)?",
        userAnswer: "Высокая горечь и хмелевой аромат",
        correctAnswer: "Высокая горечь и хмелевой аромат",
        isCorrect: true,
      },
      {
        question: "Какая температура ферментации для лагера?",
        userAnswer: "8-12°C",
        correctAnswer: "8-12°C",
        isCorrect: true,
      },
      {
        question: "Что такое 'сухое охмеление' (dry hopping)?",
        userAnswer: "Добавление хмеля во время брожения",
        correctAnswer: "Добавление хмеля после основной ферментации",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    quizTitle: "Винная сервировка и этикет",
    instructor: "Лебедева Ольга",
    date: "25 Марта 2024",
    time: "15:30",
    score: 94,
    maxScore: 100,
    duration: 1440,
    avgTimePerQuestion: 72,
    answers: [
      {
        question: "В каком порядке подавать вина при дегустации?",
        userAnswer: "От легких к насыщенным, от сухих к сладким",
        correctAnswer: "От легких к насыщенным, от сухих к сладким",
        isCorrect: true,
      },
      {
        question: "Оптимальная температура для подачи красного вина?",
        userAnswer: "16-18°C",
        correctAnswer: "16-18°C",
        isCorrect: true,
      },
    ],
  },
];

interface QuizLog {
  id: number;
  quizTitle: string;
  instructor: string;
  date: string;
  time: string;
  score: number;
  maxScore: number;
  duration: number;
  avgTimePerQuestion: number;
  answers: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}

interface QuizDetailsModalProps {
  quiz: QuizLog | null;
  onClose: () => void;
}

function QuizDetailsModal({ quiz, onClose }: QuizDetailsModalProps) {
  if (!quiz) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}м ${secs}с`;
  };

  const percentage = Math.round((quiz.score / quiz.maxScore) * 100);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-[568px] max-h-[70dvh] bg-neutral-900 rounded-4xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold mb-2">
                {quiz.quizTitle}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                <span>{quiz.instructor}</span>
                <span>•</span>
                <span>{quiz.date}</span>
                <span>•</span>
                <span>{quiz.time}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition active:scale-90"
            >
              <XMarkIcon className="size-5 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-neutral-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-neutral-800 rounded-2xl p-4">
              <p className="text-neutral-400 text-xs mb-1">Баллы</p>
              <p className="text-white text-2xl font-bold">
                {quiz.score}
                <span className="text-neutral-500 text-base font-normal">
                  /{quiz.maxScore}
                </span>
              </p>
              <p className="text-[#3BCBFF] text-sm mt-1">{percentage}%</p>
            </div>

            <div className="bg-neutral-800 rounded-2xl p-4">
              <p className="text-neutral-400 text-xs mb-1">Время</p>
              <p className="text-white text-lg font-bold">
                {formatTime(quiz.duration)}
              </p>
            </div>

            <div className="bg-neutral-800 rounded-2xl p-4">
              <p className="text-neutral-400 text-xs mb-1">Средний ответ</p>
              <p className="text-white text-lg font-bold">
                {formatTime(quiz.avgTimePerQuestion)}
              </p>
            </div>

            <div className="bg-neutral-800 rounded-2xl p-4">
              <p className="text-neutral-400 text-xs mb-1">Вопросов</p>
              <p className="text-white text-2xl font-bold">{quiz.maxScore}</p>
            </div>
            <div className="bg-neutral-800 rounded-2xl p-4">
              <p className="text-neutral-400 text-xs mb-1">Правильных отве</p>
              <p className="text-white text-2xl font-bold">{quiz.maxScore}</p>
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-white font-semibold mb-4">Ответы</h3>

          {quiz.answers.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              Детальная информация по ответам недоступна
            </div>
          ) : (
            <div className="space-y-3">
              {quiz.answers.map((answer, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-4 border-2 ${
                    answer.isCorrect
                      ? "bg-emerald-950/20 border-emerald-700/30"
                      : "bg-red-950/20 border-red-700/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 size-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        answer.isCorrect ? "bg-emerald-600" : "bg-red-600"
                      }`}
                    >
                      {answer.isCorrect ? (
                        <svg
                          className="size-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="size-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm mb-2">
                        {answer.question}
                      </p>

                      <div className="space-y-2">
                        <div>
                          <p className="text-neutral-400 text-xs mb-1">
                            Ваш ответ:
                          </p>
                          <p
                            className={`text-sm ${
                              answer.isCorrect
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {answer.userAnswer}
                          </p>
                        </div>

                        {!answer.isCorrect && (
                          <div>
                            <p className="text-neutral-400 text-xs mb-1">
                              Правильный ответ:
                            </p>
                            <p className="text-sm text-emerald-400">
                              {answer.correctAnswer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ProfilePage Component
 * @description User profile with stats, charts, logs, and PDF export for admins
 */
export function ProfilePage() {
  const router = useTransitionRouter();
  const [activeTab, setActiveTab] = useState<"stats" | "activity" | "logs">(
    "stats",
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userData, setUserData] = useState(MOCK_USER_DATA);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizLog | null>(null);

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const profileUrl = `${PDF_SOURCE_DOMAIN}/profile/${userData.firstName.toLowerCase().replace(/[^a-z0-9]/g, "")}`;

      await downloadProfilePdf(userData, BLOCK_RATINGS, {
        includeLogo: true,
        adminNotes: "Экспортировано через панель администратора",
        activityData: ACTIVITY_DATA,
        profileUrl: profileUrl,
      });
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveSettings = (data: {
    firstName: string;
    lastName: string;
    position: string;
  }) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const formatTime = useMemo(
    () => (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}м ${secs}с`;
    },
    [],
  );

  return (
    <>
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
            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="p-2 bg-neutral-800 rounded-full active:scale-90 transition hover:bg-[#3BCBFF] group disabled:opacity-50"
              aria-label="Экспорт в PDF"
            >
              <DocumentArrowDownIcon className="size-6 text-neutral-400 group-hover:text-neutral-800" />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 bg-neutral-800 rounded-full active:scale-90 transition hover:bg-[#3BCBFF] group"
            >
              <Cog6ToothIcon className="size-6 text-neutral-400 group-hover:text-neutral-800" />
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <section className="bg-neutral-800 rounded-4xl p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <img
                src={userData.avatar}
                alt={`${userData.firstName.trim()} ${userData.lastName.trim()}`}
                className="size-20 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 size-7 bg-[#3BCBFF] rounded-full flex items-center justify-center border-2 border-neutral-800">
                <span className="text-black text-xs font-bold">
                  {userData.globalRank}
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="text-white text-xl font-bold">
                  {userData.firstName} {userData.lastName}
                </h1>
                <span className="text-neutral-500 text-sm">
                  @{userData.username}
                </span>
              </div>
              <p className="text-neutral-400 text-sm mt-1">{userData.status}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <TrophyIcon className="size-4 text-[#3BCBFF]" />
                  <span className="text-white text-sm font-semibold">
                    {userData.totalPoints}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FireIcon className="size-4 text-[#FF6B9D]" />
                  <span className="text-white text-sm font-semibold">
                    {userData.streak} дней
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-900 rounded-2xl p-3">
              <p className="text-neutral-400 text-xs mb-1">Позиция</p>
              <p className="text-white font-semibold">{userData.position}</p>
            </div>
            <div className="bg-neutral-900 rounded-2xl p-3">
              <p className="text-neutral-400 text-xs mb-1">Стаж</p>
              <p className="text-white font-semibold">{userData.experience}</p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-2 bg-neutral-800 rounded-full p-1">
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
              activeTab === "stats"
                ? "bg-[#3BCBFF] text-black"
                : "text-neutral-400"
            }`}
          >
            Статистика
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
              activeTab === "activity"
                ? "bg-[#3BCBFF] text-black"
                : "text-neutral-400"
            }`}
          >
            Активность
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
              activeTab === "logs"
                ? "bg-[#3BCBFF] text-black"
                : "text-neutral-400"
            }`}
          >
            Логи
          </button>
        </div>

        {activeTab === "stats" ? (
          <>
            {/* Block Ratings */}
            <section className="bg-neutral-800 rounded-4xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <ChartBarIcon className="size-5 text-[#3BCBFF]" />
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
                        <span className="text-[#3BCBFF] font-bold">
                          {block.points}
                        </span>
                        <span className="text-neutral-500 text-sm">
                          / {block.maxPoints}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#3BCBFF] transition-all duration-500"
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
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
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
        ) : activeTab === "activity" ? (
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
                  <p className="text-[#3BCBFF] text-2xl font-bold">
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
                  <p className="text-neutral-400 text-xs mt-1">
                    В среднем/день
                  </p>
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
        ) : (
          <>
            {/* Quiz Logs */}
            <section className="bg-neutral-800 rounded-4xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <DocumentTextIcon className="size-5 text-[#3BCBFF]" />
                История опросов
              </h3>

              <div className="space-y-3">
                {QUIZ_LOGS.map((quiz) => {
                  const percentage = Math.round(
                    (quiz.score / quiz.maxScore) * 100,
                  );

                  return (
                    <button
                      key={quiz.id}
                      onClick={() => setSelectedQuiz(quiz)}
                      className="w-full bg-neutral-900 rounded-2xl p-4 hover:bg-neutral-850 transition text-left active:scale-[0.98]"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm mb-1 line-clamp-2">
                            {quiz.quizTitle}
                          </h4>
                          <p className="text-neutral-400 text-xs">
                            {quiz.instructor}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#3BCBFF] font-bold text-lg">
                              {quiz.score}
                            </span>
                            <span className="text-neutral-500 text-sm">
                              /{quiz.maxScore}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              percentage >= 80
                                ? "text-emerald-400"
                                : percentage >= 60
                                  ? "text-yellow-400"
                                  : "text-red-400"
                            }`}
                          >
                            {percentage}%
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="size-3.5" />
                          <span>
                            {quiz.date} в {quiz.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ClockIcon className="size-3.5" />
                          <span>Время: {formatTime(quiz.duration)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ClockIcon className="size-3.5" />
                          <span>
                            Средний ответ: {formatTime(quiz.avgTimePerQuestion)}
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-3">
                        <div
                          className={`h-full transition-all duration-500 ${
                            percentage >= 80
                              ? "bg-emerald-500"
                              : percentage >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        )}

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          initialData={{
            firstName: userData.firstName,
            lastName: userData.lastName,
            position: userData.position,
          }}
          onSave={handleSaveSettings}
        />
      </div>

      {/* Quiz Details Modal */}
      <QuizDetailsModal
        quiz={selectedQuiz}
        onClose={() => setSelectedQuiz(null)}
      />
    </>
  );
}
