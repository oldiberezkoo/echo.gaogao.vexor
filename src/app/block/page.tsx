"use client";

import { AcademicCapIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="w-full h-full py-6 px-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-row w-full items-center justify-between">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="
            p-2
            bg-neutral-800
            rounded-full
            transition-transform
            active:scale-90
          "
        >
          <ArrowLeftIcon className="size-6 text-neutral-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col items-start font-sans my-4">
        <div className="flex flex-row items-center justify-between w-full font-medium">
          <h1 className="text-[#36F79A] leading-7 text-[26px]">Block №1</h1>
          <span className="text-[#36F79A] text-[28px]">10/250</span>
        </div>
        <p className="py-4 text-balance">
          Освойте разработку на iOS с помощью углубленного обучения по Swift,
          архитектуре приложений и передовым фреймворкам iOS.
        </p>
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="grid grid-cols-2 gap-1 w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <button
              key={i}
              className="
                py-8
                w-full
                flex
                flex-col
                items-center
                justify-center
                gap-1
                bg-neutral-800
                rounded-3xl
                transition
                hover:bg-[#36F79A]
                hover:text-neutral-800
                active:scale-95
              "
            >
              <AcademicCapIcon className="size-8" />
              <span className="font-light">Умение</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <dialog
          open
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/60
            backdrop-blur-sm
          "
          onClick={() => setIsDialogOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              bg-neutral-900
              rounded-[28px]
              p-6
              w-[90%]
              max-w-md
              shadow-2xl
              animate-[slideIn_0.2s_ease-out]
            "
          >
            <h2 className="text-xl font-medium text-white">Завершить тест?</h2>
            <p className="mt-2 text-sm text-neutral-400">
              Вы уверены, что хотите завершить тест? Весь прогресс будет
              сохранён.
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="
                  px-6
                  py-2.5
                  rounded-full
                  text-[#36F79A]
                  font-medium
                  hover:bg-[#36F79A]/10
                  active:scale-95
                "
              >
                Отмена
              </button>

              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  // router.push('/')
                }}
                className="
                  px-6
                  py-2.5
                  rounded-full
                  bg-[#36F79A]
                  text-neutral-900
                  font-medium
                  hover:bg-[#36F79A]/90
                  active:scale-95
                "
              >
                Завершить
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
