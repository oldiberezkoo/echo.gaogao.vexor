import bs58 from "bs58";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function encodeToBase58<T>(value: T): string {
  const json = JSON.stringify(value);
  const bytes = encoder.encode(json); // Uint8Array
  return bs58.encode(bytes); // string
}

export function decodeFromBase58<T>(encoded: string): T {
  const bytes = bs58.decode(encoded); // Uint8Array
  const json = decoder.decode(bytes);
  return JSON.parse(json) as T;
}
