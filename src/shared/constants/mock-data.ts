import type { BlockLabel } from "@/entities/block/types";
import type { Question } from "@/entities/question/types";
import { QuestionType } from "@/entities/question/types";
import type { LeaderboardEntry, UserProfile } from "@/entities/user/types";

/**
 * Default learning blocks configuration
 */
export const DEFAULT_BLOCKS: BlockLabel[] = [
  {
    id: "1",
    text: "ОДНОСОЛОДОВЫЙ ВИСКИ",
    icon: "BeakerIcon",
    color: "#3BCBFF",
  },
  {
    id: "2",
    text: "ИРЛАНДСКИЙ ВИСКИ",
    icon: "GlobeAltIcon",
    color: "#00FF88",
  },
  { id: "3", text: "БУРБОН ВИСКИ", icon: "FireIcon", color: "#FFB800" },
  { id: "4", text: "СКОТЧ ВИСКИ", icon: "ShieldCheckIcon", color: "#8B5CF6" },
  { id: "5", text: "ЯПОНСКИЙ ВИСКИ", icon: "SparklesIcon", color: "#FF3B8E" },
  { id: "6", text: "ВОДКА", icon: "BoltIcon", color: "#3B82F6" },
  { id: "7", text: "ДЖИН", icon: "LightBulbIcon", color: "#10B8A6" },
  { id: "8", text: "КОНЬЯК", icon: "TrophyIcon", color: "#F97316" },
  { id: "9", text: "ЛИКЕРЫ", icon: "HeartIcon", color: "#EC4899" },
  { id: "10", text: "РОМ", icon: "RocketLaunchIcon", color: "#EF4444" },
  { id: "11", text: "ТЕКИЛА", icon: "SunIcon", color: "#FFB800" },
  { id: "12", text: "САКЕ И СОДЖУ", icon: "MoonIcon", color: "#8B5CF6" },
  { id: "13", text: "ПИВО", icon: "CakeIcon", color: "#F59E0B" },
  {
    id: "14",
    text: "КОКТЕЙЛИ",
    icon: "ChatBubbleLeftIcon",
    color: "#3BCBFF",
  },
  { id: "15", text: "ВИНО КРАСНОЕ", icon: "GiftIcon", color: "#EF4444" },
  { id: "16", text: "ВИНО БЕЛОЕ", icon: "StarIcon", color: "#FFB800" },
  { id: "17", text: "ШАМПАНСКОЕ", icon: "SparklesIcon", color: "#FF3B8E" },
  {
    id: "18",
    text: "БЕЗАЛКОГОЛЬНЫЕ КОКТЕЙЛИ",
    icon: "FaceSmileIcon",
    color: "#10B8A6",
  },
  { id: "19", text: "ЛИМОНАДЫ", icon: "SunIcon", color: "#00FF88" },
  { id: "20", text: "ЧАЙ АВТОРСКИЙ", icon: "HomeIcon", color: "#8B5CF6" },
];

/**
 * Mock leaderboard entries for main page
 */
export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
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
    id: "u23",
    name: "E.",
    avatarText: "МС",
    avatarUrl: "https://i.pravatar.cc/104",
    points: 700,
  },
];

/**
 * Mock user profile data
 */
export const MOCK_USER_DATA: UserProfile = {
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

/**
 * Block ratings for profile statistics
 */
export const BLOCK_RATINGS = [
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

/**
 * Knowledge blocks for doughnut chart
 */
export const KNOWLEDGE_BLOCKS = [
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

/**
 * Activity data for bar chart
 */
export const ACTIVITY_DATA = [
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

/**
 * Practice page leaderboard
 */
export const PRACTICE_LEADERBOARD = [
  { name: "Анна В.", avatar: "АВ", points: 31, time: 2 },
  { name: "Петр С.", avatar: "ПС", points: 28, time: 4 },
  { name: "Владимир Т.", avatar: "ВТ", points: 27, time: 5 },
];

/**
 * Practice questions with different types
 */
export const PRACTICE_QUESTIONS: Question[] = [
  {
    id: 1,
    type: QuestionType.Single,
    title:
      "Как называется основной сорт винограда для производства вина сорта 'Рислинг'?",
    description: "Выберите правильный вариант.",
    points: 1,
    topic: "Виноградные сорта",
    topicLink: "https://gaoinside.netlify.app/",
    answers: [
      {
        id: 1,
        text: "Рислинг",
        isCorrect: true,
      },
      {
        id: 2,
        text: "Каберне Совиньон",
        isCorrect: false,
        explanation: "Каберне Совиньон используется для красных вин.",
      },
      {
        id: 3,
        text: "Пино Нуар",
        isCorrect: false,
        explanation:
          "Пино Нуар используют преимущественно для красных вин и шампанского.",
      },
      {
        id: 4,
        text: "Совиньон Блан",
        isCorrect: false,
        explanation: "Совиньон Блан — самостоятельный белый сорт.",
      },
    ],
  },
  {
    id: 2,
    type: QuestionType.Multiple,
    title: "Какие из этих вин относятся к красным?",
    description: "Выберите все правильные варианты.",
    points: 1,
    topic: "Типы вин",
    topicLink: "https://gaoinside.netlify.app/",
    answers: [
      { id: 5, text: "Мерло", isCorrect: true },
      {
        id: 6,
        text: "Шардоне",
        isCorrect: false,
        explanation: "Шардоне — белое вино.",
      },
      { id: 7, text: "Санджовезе", isCorrect: true },
      {
        id: 8,
        text: "Пино Гриджио",
        isCorrect: false,
        explanation: "Пино Гриджио — белое вино.",
      },
      { id: 9, text: "Каберне Совиньон", isCorrect: true },
    ],
  },
  {
    id: 3,
    type: QuestionType.Text,
    title:
      "Как называется второй брожение, применяемый для производства игристых вин во Франции?",
    description: "Введите краткое название метода (одно слово, на русском).",
    correctText: "шампанизация",
    points: 3,
    topic: "Игристые вина",
    topicLink: "https://gaoinside.netlify.app/",
  },
  {
    id: 4,
    type: QuestionType.Single,
    title: "В какой стране находится знаменитый винный регион Бордо?",
    description: "Выберите правильный вариант.",
    points: 1,
    topic: "Винные регионы",
    topicLink: "https://gaoinside.netlify.app/",
    answers: [
      {
        id: 10,
        text: "Франция",
        isCorrect: true,
      },
      { id: 11, text: "Испания", isCorrect: false },
      { id: 12, text: "Италия", isCorrect: false },
      {
        id: 13,
        text: "Германия",
        isCorrect: false,
        explanation: "Бордо находится во Франции.",
      },
    ],
  },
];

/**
 * Achievements for profile activity tab
 */
export const ACHIEVEMENTS = [
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
];
