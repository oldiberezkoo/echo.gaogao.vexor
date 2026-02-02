"use client";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

type ModalPosition = "top" | "center" | "bottom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  position?: ModalPosition;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  position = "center",
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses = {
    top: "items-start justify-center",
    center: "items-center justify-center",
    bottom: "items-end justify-center",
  };

  return (
    <section
      className={twMerge(
        `fixed inset-0 bg-black/70 flex ${positionClasses[position]} z-50`,
        className
      )}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-w-[568px] overflow-hidden">{children}</div>
    </section>
  );
}
