"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AppLogo } from "@/components/brand/app-logo";
import {
  ArrowLeft,
  Download,
  Printer,
  CheckCircle2,
  Maximize2,
  Frame,
  Info,
  ExternalLink,
  Eye,
} from "lucide-react";
import { generateCoverPagePdfAction } from "@/actions/pdf";
import {
  renderTemplateHtml,
  DEFAULT_MARGIN_OPTIONS,
  type MarginOptions,
  type MarginStyle,
  type MarginThickness,
} from "@/lib/templates/render-html";
import { resolveTemplateSlug } from "@/lib/templates/slugs";

interface ActiveCoverDraft {
  templateId: string;
  templateName: string;
  rawHtmlTemplate?: string;
  formData: Record<string, string>;
  logoId: string | null;
  logoUrl: string | null;
  marginOptions?: MarginOptions;
  html: string;
}

export default function DocumentPreviewPage() {
  const [draft, setDraft] = useState<ActiveCoverDraft | null>(null);
  const [marginOptions, setMarginOptions] = useState<MarginOptions>(DEFAULT_MARGIN_OPTIONS);
  const [activeHtml, setActiveHtml] = useState<string>("");

  // Responsive scaling container
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.65);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = sessionStorage.getItem("active_cover_page");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setDraft(parsed);
          if (parsed.marginOptions) {
            setMarginOptions(parsed.marginOptions);
          }
          setActiveHtml(parsed.html || "");
        } catch (e) {
          console.error("Failed to parse draft from sessionStorage:", e);
        }
      }
    }
  }, []);

  // Update scale when container resizes
  useEffect(() => {
    const updateScale = () => {
      if (previewRef.current) {
        const containerWidth = previewRef.current.clientWidth;
        if (containerWidth > 0) {
          setScale(containerWidth / 794);
        }
      }
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (previewRef.current) ro.observe(previewRef.current);
    window.addEventListener("resize", updateScale);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  // Re-render HTML when margin options change dynamically
  const updateMargins = (newOptions: MarginOptions) => {
    setMarginOptions(newOptions);
    if (draft) {
      const baseTemplate = draft.rawHtmlTemplate || draft.html;
      const updatedHtml = renderTemplateHtml({
        htmlTemplate: baseTemplate,
        formData: draft.formData,
        logoUrl: draft.logoUrl,
        marginOptions: newOptions,
      });
      setActiveHtml(updatedHtml);

      // Update session storage
      sessionStorage.setItem(
        "active_cover_page",
        JSON.stringify({
          ...draft,
          marginOptions: newOptions,
          html: updatedHtml,
        })
      );
    }
  };

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Secure PDF Generation: Streams directly through /api/pdf/download without about:blank popups
  const handleGenerateAndDownloadPdf = async () => {
    if (!draft) {
      handlePrint();
      return;
    }

    setIsGeneratingPdf(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await generateCoverPagePdfAction({
        templateId: draft.templateId,
        formData: draft.formData,
        logoId: draft.logoId,
        marginOptions,
      });

      if (!res.success || !res.coverPageId) {
        setErrorMessage(res.error || "Failed to generate PDF document.");
        setIsGeneratingPdf(false);
        return;
      }

      // Secure route: no tokens or signed URLs exposed to the browser
      const secureDownloadUrl = `/api/pdf/download?id=${res.coverPageId}`;
      setDownloadUrl(secureDownloadUrl);
      setSuccessMessage("PDF successfully compiled and secured to cloud storage!");

      // Seamless browser download without opening any about:blank popup
      const downloadAnchor = document.createElement("a");
      downloadAnchor.href = secureDownloadUrl;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error generating PDF";
      setErrorMessage(msg);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Isolated Print: Target ONLY the generated A4 cover page document
  const handlePrint = () => {
    const htmlToPrint = activeHtml || draft?.html;
    if (!htmlToPrint) {
      window.print();
      return;
    }

    let printFrame = document.getElementById("print-cover-frame") as HTMLIFrameElement;
    if (!printFrame) {
      printFrame = document.createElement("iframe");
      printFrame.id = "print-cover-frame";
      printFrame.style.position = "fixed";
      printFrame.style.right = "0";
      printFrame.style.bottom = "0";
      printFrame.style.width = "0";
      printFrame.style.height = "0";
      printFrame.style.border = "0";
      printFrame.style.visibility = "hidden";
      document.body.appendChild(printFrame);
    }

    const frameDoc = printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(htmlToPrint);
      frameDoc.close();

      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
      }, 350);
    }
  };

  const templateSlug = resolveTemplateSlug(draft?.templateId);

  return (
    <div className="space-y-6">
      {/* Status Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          {downloadUrl && (
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={downloadUrl}
                className="font-bold underline text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Again</span>
              </a>
              <span className="text-emerald-300">|</span>
              <a
                href={`${downloadUrl}&inline=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open in PDF Viewer &rarr;</span>
              </a>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-700 font-bold hover:underline ml-4 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Toolbar matching architecture.pdf Page 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Link
            href={`/create?template=${templateSlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-crimson-brand transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Form Editor</span>
          </Link>
          <span className="h-4 w-px bg-slate-200" />
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            A4 Print Ready
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            title="Print only this cover page without browser headers/footers"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Direct Print</span>
          </button>

          <Link
            href={`/create?template=${templateSlug}`}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Edit Fields
          </Link>

          {/* Secure PDF Download */}
          <button
            type="button"
            onClick={handleGenerateAndDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-crimson-brand text-white text-xs font-semibold hover:bg-crimson-hover disabled:opacity-50 shadow-sm transition-all"
          >
            {isGeneratingPdf ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Compiling Secure PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Secure PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Document Canvas & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Document Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Live ISO Document Canvas (Page 1 of 1)
            </span>
            <span className="font-mono text-slate-400">210mm × 297mm (Standard A4)</span>
          </div>

          {/* High Fidelity A4 Document Sheet with Proportional Scaling */}
          <div
            ref={previewRef}
            className="w-full max-w-2xl bg-white shadow-2xl rounded-sm border border-slate-300 overflow-hidden aspect-[1/1.414] relative select-none"
          >
            <div
              style={{
                width: "794px",
                height: "1123px",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
              className="absolute top-0 left-0 bg-white"
            >
              <iframe
                srcDoc={activeHtml || draft?.html || ""}
                title="Rendered Cover Page Document"
                className="w-[794px] h-[1123px] border-0 pointer-events-none select-none bg-white"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Controls & Metadata (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Enhanced Margin Controls */}
          <div className="academic-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Frame className="w-4 h-4 text-crimson-brand" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Margin &amp; Border Styling
                </h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={marginOptions.enabled}
                  onChange={(e) =>
                    updateMargins({ ...marginOptions, enabled: e.target.checked })
                  }
                  className="rounded text-crimson-brand focus:ring-crimson-brand/20 w-4 h-4"
                />
                <span className={marginOptions.enabled ? "text-slate-900" : "text-slate-400"}>
                  {marginOptions.enabled ? "Active" : "None"}
                </span>
              </label>
            </div>

            {marginOptions.enabled && (
              <div className="space-y-3 pt-1">
                {/* Border Style */}
                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Line Style
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium text-center">
                    {(["single", "double", "triple"] as MarginStyle[]).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => updateMargins({ ...marginOptions, style })}
                        className={`py-1.5 px-2 rounded-md capitalize transition-all ${
                          marginOptions.style === style
                            ? "bg-white text-slate-900 font-bold shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Thickness */}
                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Border Thickness
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium text-center">
                    {(["narrow", "medium", "bold"] as MarginThickness[]).map((thk) => (
                      <button
                        key={thk}
                        type="button"
                        onClick={() => updateMargins({ ...marginOptions, thickness: thk })}
                        className={`py-1.5 px-2 rounded-md capitalize transition-all ${
                          marginOptions.thickness === thk
                            ? "bg-white text-slate-900 font-bold shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {thk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Accent Color */}
                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Accent Color
                  </span>
                  <div className="flex items-center gap-2">
                    {[
                      { label: "Crimson", hex: "#800020" },
                      { label: "Navy", hex: "#1e3a8a" },
                      { label: "Slate", hex: "#334155" },
                      { label: "Black", hex: "#111827" },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        title={c.label}
                        onClick={() => updateMargins({ ...marginOptions, color: c.hex })}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          marginOptions.color === c.hex
                            ? "border-crimson-brand ring-2 ring-crimson-brand/30 scale-110"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Print Specifications */}
          <div className="academic-card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Print Specifications
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Standard</span>
                <span className="font-semibold text-slate-900">ISO 216 / A4</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Print Dimensions</span>
                <span className="font-mono text-slate-900">210 × 297 mm</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Target Resolution</span>
                <span className="font-mono font-semibold text-slate-900">300 DPI Lossless</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Security Proxy</span>
                <span className="font-semibold text-emerald-600">Authenticated Stream</span>
              </div>
            </div>
          </div>

          {/* Card 3: Isolated Print Action */}
          <div className="academic-card p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Local Hardcopy Export
            </h3>
            <p className="text-xs text-slate-500">
              Print directly to an AirPrint or connected desktop printer. Only the academic cover sheet is sent to the printer.
            </p>
            <button
              type="button"
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-crimson-brand" />
              <span>Send Cover Page to Printer</span>
            </button>
          </div>

          {/* Card 4: Submission Guidelines */}
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-start gap-3">
            <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-purple-950">Binding Instruction</p>
              <p className="text-purple-700 text-[11px] mt-0.5">
                Fasten this title sheet as the foremost page of your assignment binder or practical lab record.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
