"use server";

import { UserProfile } from "@/entities/user";
import { PdfExportOptions, ProfilePdfTemplate } from "../ui/ProfilePdfTemplate";

export async function generateProfilePdfAction(
  profile: UserProfile,
  blockRatings: {
    name: string;
    points: number;
    maxPoints: number;
    rank: number;
  }[],
  options: PdfExportOptions = {},
): Promise<string> {
  // Dynamically import react-dom/server to avoid Next.js build issues with Server Actions
  const ReactDOMServer = await import("react-dom/server");
  const html = ReactDOMServer.renderToStaticMarkup(
    ProfilePdfTemplate({ profile, blockRatings, options }),
  );

  let browser;
  try {
    // Logic for local development vs Serverless (Vercel/AWS Lambda)
    if (process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.VERCEL) {
      const chromium = (await import("@sparticuz/chromium")).default;
      const puppeteer = (await import("puppeteer-core")).default;

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    } else {
      // Local development: use standard puppeteer
      const puppeteer = (await import("puppeteer")).default;
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    await browser.close();

    // Convert Buffer to Base64
    return Buffer.from(pdfBuffer).toString("base64");
  } catch (error) {
    console.error("PDF Generation Error:", error);
    if (browser) {
      await browser.close();
    }
    throw new Error("Failed to generate PDF");
  }
}
