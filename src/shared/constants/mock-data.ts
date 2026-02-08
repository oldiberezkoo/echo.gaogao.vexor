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
  username: "oldiberezko",
  lastName: "",
  avatar:
    "https://k7rxwdfegh.ufs.sh/f/iPXDxxHekoTcRoHyKxbl1aUkSvCHWKcT7oPsu9yD6FfYg2Nx",
  status: "*̷* Его надо запомнить.",
  position: "gaogao.inside.dev",
  experience: "4 года 3 месяца",
  totalPoints: 1375,
  globalRank: 2,
  streak: 12,
};


export const QUIZ_LOGS = [
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
  { date: "13.01", tasks: 5, points: 150 },
  { date: "14.01", tasks: 8, points: 240 },
  { date: "15.01", tasks: 3, points: 90 },
  { date: "16.01", tasks: 12, points: 360 },
  { date: "17.01", tasks: 7, points: 210 },
  { date: "18.01", tasks: 4, points: 120 },
  { date: "19.01", tasks: 9, points: 270 },
  { date: "20.01", tasks: 6, points: 180 },
  { date: "21.01", tasks: 11, points: 330 },
  { date: "22.01", tasks: 8, points: 240 },
  { date: "23.01", tasks: 5, points: 150 },
  { date: "24.01", tasks: 13, points: 390 },
  { date: "25.01", tasks: 7, points: 210 },
  { date: "26.01", tasks: 10, points: 300 },
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
    topicLink: "https://netlify.app/",
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
    topicLink: "https://netlify.app/",
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
    topicLink: "https://netlify.app/",
  },
  {
    id: 4,
    type: QuestionType.Single,
    title: "В какой стране находится знаменитый винный регион Бордо?",
    description: "Выберите правильный вариант.",
    points: 1,
    topic: "Винные регионы",
    topicLink: "https://netlify.app/",
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


export const QUIZ_LOGS_USER = [
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