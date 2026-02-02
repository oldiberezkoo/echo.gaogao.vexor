"use client";

import type { UserProfile } from "@/entities/user";
import { PDF_SOURCE_DOMAIN } from "@/shared/constants";
import jsPDF from "jspdf";

/**
 * PDF Export Options
 */
export interface PdfExportOptions {
  /** Include logo in header */
  includeLogo?: boolean;
  /** Additional notes for admin */
  adminNotes?: string;
}

/**
 * Generate black and white PDF export of participant profile
 * @description Creates a BW PDF suitable for admin printing
 */
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
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Header with source
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Источник: ${PDF_SOURCE_DOMAIN}`, pageWidth - margin, yPos, {
    align: "right",
  });
  yPos += 5;

  // Date
  const now = new Date();
  doc.text(
    `Дата: ${now.toLocaleDateString("ru-RU")} ${now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`,
    pageWidth - margin,
    yPos,
    { align: "right" },
  );
  yPos += 15;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text("Профиль участника", margin, yPos);
  yPos += 15;

  // Profile info
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  doc.text(fullName, margin, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setTextColor(64, 64, 64);
  doc.text(`Позиция: ${profile.position}`, margin, yPos);
  yPos += 6;
  doc.text(`Стаж: ${profile.experience}`, margin, yPos);
  yPos += 6;
  doc.text(`Статус: ${profile.status}`, margin, yPos);
  yPos += 12;

  // Stats summary
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Общий рейтинг: #${profile.globalRank}`, margin, yPos);
  yPos += 6;
  doc.text(`Всего очков: ${profile.totalPoints}`, margin, yPos);
  yPos += 6;
  doc.text(`Серия активности: ${profile.streak} дней`, margin, yPos);
  yPos += 15;

  // Block ratings section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Рейтинг по блокам", margin, yPos);
  yPos += 10;

  // Table header
  doc.setFontSize(10);
  doc.setTextColor(64, 64, 64);
  doc.text("Категория", margin, yPos);
  doc.text("Очки", margin + 80, yPos);
  doc.text("Место", margin + 110, yPos);
  yPos += 3;

  // Line under header
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 5;

  // Table rows
  doc.setTextColor(0, 0, 0);
  for (const rating of blockRatings) {
    if (yPos > 270) {
      doc.addPage();
      yPos = margin;
    }

    doc.text(rating.name, margin, yPos);
    doc.text(`${rating.points}/${rating.maxPoints}`, margin + 80, yPos);
    doc.text(`#${rating.rank}`, margin + 110, yPos);
    yPos += 6;
  }

  // Admin notes
  if (options.adminNotes) {
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Заметки администратора:", margin, yPos);
    yPos += 5;
    doc.setTextColor(64, 64, 64);
    const lines = doc.splitTextToSize(
      options.adminNotes,
      pageWidth - margin * 2,
    );
    doc.text(lines, margin, yPos);
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `vexor.gaogao.inside.net • Экспортировано для внутреннего использования`,
    pageWidth / 2,
    footerY,
    { align: "center" },
  );

  return doc.output("blob");
}

/**
 * Download PDF with profile export
 */
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
  link.download = `profile_${profile.firstName.toLowerCase().replace(/[^a-zа-яё0-9]/gi, "_")}_${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
