"use client";

import { userAtom } from "@/shared/model/telegram-store";
import Modal from "@/shared/providers/MaterialModal";
import * as HeroIcons from "@heroicons/react/24/outline";
import {
  ChartBarIcon,
  PencilIcon,
  PencilSquareIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAtomValue } from "jotai";
import { Link } from "next-view-transitions";
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

type BlockLabel = {
  id: string;
  text: string;
  icon: string;
  color: string;
};

/* =========================
   ICON PICKER DATA
========================= */
const AVAILABLE_ICONS = [
  "AcademicCapIcon",
  "BeakerIcon",
  "BookOpenIcon",
  "ChartBarIcon",
  "ClockIcon",
  "CogIcon",
  "CubeIcon",
  "FireIcon",
  "GlobeAltIcon",
  "HeartIcon",
  "LightBulbIcon",
  "MusicalNoteIcon",
  "PencilIcon",
  "RocketLaunchIcon",
  "ShieldCheckIcon",
  "SparklesIcon",
  "StarIcon",
  "TrophyIcon",
  "UserCircleIcon",
  "BoltIcon",
  "CakeIcon",
  "ChatBubbleLeftIcon",
  "FaceSmileIcon",
  "GiftIcon",
  "HomeIcon",
  "MoonIcon",
  "SunIcon",
  "BanknotesIcon",
  "WrenchIcon",
];

const PRESET_COLORS = [
  "#3BCBFF",
  "#FF3B8E",
  "#FFB800",
  "#00FF88",
  "#8B5CF6",
  "#F97316",
  "#EF4444",
  "#10B981",
  "#3B82F6",
  "#EC4899",
  "#14B8A6",
  "#F59E0B",
];

/* =========================
   LABEL EDIT MODAL COMPONENT
========================= */
interface LabelEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // Добавили проп для заголовка
  initialLabel?: string;
  initialIcon?: string;
  initialColor?: string;
  onSave?: (label: string, icon: string, color: string) => void;
  onDelete?: () => void;
}

function LabelEditModal({
  isOpen,
  onClose,
  title = "Изменить Label", // Значение по умолчанию
  initialLabel = "",
  initialIcon = "AcademicCapIcon",
  initialColor = "#3BCBFF",
  onSave,
  onDelete,
}: LabelEditModalProps) {
  const [label, setLabel] = useState(initialLabel);
  const [selectedIcon, setSelectedIcon] = useState(initialIcon);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [customColor, setCustomColor] = useState(initialColor);

  useEffect(() => {
    if (isOpen) {
      setLabel(initialLabel);
      setSelectedIcon(initialIcon);
      setSelectedColor(initialColor);
      setCustomColor(initialColor);
      setShowIconPicker(false);
    }
  }, [isOpen, initialLabel, initialIcon, initialColor]);

  const handleSave = () => {
    onSave?.(label, selectedIcon, selectedColor);
    onClose();
  };

  const handleDelete = () => {
    onDelete?.();
    onClose();
  };

  const handleCancel = () => {
    setLabel(initialLabel);
    setSelectedIcon(initialIcon);
    setSelectedColor(initialColor);
    setCustomColor(initialColor);
    onClose();
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (HeroIcons as any)[iconName];
    return IconComponent || HeroIcons.AcademicCapIcon;
  };

  const SelectedIconComponent = getIconComponent(selectedIcon);

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} position="bottom">
      <div className="bg-[#121212] rounded-t-[32px] p-6 border-t border-white/10">
        <div className="flex flex-col">
          <div className="w-12 h-1.5 bg-neutral-800 rounded-full mb-6 mx-auto" />

          {/* Заголовок (используем проп title) */}
          <h2 className="text-xl font-bold text-white mb-6">{title}</h2>

          {/* Поле названия */}
          <div className="space-y-2 mb-6">
            <label className="text-sm text-neutral-400">Название</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#3BCBFF] transition-colors"
              placeholder="Введите название"
            />
          </div>

          {/* Выбор иконки и цвета */}
          <div className="space-y-2 mb-6">
            <label className="text-sm text-neutral-400">Иконка и цвет</label>

            <div className="flex items-center gap-3">
              {/* Кнопка выбора иконки */}
              <button
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="relative p-4 bg-neutral-900 border-2 rounded-2xl active:scale-95 transition-all duration-200 hover:bg-neutral-800"
                style={{ borderColor: selectedColor }}
              >
                <SelectedIconComponent
                  className="w-8 h-8"
                  style={{ color: selectedColor }}
                />

                {/* Badge для индикации выбора */}
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#121212]"
                  style={{ backgroundColor: selectedColor }}
                />
              </button>

              {/* Индикатор текущего цвета */}
              <div className="flex-1 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-neutral-700"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <span className="text-white font-medium">
                    {selectedColor}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Icon Picker */}
          {showIconPicker && (
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl max-h-64 overflow-y-auto mb-6">
              <div className="grid grid-cols-6 gap-2">
                {AVAILABLE_ICONS.map((iconName) => {
                  const IconComp = getIconComponent(iconName);
                  const isSelected = iconName === selectedIcon;

                  return (
                    <button
                      key={iconName}
                      onClick={() => {
                        setSelectedIcon(iconName);
                        setShowIconPicker(false);
                      }}
                      className={`p-3 rounded-lg transition-all duration-200 active:scale-95 ${
                        isSelected
                          ? "bg-neutral-800 border-2"
                          : "bg-neutral-800/50 border-2 border-transparent hover:bg-neutral-700"
                      }`}
                      style={isSelected ? { borderColor: selectedColor } : {}}
                    >
                      <IconComp
                        className="w-6 h-6"
                        style={{
                          color: isSelected ? selectedColor : "#9CA3AF",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Выбор цвета */}
          <div className="space-y-3 mb-6">
            <label className="text-sm text-neutral-400">Выбрать цвет</label>

            {/* Предустановленные цвета */}
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    setCustomColor(color);
                  }}
                  className={`w-full aspect-square rounded-lg transition-all duration-200 active:scale-95 ${
                    selectedColor === color
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[#121212]"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Кастомный выбор цвета */}
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setSelectedColor(e.target.value);
                }}
                className="w-16 h-12 rounded-2xl cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setSelectedColor(e.target.value);
                }}
                className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#3BCBFF] transition-colors"
                placeholder="#3BCBFF"
              />
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col gap-3">
            {/* Кнопка удалить - показываем только если мы редактируем (title содержит "Изменить" или передали проп)
                Но проще проверить onSave/onDelete. Для добавления delete может быть не нужен.
            */}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 font-semibold border border-red-500/20 active:scale-95 transition-all duration-200 hover:bg-red-500/20"
              >
                Удалить
              </button>
            )}

            {/* Кнопки Отменить и Сохранить */}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-4 rounded-2xl bg-neutral-900 text-white font-semibold border border-neutral-800 active:scale-95 transition-all duration-200 hover:bg-neutral-800"
              >
                Отменить
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-4 rounded-2xl text-black font-bold active:scale-95 transition-all duration-200 shadow-lg"
                style={{
                  backgroundColor: selectedColor,
                  boxShadow: `0 10px 40px ${selectedColor}33`,
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

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
  const currentUserId = "me";

  const user = useAtomValue(userAtom);

  // Use user data if available to populate the "me" entry
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
      meEntry,
      {
        id: "u23",
        name: "E.",
        avatarText: "МС",
        avatarUrl: "https://i.pravatar.cc/104",
        points: 700,
      },
    ],
    [meEntry]
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

  const [viewModeEdit, setViewModeEdit] = useState(false);

  const [viewBoxCurrentModalEdit, setViewBoxCurrentModalEdit] = useState(false);

  // Состояние для блоков
  const [blocks, setBlocks] = useState<BlockLabel[]>([
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
  ]);

  // Состояние для редактирования
  const [editingBlock, setEditingBlock] = useState<BlockLabel | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditBlock = (block: BlockLabel) => {
    setEditingBlock(block);
    setShowEditModal(true);
  };

  const handleSaveBlock = (label: string, icon: string, color: string) => {
    if (editingBlock) {
      // Редактирование существующего
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === editingBlock.id ? { ...b, text: label, icon, color } : b
        )
      );
    } else {
      // Добавление нового (ЛОГИКА ДОБАВЛЕНИЯ)
      const newBlock: BlockLabel = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(), // Генерация ID
        text: label || "Новый блок",
        icon,
        color,
      };
      setBlocks((prev) => [...prev, newBlock]);
    }
  };

  const handleDeleteBlock = () => {
    if (editingBlock) {
      setBlocks((prev) => prev.filter((b) => b.id !== editingBlock.id));
    }
  };

  // Получить компонент иконки по имени
  const getIconComponent = (iconName: string) => {
    const IconComponent = (HeroIcons as any)[iconName];
    return IconComponent || HeroIcons.AcademicCapIcon;
  };

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

      {/* USER PROGRESS */}
      {userEntry && userRank && (
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
      )}

      {/* LEADERBOARD */}
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

      {/* BLOCK GRID */}
      <div className="grid grid-cols-2 gap-0.5">
        {blocks.map((block) => {
          const IconComponent = getIconComponent(block.icon);

          return (
            <div key={block.id} className="relative">
              <Link
                href="/block"
                className="py-5 bg-neutral-800 rounded-full flex flex-col items-center gap-1 active:scale-95 transition-all duration-300 ease-initial hover:bg-neutral-700"
              >
                <IconComponent
                  className="size-8"
                  style={{ color: block.color }}
                />
                <span className="text-sm font-light text-nowrap text-center">
                  {block.text}
                </span>
              </Link>
              {viewModeEdit && (
                <button
                  aria-label="Редактировать блок"
                  className="absolute -right-2 -top-1 border-dashed text-white rounded-full p-1 transition-colors backdrop-blur-sm bg-neutral-800/50 cursor-pointer"
                  onClick={() => handleEditBlock(block)}
                >
                  <PencilIcon className="size-3" />
                </button>
              )}
            </div>
          );
        })}
        {viewModeEdit && (
          // ИЗМЕНЕНО: Заменили Link на button для открытия модалки
          <button
            onClick={() => {
              setEditingBlock(null); // Сбрасываем редактируемый блок (режим добавления)
              setShowEditModal(true);
            }}
            className="py-5 rounded-full flex flex-col items-center gap-1 active:scale-95 transition-all duration-300 ease-initial border border-[#3BCBFF] text-[#3BCBFF] flex-1 hover:bg-neutral-700"
          >
            <span className="size-8 flex items-center justify-center rounded-full font-bold text-2xl">
              +
            </span>
            <span className="text-sm font-light">Добавить блок</span>
          </button>
        )}
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

      {/* Label Edit Modal */}
      <LabelEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingBlock(null);
        }}
        // Передаем заголовок в зависимости от режима
        title={
          editingBlock ? "Изменить блок %% NAME %%" : "Добавить блок обучения"
        }
        initialLabel={editingBlock?.text || ""}
        initialIcon={editingBlock?.icon || "AcademicCapIcon"}
        initialColor={editingBlock?.color || "#3BCBFF"}
        onSave={handleSaveBlock}
        onDelete={editingBlock ? handleDeleteBlock : undefined}
      />
    </div>
  );
}
