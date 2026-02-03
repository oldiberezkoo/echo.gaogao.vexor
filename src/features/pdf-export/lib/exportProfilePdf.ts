"use client";

import type { UserProfile } from "@/entities/user";
import { FaviconPNG } from "@/shared/constants";
import QRCode from "qrcode";
import { transliterate } from "transliteration";
import { generateProfilePdfAction } from "../actions/generate-pdf";

/**
 * PDF Export Options
 */
export interface PdfExportOptions {
  includeLogo?: boolean;
  adminNotes?: string;
  activityData?: { date: string; tasks: number; points: number }[];
  profileUrl?: string;
}

export async function exportProfilePdf(
  profile: UserProfile,
  blockRatings: {
    name: string;
    points: number;
    maxPoints: number;
    rank: number;
  }[],
  options: PdfExportOptions = {},
): Promise<Blob> {
  // 1. Prepare assets (convert to Base64) for Server Action
  let logoBase64: string | undefined;
  if (options.includeLogo) {
    try {
      const logoUrl = (FaviconPNG as any)?.src || FaviconPNG;
      const logoResponse = await fetch(logoUrl);
      if (logoResponse.ok) {
        const logoBlob = await logoResponse.blob();
        logoBase64 = await blobToBase64(logoBlob);
        // Add data prefix if missing (usually blobToBase64 adds it if we implement it that way,
        // but here we might need to be explicit)
        // My helper below returns base64 string without prefix? Let's check helper
        logoBase64 = `data:image/png;base64,${logoBase64}`;
      }
    } catch (err) {
      console.warn("Failed to load logo", err);
    }
  }

  // Profile Avatar
  // Server-side fetching might fail if it's a relative path or protected, duplicate logic here
  // But wait, server action receives UserProfile which has avatar URL.
  // Puppeteer might be able to load it if it's a public URL (e.g. S3).
  // If it's a local path (starts with /), Puppeteer won't find it easily without full URL.
  // Safest is to convert to base64 here if it's same-origin, or pass full URL.
  // Let's rely on UserProfile having a valid URL for now, but if it fails we might need to fetch here.
  // Actually, if we want to be 100% sure, let's fetch here.
  // BUT fetching cross-origin images on client might invoke CORS.
  // Use the URL as is unless we know it's problematic.
  // The UserProfile usually has a public URL or a relative one.
  // If relative, we need origin.
  if (profile.avatar && profile.avatar.startsWith("/")) {
    profile = {
      ...profile,
      avatar: `${window.location.origin}${profile.avatar}`,
    };
  }

  // QR Code
  let qrCodeUrl: string | undefined;
  if (options.profileUrl) {
    try {
      qrCodeUrl = await QRCode.toDataURL(options.profileUrl, {
        width: 256,
        margin: 1,
      });
    } catch (err) {
      console.warn("Failed to generate QR code", err);
    }
  }

  // 2. Call Server Action
  const pdfBase64 = await generateProfilePdfAction(
    profile,
    blockRatings,
    {
      ...options,
      includeLogo: logoBase64, // Pass base64 string instead of boolean
      qrCodeUrl,
    } as any, // Cast because options types mismatch slightly (boolean vs string)
  );

  // 3. Convert Base64 back to Blob
  return base64ToBlob(pdfBase64, "application/pdf");
}

// === DOWNLOAD FUNCTION ===
export async function downloadProfilePdf(
  profile: UserProfile,
  blockRatings: {
    name: string;
    points: number;
    maxPoints: number;
    rank: number;
  }[],
  options?: PdfExportOptions,
): Promise<void> {
  const blob = await exportProfilePdf(profile, blockRatings, options);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `profile_${sanitizeFilename(profile.firstName)}_${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// === HELPERS ===
function sanitizeFilename(text: string): string {
  if (!text) return "export";
  return transliterate(text)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_{2,}/g, "_")
    .trim();
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // split(',') to get strictly the data
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(base64: string, type: string): Blob {
  const binStr = atob(base64);
  const len = binStr.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }
  return new Blob([arr], { type: type });
}
