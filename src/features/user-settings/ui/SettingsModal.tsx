"use client";

import { Modal } from "@/shared/ui/organisms/Modal";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    firstName: string;
    lastName: string;
    position: string;
  };
  onSave: (data: {
    firstName: string;
    lastName: string;
    position: string;
  }) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: SettingsModalProps) {
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [position, setPosition] = useState(initialData.position);

  useEffect(() => {
    if (isOpen) {
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
      setPosition(initialData.position);
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    onSave({ firstName, lastName, position });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      className="bg-black/50"
    >
      <div className="p-6 bg-neutral-800 rounded-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#3BCBFF]/10 rounded-full">
            <UserCircleIcon className="size-6 text-[#3BCBFF]" />
          </div>
          <h2 className="text-xl font-bold text-white">Настройки профиля</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-neutral-400 text-sm mb-1.5">Имя</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-neutral-900 text-white px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-[#3BCBFF]"
            />
          </div>

          <div>
            <label className="block text-neutral-400 text-sm mb-1.5">
              Фамилия
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-neutral-900 text-white px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-[#3BCBFF]"
            />
          </div>

          <div>
            <label className="block text-neutral-400 text-sm mb-1.5">
              Должность
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full bg-neutral-900 text-white px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-[#3BCBFF]"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-700 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-[var(--color-primary)] text-black font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </Modal>
  );
}
