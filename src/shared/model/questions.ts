import type { Question } from "@/entities/question";
import { PRACTICE_QUESTIONS } from "@/shared/constants/mock-data";
import { atom } from "jotai";

// Initial state: assign all practice questions to block "1" (Single Malt Whiskey) for demo
const initialQuestions: Record<string, Question[]> = {
  "1": PRACTICE_QUESTIONS,
};

export const questionsAtom = atom<Record<string, Question[]>>(initialQuestions);
