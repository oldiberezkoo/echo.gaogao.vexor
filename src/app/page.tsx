import { AcademicCapIcon, BeakerIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="w-full h-full py-6 px-4 flex flex-col gap-6">
      {" "}
      {/* Header */}{" "}
      <div className="flex flex-row w-full items-center justify-between">
        {" "}
        {/* Title */}{" "}
        <span className="text-xl text-white flex leading-tight gap-0.5">
          {" "}
          echo.gao.inside{" "}
          <span className="text-[10px] text-neutral-400 tracking-wide items-start justify-start">
            {" "}
            powered by Danil T.{" "}
          </span>{" "}
        </span>{" "}
        {/* Info block: developer contact */} {/* Icon */}{" "}
        <div className="p-2 bg-neutral-800 rounded-full">
          {" "}
          <BeakerIcon className="size-6 text-neutral-400" />{" "}
        </div>{" "}
      </div>{" "}
      {/* Intro */}{" "}
      <div className="flex flex-col items-start font-sans leading-7 text-[26px]">
        {" "}
        <h1 className="text-white">Проверьте свои знания</h1>{" "}
        <p className="">выберите</p> <p className="">подходящий блок</p>{" "}
      </div>{" "}
      {/* Grid */}{" "}
      <div className="grid grid-cols-2 gap-1 w-full">
        {" "}
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <a
              href="/block"
              key={i}
              className=" py-5 w-full flex flex-col items-center justify-center gap-1 bg-neutral-800 rounded-4xl transition active:scale-95 "
            >
              {" "}
              <AcademicCapIcon className="size-8 " />{" "}
              <h1 className="font-sans font-light">Умение</h1>{" "}
            </a>
          ))}{" "}
      </div>{" "}
    </div>
  );
}
