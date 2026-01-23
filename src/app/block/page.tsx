import { AcademicCapIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full h-full py-6 px-4 flex flex-col gap-3">
      <div className="flex flex-row w-full items-center justify-between">
        {/* Title */}

        {/* Info block: developer contact */}

        {/* Icon */}
        <Link
          href={"/"}
          prefetch={true}
          className="p-2 bg-neutral-800 rounded-full
        
        xanimate
        active:scale-90
        "
        >
          <ArrowLeftIcon className="size-6 text-neutral-400" />
        </Link>
      </div>

      <div className="flex flex-col items-start font-sans my-4">
        <div className="flex flex-row items-center justify-between w-full font-medium">
          <h1 className="text-[#36F79A] leading-7 text-[26px]  ">Block №1</h1>
          <span className="text-[#36F79A] text-[28px] ">10/250</span>
        </div>
        <p className="py-4 text-balance ">
          Освойте разработку на iOS с помощью углубленного обучения по Swift,
          архитектуре приложений и передовым фреймворкам iOS.
        </p>
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-0.5">
        <div className="grid grid-cols-2 gap-1 w-full">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Link
                href="/practice"
                key={i}
                className="
                py-8
                
                w-full
                flex
                flex-col
                items-center
                justify-center
                gap-1
                hover:bg-[#36F79A]
                hover:text-neutral-800
                bg-neutral-800
                rounded-4xl
                transition
                active:scale-95
              "
              >
                <AcademicCapIcon className="size-8 " />
                <h1 className="font-sans font-light">Умение</h1>
              </Link>
            ))}
        </div>
        <Link
          href="/practice"
          prefetch={
            false
          } /* < Практики могут динамически создаваться в момент префетча */
          className="
                py-8
                px-4
                w-full
                flex
                flex-col
                items-start
                justify-start
                gap-1
                bg-[#50EBFF]
                text-neutral-800
                rounded-4xl
                transition
                active:scale-95
              "
        >
          <h1 className="font-sans  font-medium text-[18px]">
            Практика ошибок: (5)
          </h1>
          <p className="font-light">
            Практикуйте больше те задания, которые у вас хуже всего. Вы
            справитесь!
          </p>
        </Link>
      </div>
    </div>
  );
}
