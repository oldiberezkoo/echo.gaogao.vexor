"use client";

import type { UserProfile } from "@/entities/user";
import { FaviconPNG, PDF_SOURCE_DOMAIN } from "@/shared/constants";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { transliterate } from "transliteration";
import { INTER41_FONT_URL } from "../constants/theme";

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
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    hotfixes: ["enabled-standard-fonts"],
    compress: true,
    format: "a4",
  });

  // === FONT SETUP ===
  try {
    const fontResponse = await fetch(INTER41_FONT_URL);
    const fontBuffer = await fontResponse.arrayBuffer();
    const fontBase64 = arrayBufferToBase64(fontBuffer);
    doc.addFileToVFS(fontBase64, "Inter");
    doc.addFont(fontResponse, "Inter", "normal");
    doc.setFont("Inter");
  } catch (err) {
    console.warn("Failed to load font", err);
  }
  if (!doc.getFont() === undefined && doc.getFont() === "Inter") {
    doc.setFont("helvetica"); // fallback
  }
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // === HEADER LOGO ===
  if (options.includeLogo) {
    try {
      const logoUrl = (FaviconPNG as any)?.src || FaviconPNG;
      const logoResponse = await fetch(logoUrl);
      if (logoResponse.ok) {
        const logoBlob = await logoResponse.blob();
        const logoBase64 = await blobToBase64(logoBlob);
        doc.addImage(logoBase64, "PNG", pageWidth - margin - 15, yPos, 10, 10);
      }
    } catch (err) {
      console.warn("Failed to load logo", err);
    }
  }

  // === PROFILE PHOTO ===
  try {
    const photoResponse = await fetch(profile.avatar);
    if (photoResponse.ok) {
      const photoBlob = await photoResponse.blob();
      const photoBase64 = await blobToBase64(photoBlob);
      doc.addImage(photoBase64, "JPEG", margin, yPos, 24, 24);
    }
  } catch (err) {
    console.warn("Failed to load profile photo", err);
  }

  yPos += 15;

  // === DATE ===
  const now = new Date();
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Дата: ${now.toLocaleDateString("ru-RU")} ${now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`,
    pageWidth - margin,
    yPos,
    { align: "right" },
  );
  yPos += 30;

  // === TITLE ===
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text("Профиль участника", margin, yPos);
  yPos += 15;

  // === PROFILE INFO ===
  doc.setFontSize(14);
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  doc.text(String(fullName).normalize("NFC"), margin, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setTextColor(64, 64, 64);
  doc.text(
    `Позиция: ${String(profile.position ?? "").normalize("NFC")}`,
    margin,
    yPos,
  );
  yPos += 6;
  doc.text(
    `Стаж: ${String(profile.experience ?? "").normalize("NFC")}`,
    margin,
    yPos,
  );
  yPos += 6;
  doc.text(
    `Статус: ${String(profile.status ?? "").normalize("NFC")}`,
    margin,
    yPos,
  );
  yPos += 12;

  // === STATS SUMMARY ===
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Общий рейтинг: #${profile.globalRank}`, margin, yPos);
  yPos += 6;
  doc.text(`Всего очков: ${profile.totalPoints}`, margin, yPos);
  yPos += 6;
  doc.text(`Серия активности: ${profile.streak} дней`, margin, yPos);
  yPos += 15;

  // === BLOCK RATINGS SECTION ===
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Рейтинг по блокам", margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setTextColor(64, 64, 64);
  doc.text("Категория", margin, yPos);
  doc.text("Очки", margin + 80, yPos);
  doc.text("Место", margin + 110, yPos);
  doc.text("Прогресс", margin + 130, yPos);
  yPos += 3;

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 5;

  doc.setTextColor(0, 0, 0);
  for (const rating of blockRatings) {
    if (yPos > 250) {
      doc.addPage();
      yPos = margin;
    }

    doc.text(String(rating.name).normalize("NFC"), margin, yPos);
    doc.text(`${rating.points}/${rating.maxPoints}`, margin + 80, yPos);
    doc.text(`#${rating.rank}`, margin + 110, yPos);

    const barWidth = 40;
    const barHeight = 3;
    const progress = rating.points / rating.maxPoints;

    doc.setFillColor(230, 230, 230);
    doc.rect(margin + 130, yPos - 3, barWidth, barHeight, "F");

    doc.setFillColor(59, 203, 255);
    doc.rect(margin + 130, yPos - 3, barWidth * progress, barHeight, "F");

    yPos += 8;
  }

  // === ACTIVITY CHART ===
  if (options.activityData?.length) {
    doc.addPage();
    yPos = margin;

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Активность за период", margin, yPos);
    yPos += 10;

    const chartWidth = pageWidth - margin * 2;
    const chartHeight = 80;
    const barWidth = chartWidth / options.activityData.length;
    const maxTasks = Math.max(...options.activityData.map((d) => d.tasks));

    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, yPos, chartWidth, chartHeight);

    options.activityData.forEach((data, idx) => {
      const barHeight = (data.tasks / maxTasks) * (chartHeight - 10);
      const x = margin + idx * barWidth + barWidth * 0.2;
      const y = yPos + chartHeight - barHeight - 5;

      doc.setFillColor(59, 203, 255);
      doc.rect(x, y, barWidth * 0.6, barHeight, "F");

      doc.setFontSize(7);
      doc.setTextColor(128, 128, 128);
      doc.text(data.date, x + barWidth * 0.3, yPos + chartHeight + 5, {
        angle: 45,
      });
    });

    yPos += chartHeight + 20;

    const totalTasks = options.activityData.reduce(
      (sum, d) => sum + d.tasks,
      0,
    );
    const totalPoints = options.activityData.reduce(
      (sum, d) => sum + d.points,
      0,
    );
    const avgTasks = totalTasks / options.activityData.length;
    const avgPoints = totalPoints / options.activityData.length;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text("Статистика активности:", margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(64, 64, 64);
    doc.text(`• Всего задач: ${totalTasks}`, margin + 5, yPos);
    yPos += 6;
    doc.text(`• Всего очков: ${totalPoints}`, margin + 5, yPos);
    yPos += 6;
    doc.text(
      `• В среднем: ${avgTasks.toFixed(1)} задач/день (${avgPoints.toFixed(0)} очков)`,
      margin + 5,
      yPos,
    );
    yPos += 6;
    doc.text(`• Максимум: ${maxTasks} задач за день`, margin + 5, yPos);
  }

  // === QR CODE ===
  if (options.profileUrl) {
    try {
      const qrDataUrl = await QRCode.toDataURL(options.profileUrl, {
        width: 256,
        margin: 1,
      });
      const qrSize = 30;
      const qrX = pageWidth - margin - qrSize;
      const qrY = pageHeight - margin - qrSize - 10;
      doc.addImage(qrDataUrl.split(",")[1], "PNG", qrX, qrY, qrSize, qrSize);

      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text("Профиль", qrX + qrSize / 2, qrY + qrSize + 5, {
        align: "center",
      });
    } catch (err) {
      console.warn("Failed to generate QR code", err);
    }
  }

  // === FOOTER ===
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `${PDF_SOURCE_DOMAIN} • Экспортировано для внутреннего использования`,
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" },
  );

  return doc.output("blob");
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

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i]);
  return window.btoa(binary);
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1]; // чистый Base64
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
