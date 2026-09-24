import fs from "fs";
import puppeteer from "puppeteer-core";

async function testPdf() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const execPath = fs.existsSync(chromePath) ? chromePath : edgePath;
  console.log("Using executable path:", execPath);

  const browser = await puppeteer.launch({
    executablePath: execPath,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  const page = await browser.newPage();
  const html = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: 'Times New Roman', serif; text-align: center; color: #111; }
        h1 { color: #800020; font-size: 24pt; margin-top: 50px; }
        p { font-size: 14pt; color: #444; }
      </style>
    </head>
    <body>
      <h1>NATIONAL INSTITUTE OF TECHNOLOGY</h1>
      <p>Automated PDF Generation Pipeline Verified</p>
    </body>
  </html>`;

  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  await browser.close();
  console.log("PDF generated successfully! Buffer length:", pdfBuffer.length);
}

testPdf().catch(console.error);
