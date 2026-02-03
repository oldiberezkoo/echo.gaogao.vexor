import "server-only";

import { UserProfile } from "@/entities/user";
import { PdfExportOptions, ProfilePdfTemplate } from "../ui/ProfilePdfTemplate";

export async function generatePdfService(
  profile: UserProfile,
  blockRatings: {
    name: string;
    points: number;
    maxPoints: number;
    rank: number;
  }[],
  options: PdfExportOptions = {},
): Promise<string> {
  // Dynamic import react-dom/server
  const ReactDOMServer = await import("react-dom/server");
  const html = ReactDOMServer.renderToStaticMarkup(
    ProfilePdfTemplate({ profile, blockRatings, options }),
  );

  let browser;
  try {
    if (process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.VERCEL) {
      // Dynamic imports for serverless
      const chromium = (await import("chrome-aws-lambda")).default;
      const puppeteer = (await import("puppeteer-core")).default;

      browser = await puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true, // chromium.headless might be true/false/undefined
        ignoreHTTPSErrors: true,
      });
    } else {
      // Dynamic import for local dev
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

    return Buffer.from(pdfBuffer).toString("base64");
  } catch (error) {
    console.error("PDF Service Generation Error:", error);
    if (browser) {
      await browser.close();
    }
    throw new Error("Failed to generate PDF in service layer");
  }
}
