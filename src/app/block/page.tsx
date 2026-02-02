import { AcademicCapIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "next-view-transitions";

/**
 * Название и описание блока ("Вино: Основы и регионы") взяты из practice/page.tsx:
 * - Практика — вопросы по виноградным сортам, винам разных типов, регионам, процессам производства.
 */

export default function Page() {
  return (
    <div className="w-full h-full py-6 px-4 flex flex-col gap-3">
      <div className="flex flex-row w-full items-center justify-between">
        <Link
          href={"/"}
          prefetch={true}
          className="p-2 bg-neutral-800 rounded-full xanimate active:scale-90 "
        >
          <ArrowLeftIcon className="size-6 text-neutral-400" />
        </Link>
      </div>
      <div className="flex flex-col items-start font-sans my-4">
        <div className="flex flex-row items-center justify-between w-full font-medium">
          <h1 className="text-[#36F79A] leading-7 text-[26px] ">
            Вино: основы и регионы
          </h1>
          <span className="text-[#36F79A] text-[28px] ">0/{5 * 4}</span>
        </div>
        <p className="py-4 text-balance ">
          Пройдите практические задания по основным сортам винограда, видам
          вина, основным винодельческим регионам и процессам производства.
          Проверьте и углубите свои знания, чтобы уверенно разбираться в мире
          вин.
        </p>
      </div>
      {/* Grid */}
      <div className="flex flex-col gap-0.5">
        <div className="grid  sm:grid-cols-2  grid-cols-1 gap-1 w-full">
          {[
            "Сорта винограда",
            "Типы вин",
            "Технологии производства",
            "Винные регионы",
          ].map((label, i) => (
            <Link
              href="/practice"
              key={i}
              className="py-8 w-full flex flex-col items-center justify-center gap-1 hover:bg-[#36F79A] hover:text-neutral-800 bg-neutral-800 rounded-4xl transition active:scale-95"
            >
              <AcademicCapIcon className="size-8" />
              <h1 className="text-sm font-light text-nowrap text-center">
                {label}
              </h1>
            </Link>
          ))}
        </div>
        <Link
          href="/practice"
          prefetch={false}
          /* < Практики могут динамически создаваться в момент префетча */
          className="py-8 px-4 w-full flex flex-col items-start justify-start gap-1 bg-[#50EBFF] text-neutral-800 rounded-4xl transition active:scale-95 "
        >
          <h1 className="font-sans font-medium text-[15px] mb-2">
            Практика ошибок: (5)
          </h1>
          <p className="text-[14px]">
            Практикуйте больше те задания, которые у вас хуже всего. <br /> Вы
            справитесь!
          </p>
        </Link>
      </div>
    </div>
  );
}
