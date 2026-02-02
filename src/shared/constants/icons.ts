/**
 * Available HeroIcons for block selection
 * @description Icon names from @heroicons/react/24/outline
 */
export const AVAILABLE_ICONS = [
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
] as const;

export type AvailableIcon = (typeof AVAILABLE_ICONS)[number];

/**
 * Preset colors for block customization
 * @description Primary color is #3BCBFF
 */
export const PRESET_COLORS = [
  "#3BCBFF", // Primary
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
] as const;

export type PresetColor = (typeof PRESET_COLORS)[number];
