"use client";

import { initDataAtom, isAuthorizedAtom } from "@/shared/model/telegram-store";
import { retrieveLaunchParams } from "@tma.js/sdk-react";
import { useSetAtom } from "jotai";
import { PropsWithChildren, useEffect, useState } from "react";

function SDKProviderLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}

export function TMAProvider({ children }: PropsWithChildren) {
  const setAuthorized = useSetAtom(isAuthorizedAtom);
  const setInitData = useSetAtom(initDataAtom);

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      // retrieveLaunchParams checks usage in browser vs telegram
      const params = retrieveLaunchParams();

      // Check if we have initData (basic auth check)
      if (params.initData) {
        setAuthorized(true);
        setInitData(params.initData);
        setIsReady(true);
      } else if (process.env.NODE_ENV === "development") {
        // Mock data for local development
        console.warn(
          "⚠️ Running in Development mode with MOCKED Telegram data"
        );
        const mockUser = {
          id: 123456789,
          firstName: "Developer",
          lastName: "User",
          username: "dev_user",
          languageCode: "en",
          isPremium: true,
          allowsWriteToPm: true,
        };

        setAuthorized(true);
        // We cast to any because we are mocking and creating a full InitData object is complex/internal
        setInitData({
          user: mockUser,
          authDate: new Date(),
          hash: "mock_hash",
          // Add other necessary fields if your app relies on them specifically
        } as any);
        setIsReady(true);
      } else {
        setError("Authorization failed: No init data provided.");
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Unknown error during initialization");
      }
    }
  }, [setAuthorized, setInitData]);

  if (!mounted) {
    return <SDKProviderLoading />;
  }

  // if (error) {
  //   return (
  //     <div className="w-full max-w-[768px] mx-auto min-h-screen px-4 py-6 flex items-center justify-center">
  //       <section className="w-full bg-neutral-800 rounded-4xl p-6 flex flex-col gap-6">
  //         <div className="flex items-center justify-between">
  //           <div className="flex flex-row items-center gap-2 justify-center ">
  //             <div className="p-2 rounded-full bg-neutral-700">
  //               <ExclamationTriangleIcon className="size-6 text-red-400" />
  //             </div>
  //             <h1 className="text-xl font-semibold text-white">
  //               Доступ ограничен
  //             </h1>
  //           </div>
  //           <div className="">{new Date().toLocaleString("ru-RU")} ru-RU</div>
  //         </div>

  //         <div className="text-neutral-300 leading-6">
  //           <p>
  //             Не удалось получить параметры запуска из доверенных источников.
  //           </p>
  //           <p className="mt-2 text-sm text-neutral-400">
  //             Чаще всего это происходит, если приложение открыто вне среды
  //             Telegram или через неподдерживаемый клиент.
  //           </p>
  //         </div>

  //         <div className="flex flex-col gap-3">
  //           <p className="text-sm font-medium text-neutral-200">
  //             Что можно сделать сейчас:
  //           </p>
  //           <ul className="text-sm text-neutral-400 list-disc list-inside flex flex-col gap-1">
  //             <li>Попробуйте очистить кэш</li>
  //             <li>Попробуйте обновить Telegram</li>
  //             <li>Перезагрузите телефон</li>
  //           </ul>
  //         </div>

  //         <div className="flex flex-col gap-2">
  //           <p className="text-sm text-neutral-400">
  //             Если вы считаете, что это ошибка:
  //           </p>
  //           <a
  //             href="https://t.me/oldiberezko"
  //             target="_blank"
  //             className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-neutral-700 text-white text-sm font-medium transition-colors hover:bg-[#36F79A] hover:text-neutral-800"
  //           >
  //             Связаться с разработчиком @oldiberezko
  //           </a>
  //         </div>

  //         <div className="text-xs font-mono bg-neutral-900 text-neutral-300 p-3 rounded-2xl">
  //           <div className="opacity-70 mb-1">Диагностика:</div>
  //           <div>{error || "Неизвестная ошибка инициализации"}</div>
  //           <div className="mt-2 opacity-60">Клиент iMe не инициализирован</div>
  //         </div>
  //       </section>
  //     </div>
  //   );
  // }

  // if (!isReady) {
  //   return <SDKProviderLoading />;
  // }

  return <>{children}</>;
}
