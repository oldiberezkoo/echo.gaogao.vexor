import { parse, validate } from "@tma.js/init-data-node";

export function validateInitData(initData: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error(
      "TELEGRAM_BOT_TOKEN is not configured in environment variables"
    );
  }

  try {
    // validate() throws an error if validation fails
    validate(initData, token, {
      // exp: 86400, // Optional: expiry in seconds
    });

    // Parse user data for usage
    const data = parse(initData);
    return { isValid: true, user: data.user, data };
  } catch (error) {
    console.error("Telegram validation failed:", error);
    return { isValid: false, user: null, error };
  }
}
