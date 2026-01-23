import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full h-full py-6 px-4 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-row w-full items-center justify-between">
        <Link
          href="/practice"
          className="
            p-2
            bg-neutral-800
            rounded-full
            xanimate
            active:scale-90
          "
        >
          <XMarkIcon className="size-6 text-neutral-400" />
        </Link>

        <p>{new Date().toLocaleString()}</p>
      </div>

      {/* Question */}
      <div className="flex flex-col gap-2 font-sans">
        <span className="text-sm text-neutral-400">0 / 10</span>

        <h1 className="text-[26px] leading-7 font-medium text-[#36F79A]">
          Название вопроса
        </h1>

        <p className="pt-2 text-sm ">Описание вопроса и практика</p>
      </div>

      {/* Answers */}
      <div className="flex flex-col gap-1">
        {/* Default */}
        <button
          className="
            w-full
            flex
            gap-3
            items-start
            px-4
            py-6
            bg-neutral-800
            rounded-4xl
            text-left
            transition
            hover:bg-[#36F79A]
            hover:text-neutral-800
            active:scale-95
          "
        >
          <span
            className="
              size-12
              
              rounded-full
              border
              border-neutral-400
              flex
              items-center
              justify-center
              pointer-events-none
            "
          />
          <p className="font-light">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Exercitationem error quisquam explicabo similique voluptatem!
          </p>
        </button>

        {/* Correct */}
        <button
          className="
            w-full
            flex
            gap-3
            items-start
            px-4
            py-6
            bg-[#36F79A]
            text-neutral-800
            rounded-4xl
            text-left
            transition
            active:scale-95
          "
        >
          <span
            className="
              size-10
              mt-1
              rounded-full
              bg-neutral-800
              flex
              items-center
              justify-center
              pointer-events-none
            "
          >
            <CheckIcon className="size-10 text-[#36F79A]" />
          </span>

          <p className="font-light">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Exercitationem error quisquam explicabo similique voluptatem!
          </p>
        </button>

        {/* Wrong */}
        <div className="flex flex-col gap-2">
          <button
            className="
              w-full
              flex
              gap-3
              items-start
              px-4
              py-6
              bg-[#ED0A35]
              text-white
              rounded-4xl
              text-left
              transition
              active:scale-95
            "
          >
            <span
              className="
                size-6
                mt-1
                rounded-full
                border
                border-white
                pointer-events-none
              "
            />
            <p className="font-light">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Exercitationem error quisquam explicabo similique voluptatem!
            </p>
          </button>

          <p className="px-6 text-sm text-neutral-300">
            * Lorem ipsum dolor sit amet consectetur.
          </p>
        </div>
      </div>

      {/* Next */}
      <div className="flex place-content-center">
        {" "}
        <Link
          href="/practice"
          className="
          
          px-12
          py-6
          text-center
          font-medium
          bg-[#50EBFF]
          text-neutral-800
          rounded-full
          transition
          active:scale-95
        "
        >
          Следующий вопрос
        </Link>
      </div>
    </div>
  );
}
