import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import { renderHtmlToPdf } from "../src/lib/pdf/render-pdf.ts";
import { renderTemplateHtml } from "../src/lib/templates/render-html.ts";

// Read env
const envContent = fs.readFileSync(".env.local", "utf-8");
const envVars = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || "";
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    envVars[match[1]] = value.trim();
  }
}

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function testPipeline() {
  console.log("1. Fetching template from Supabase...");
  const { data: templates, error: tErr } = await supabase.from("templates").select("*").limit(1);
  if (tErr || !templates?.[0]) throw new Error("Template not found: " + JSON.stringify(tErr));
  const template = templates[0];
  console.log("Loaded template:", template.name);

  console.log("2. Fetching system logo...");
  const { data: logos } = await supabase.from("logos").select("*").limit(1);
  let logoUrl = null;
  if (logos?.[0]) {
    const { data: signed } = await supabase.storage.from("logos").createSignedUrl(logos[0].storage_path, 3600);
    logoUrl = signed?.signedUrl;
    console.log("Generated signed logo URL:", logoUrl?.slice(0, 80) + "...");
  }

  console.log("3. Compiling template HTML...");
  const sampleFormData = {
    institutionName: "MASSACHUSETTS INSTITUTE OF TECHNOLOGY",
    department: "DEPARTMENT OF ELECTRICAL ENGINEERING & COMPUTER SCIENCE",
    submissionType: "TERM REPORT / CAPSTONE ARCHITECTURE",
    assignmentTitle: "Distributed Consensus & Zero-Knowledge Verification",
    assignmentSubtitle: "High-Throughput State Machine Replication over Byzantine Faults",
    subjectCode: "6.824",
    subject: "Distributed Systems Engineering",
    semester: "Fall Term 2024",
    fullName: "Alex Rivera",
    rollNo: "MIT-EECS-2024-8841",
    studentId: "STU-84920",
    facultyName: "Prof. Robert Morris",
    facultyDesignation: "Professor of Computer Science & Engineering",
    submissionDate: "2024-11-20",
  };

  const html = renderTemplateHtml({
    htmlTemplate: template.html_template,
    formData: sampleFormData,
    logoUrl,
  });

  console.log("4. Rendering PDF buffer via Puppeteer...");
  const pdfBuffer = await renderHtmlToPdf({ html, format: "A4" });
  console.log("Generated PDF size:", pdfBuffer.length, "bytes");

  // Verify PDF header
  const header = pdfBuffer.slice(0, 5).toString();
  console.log("PDF Magic bytes:", header);
  if (header !== "%PDF-") throw new Error("Invalid PDF header!");

  console.log("5. Uploading to Supabase Storage 'cover-pages' bucket...");
  const storagePath = `test-pipeline/${Date.now()}-eecs-report.pdf`;
  const { data: uploadData, error: upErr } = await supabase.storage
    .from("cover-pages")
    .upload(storagePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });
  if (upErr) throw upErr;
  console.log("Uploaded successfully to:", uploadData.path);

  console.log("6. Creating signed download URL...");
  const { data: signedPdf, error: signErr } = await supabase.storage
    .from("cover-pages")
    .createSignedUrl(storagePath, 3600);
  if (signErr) throw signErr;
  console.log("Signed download URL generated successfully:\n", signedPdf.signedUrl);

  console.log("Phase 5 PDF Pipeline verified end-to-end!");
}

testPipeline().catch(console.error);
