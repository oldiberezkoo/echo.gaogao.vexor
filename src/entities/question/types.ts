/**
 * Question type enum
 * @description Defines the type of answer expected for a question
 */
export enum QuestionType {
  /** Single choice question */
  Single = "single",
  /** Multiple choice question */
  Multiple = "multiple",
  /** Free text input question */
  Text = "text",
}

/**
 * Answer option for choice questions
 */
export interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
  /** Explanation shown when incorrect answer is selected */
  explanation?: string;
}

/**
 * Question entity for test system
 */
export interface Question {
  id: number;
  type: QuestionType;
  title: string;
  description: string;
  /** Optional image URL for the question */
  imageUrl?: string;
  /** Answer options for single/multiple choice */
  answers?: Answer[];
  /** Correct answer for text type questions */
  correctText?: string;
  /** Points awarded for correct answer */
  points: number;
  /** Topic category */
  topic: string;
  /** Link to learning material */
  topicLink: string;
}

/**
 * User's answer - either text or array of selected answer IDs
 */
export type UserAnswer = string | number[];
