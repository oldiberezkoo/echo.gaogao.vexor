"use client";

import { AVAILABLE_ICONS, PRESET_COLORS } from "@/shared/constants";
import { Modal } from "@/shared/ui/organisms/Modal";
import * as HeroIcons from "@heroicons/react/24/outline";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

/**
 * LabelEditModal Props
 */
interface LabelEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  initialLabel?: string;
  initialIcon?: string;
  initialColor?: string;
  initialIsVisible?: boolean;
  onSave?: (
    label: string,
    icon: string,
    color: string,
    isVisible: boolean,
  ) => void;
  onDelete?: () => void;
}

/**
 * Get icon component by name from HeroIcons
 */
function getIconComponent(iconName: string) {
  const IconComponent = (HeroIcons as any)[iconName];
  return IconComponent || HeroIcons.AcademicCapIcon;
}

/**
 * LabelEditModal Component
 * @description Modal for editing or adding learning blocks
 */
export function LabelEditModal({
  isOpen,
  onClose,
  title = "Изменить Label",
  initialLabel = "",
  initialIcon = "AcademicCapIcon",
  initialColor = "#3BCBFF",
  initialIsVisible = true,
  onSave,
  onDelete,
}: LabelEditModalProps) {
  const [label, setLabel] = useState(initialLabel);
  const [selectedIcon, setSelectedIcon] = useState(initialIcon);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [isVisible, setIsVisible] = useState(initialIsVisible);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [customColor, setCustomColor] = useState(initialColor);

  useEffect(() => {
    if (isOpen) {
      setLabel(initialLabel);
      setSelectedIcon(initialIcon);
      setSelectedColor(initialColor);
      setCustomColor(initialColor);
      setIsVisible(initialIsVisible);
      setShowIconPicker(false);
    }
  }, [isOpen, initialLabel, initialIcon, initialColor, initialIsVisible]);

  const handleSave = () => {
    onSave?.(label, selectedIcon, selectedColor, isVisible);
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
    setIsVisible(initialIsVisible);
    onClose();
  };

  const SelectedIconComponent = getIconComponent(selectedIcon);

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} position="bottom">
      <div className="bg-[#121212] rounded-t-[32px] p-6 border-t border-white/10">
        <div className="flex flex-col">
          <div className="w-12 h-1.5 bg-neutral-800 rounded-full mb-6 mx-auto" />

          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-6">{title}</h2>

          {/* Visibility Toggle */}
          <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-2xl mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${isVisible ? "bg-[#3BCBFF]/10 text-[#3BCBFF]" : "bg-neutral-800 text-neutral-500"}`}
              >
                {isVisible ? (
                  <EyeIcon className="size-6" />
                ) : (
                  <EyeSlashIcon className="size-6" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-medium">Доступность</span>
                <span className="text-neutral-400 text-xs">
                  {isVisible ? "Блок виден всем" : "Блок скрыт"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${isVisible ? "bg-[#3BCBFF]" : "bg-neutral-800"}`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${isVisible ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
          </div>

          {/* Name field */}
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

          {/* Icon and color selection */}
          <div className="space-y-2 mb-6">
            <label className="text-sm text-neutral-400">Иконка и цвет</label>

            <div className="flex items-center gap-3">
              {/* Icon selection button */}
              <button
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="relative p-4 bg-neutral-900 border-2 rounded-2xl active:scale-95 transition-all duration-200 hover:bg-neutral-800"
                style={{ borderColor: selectedColor }}
              >
                <SelectedIconComponent
                  className="w-8 h-8"
                  style={{ color: selectedColor }}
                />

                {/* Badge */}
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#121212]"
                  style={{ backgroundColor: selectedColor }}
                />
              </button>

              {/* Current color indicator */}
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

          {/* Color selection */}
          <div className="space-y-3 mb-6">
            <label className="text-sm text-neutral-400">Выбрать цвет</label>

            {/* Preset colors */}
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

            {/* Custom color picker */}
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

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            {onDelete && (
              <button
                onClick={handleDelete}
                className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 font-semibold border border-red-500/20 active:scale-95 transition-all duration-200 hover:bg-red-500/20"
              >
                Удалить
              </button>
            )}

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
