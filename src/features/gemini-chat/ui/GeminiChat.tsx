"use client";

import {
  PaperAirplaneIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { askGemini, type GeminiContext } from "../api/geminiAction";

interface GeminiChatProps {
  context?: GeminiContext;
}

export function GeminiChat({ context }: GeminiChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "model"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await askGemini(userMessage, context);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text:
            response.text ||
            response.error ||
            "Произошла ошибка при получении ответа.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Прошу прощения, я не могу ответить на этот вопрос сейчас.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-[#3BCBFF] to-[#50EBFF] rounded-full shadow-lg hover:shadow-[#3BCBFF]/50 transition-all active:scale-95 z-40 group"
        aria-label="Спросить AI"
      >
        <SparklesIcon className="size-6 text-black group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-100px)] bg-[#191919] border border-neutral-800 rounded-3xl shadow-2xl flex flex-col z-40 overflow-hidden font-sans">
      {/* Header */}
      <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-5 text-[#3BCBFF]" />
          <h3 className="font-semibold text-white">AI Помощник</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-neutral-800 rounded-full transition-colors"
        >
          <XMarkIcon className="size-5 text-neutral-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-neutral-500 mt-10">
            <SparklesIcon className="size-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Задайте вопрос по текущей теме.</p>
            <p className="text-xs mt-1 text-neutral-600">
              Я не даю прямых ответов на тесты.
            </p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-[#3BCBFF] text-black rounded-tr-sm"
                  : "bg-neutral-800 text-neutral-200 rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 p-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <div
                  className="size-2 bg-neutral-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="size-2 bg-neutral-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="size-2 bg-neutral-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-neutral-900 border-t border-neutral-800"
      >
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Спросить Gemini..."
            className="w-full bg-neutral-800 text-white pl-4 pr-10 py-3 rounded-xl outline-none focus:ring-1 focus:ring-[#3BCBFF] transition-all placeholder:text-neutral-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#3BCBFF] rounded-lg disabled:opacity-50 disabled:bg-neutral-700 transition-colors"
          >
            <PaperAirplaneIcon className="size-4 text-black" />
          </button>
        </div>
      </form>
    </div>
  );
}
