import { NextRequest, NextResponse } from "next/server";

import chromium from "chrom e-aws-lambda";
import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath,
  headless: chromium.headless,
});

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json();

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Устанавливаем HTML контент
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // Генерируем PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    });

    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="profile.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
