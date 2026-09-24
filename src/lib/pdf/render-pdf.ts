import fs from "fs";
import puppeteer, { type Browser } from "puppeteer-core";

interface RenderPdfOptions {
  html: string;
  format?: "A4" | "Letter";
  landscape?: boolean;
}

/**
 * Discovers a usable Chromium executable on local Windows, macOS, or serverless Linux.
 */
async function getChromiumExecutablePath(): Promise<{
  executablePath: string;
  args: string[];
}> {
  // 1. Serverless Linux environment (Vercel, AWS Lambda, Docker container)
  if (
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.platform === "linux"
  ) {
    try {
      const chromium = (await import("@sparticuz/chromium")).default;
      const executablePath = await chromium.executablePath();
      return {
        executablePath,
        args: [
          ...chromium.args,
          "--disable-gpu",
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
          "--no-zygote",
        ],
      };
    } catch (e) {
      console.warn("Could not load @sparticuz/chromium, checking system chromium:", e);
      if (fs.existsSync("/usr/bin/chromium-browser")) {
        return {
          executablePath: "/usr/bin/chromium-browser",
          args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
        };
      }
      if (fs.existsSync("/usr/bin/google-chrome")) {
        return {
          executablePath: "/usr/bin/google-chrome",
          args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
        };
      }
    }
  }

  // 2. Custom environment override
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return {
      executablePath: process.env.CHROME_PATH,
      args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
    };
  }

  // 3. Local Windows OS paths
  if (process.platform === "win32") {
    const windowsPaths = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
      `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
      `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
      `${process.env["PROGRAMFILES(X86)"]}\\Microsoft\\Edge\\Application\\msedge.exe`,
    ];

    for (const p of windowsPaths) {
      if (p && fs.existsSync(p)) {
        return {
          executablePath: p,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
          ],
        };
      }
    }
  }

  // 4. Local macOS paths
  if (process.platform === "darwin") {
    const macPaths = [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ];

    for (const p of macPaths) {
      if (fs.existsSync(p)) {
        return {
          executablePath: p,
          args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
        };
      }
    }
  }

  throw new Error(
    "Could not locate a valid Chromium or Chrome executable for PDF generation."
  );
}

/**
 * Renders an HTML string into a production-grade, print-ready PDF buffer using Puppeteer.
 */
export async function renderHtmlToPdf({
  html,
  format = "A4",
  landscape = false,
}: RenderPdfOptions): Promise<Buffer> {
  const { executablePath, args } = await getChromiumExecutablePath();

  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args,
    });

    const page = await browser.newPage();

    // Set viewport matching standard A4 at 96 DPI
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2, // 2x scale for ultra-crisp vector typography
    });

    // Load template HTML and wait until all network assets (images, web fonts) are loaded
    await page.setContent(html, {
      waitUntil: ["load", "domcontentloaded"],
      timeout: 30000,
    });

    // Render ISO compliant PDF
    const pdfUint8Array = await page.pdf({
      format,
      landscape,
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    });

    return Buffer.from(pdfUint8Array);
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
