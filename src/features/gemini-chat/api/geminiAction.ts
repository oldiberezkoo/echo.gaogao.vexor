"use server";

import { GEMINI_SYSTEM_PROMPT } from "@/shared/constants";

/**
 * Context for Gemini AI
 */
export interface GeminiContext {
  categories?: string[];
  products?: { name: string; description?: string }[];
}

/**
 * Gemini Server Action Response
 */
export interface GeminiResponse {
  success: boolean;
  text?: string;
  error?: string;
}

/**
 * Call Gemini AI via Server Action
 * @description Sends system prompt, user prompt, and context to Gemini
 */
export async function askGemini(
  userPrompt: string,
  context?: GeminiContext,
  customSystemPrompt?: string,
): Promise<GeminiResponse> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "GOOGLE_GENERATIVE_AI_API_KEY is not configured",
    };
  }

  try {
    const systemPrompt = customSystemPrompt || GEMINI_SYSTEM_PROMPT;

    // Build context string
    let contextString = "";
    if (context?.categories?.length) {
      contextString += `\n\nКатегории: ${context.categories.join(", ")}`;
    }
    if (context?.products?.length) {
      const productList = context.products
        .map((p) => `- ${p.name}${p.description ? `: ${p.description}` : ""}`)
        .join("\n");
      contextString += `\n\nТовары:\n${productList}`;
    }

    const fullPrompt = `${systemPrompt}\n\n---\n\nКонтекст:${contextString}\n\n---\n\nПользовательский запрос: ${userPrompt}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error?.message || "Gemini API request failed",
      };
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return {
        success: false,
        error: "No response from Gemini",
      };
    }

    return {
      success: true,
      text,
    };
  } catch (error) {
    console.error("Gemini Server Action error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
