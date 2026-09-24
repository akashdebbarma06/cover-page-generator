"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { TemplateRow, LogoWithSignedUrl } from "@/lib/supabase/types";
import { UnifiedCoverPageForm } from "@/components/forms/unified-cover-page-form";
import {
  initialValuesToUnifiedData,
  unifiedDataToFlatValues,
  validateUnifiedCoverPageData,
  type UnifiedCoverPageData,
} from "@/lib/types/cover-page";
import {
  renderTemplateHtml,
  DEFAULT_MARGIN_OPTIONS,
  type MarginOptions,
  type MarginStyle,
  type MarginThickness,
} from "@/lib/templates/render-html";
import { resolveTemplateSlug } from "@/lib/templates/slugs";
import { LogoPicker } from "@/components/logos/logo-picker";
import { AppLogo } from "@/components/brand/app-logo";
import { saveAutofillDefaultsAction } from "@/actions/profile";
import {
  CheckCircle2,
  ArrowRight,
  BookmarkCheck,
  Loader2,
  Copy,
  Frame,
  AlertCircle,
} from "lucide-react";

interface CreateCoverPageContainerProps {
  template: TemplateRow;
  initialValues: Record<string, string>;
  availableLogos: LogoWithSignedUrl[];
  platformUniqueUserId?: string;
  initialLogoId?: string;
  reusedTitle?: string;
}

export function CreateCoverPageContainer({
  template,
  initialValues,
  availableLogos,
  platformUniqueUserId = "STU-84920",
  initialLogoId,
  reusedTitle,
}: CreateCoverPageContainerProps) {
  const router = useRouter();

  // Unified normalized data structure for all form sections
  const [unifiedData, setUnifiedData] = useState<UnifiedCoverPageData>(() =>
    initialValuesToUnifiedData(initialValues)
  );

  const [logos, setLogos] = useState<LogoWithSignedUrl[]>(availableLogos);
  const [selectedLogoId, setSelectedLogoId] = useState<string | null>(
    initialLogoId !== undefined ? initialLogoId : availableLogos[0]?.id || null
  );

  // Enhanced Margin Controls State
  const [marginOptions, setMarginOptions] = useState<MarginOptions>(DEFAULT_MARGIN_OPTIONS);

  const [isSavingDefaults, setIsSavingDefaults] = useState(false);
  const [defaultsMsg, setDefaultsMsg] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Scaled responsive preview container measurement
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState<number>(0.5);

  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth;
        // Standard A4 width reference is 794px at 96 DPI
        if (containerWidth > 0) {
          setPreviewScale(containerWidth / 794);
        }
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }
    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  const handleUnifiedChange = (updated: UnifiedCoverPageData) => {
    setUnifiedData(updated);
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
  };

  const selectedLogo = logos.find((l) => l.id === selectedLogoId);
  const selectedLogoUrl = selectedLogo?.signed_url || null;

  // Derive flat key-value pairs from normalized data for consistent template interpolation
  const flatValues = useMemo(
    () => unifiedDataToFlatValues(unifiedData),
    [unifiedData]
  );

  // Generate live interpolated HTML for the sheet preview including margin options
  const livePreviewHtml = renderTemplateHtml({
    htmlTemplate: template.html_template,
    formData: flatValues,
    logoUrl: selectedLogoUrl,
    marginOptions,
  });

  const handleProceedToPreview = () => {
    // Validate required fields before proceeding
    const validation = validateUnifiedCoverPageData(unifiedData);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      alert(`Please fill in required fields: ${firstError}`);
      return;
    }

    setValidationErrors({});

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "active_cover_page",
        JSON.stringify({
          templateId: template.id,
          templateName: template.name,
          rawHtmlTemplate: template.html_template,
          unifiedData,
          formData: flatValues,
          logoId: selectedLogoId,
          logoUrl: selectedLogoUrl,
          marginOptions,
          html: livePreviewHtml,
        })
      );
    }
    const templateSlug = resolveTemplateSlug(template.id);
    router.push(`/preview?template=${templateSlug}`);
  };

  const handleSaveDefaults = async () => {
    setIsSavingDefaults(true);
    setDefaultsMsg(null);
    try {
      const res = await saveAutofillDefaultsAction(flatValues);
      if (res.success) {
        setDefaultsMsg("Profile defaults updated! Future cover pages will autofill these values.");
        setTimeout(() => setDefaultsMsg(null), 5000);
      } else {
        alert(res.error || "Failed to update defaults.");
      }
    } catch (e) {
      console.error("Save defaults error:", e);
    } finally {
      setIsSavingDefaults(false);
    }
  };

  const handleResetForm = () => {
    if (confirm("Reset form back to your initial baseline profile defaults?")) {
      setUnifiedData(initialValuesToUnifiedData(initialValues));
      setValidationErrors({});
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Unified Form, Logo Selection & Margin Styling (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Reused Past Cover Page Notification Banner */}
        {reusedTitle && (
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <Copy className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                Duplicating past submission: <strong>&ldquo;{reusedTitle}&rdquo;</strong>. Edit any
                field below.
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetForm}
              className="text-purple-700 hover:text-purple-900 font-semibold underline shrink-0 ml-3"
            >
              Reset to Base Profile
            </button>
          </div>
        )}

        {/* Defaults Saved Confirmation Banner */}
        {defaultsMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{defaultsMsg}</span>
          </div>
        )}

        {/* Validation Errors Alert Banner */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-3 shadow-xs animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-950">Incomplete Required Fields</p>
              <p className="text-red-700 text-[11px] mt-0.5">
                Please complete all required fields marked with an asterisk (*) to ensure your document conforms to institutional guidelines.
              </p>
            </div>
          </div>
        )}

        {/* Template Identity Banner & Autofill Action Toolbar */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-crimson-50 text-crimson-brand flex items-center justify-center font-bold text-sm">
              <AppLogo size="sm" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Template
              </p>
              <h2 className="text-base font-bold text-slate-900">{template.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Save Defaults Button */}
            <button
              type="button"
              onClick={handleSaveDefaults}
              disabled={isSavingDefaults}
              title="Save current roll number, department, and faculty as your profile defaults"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
            >
              {isSavingDefaults ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-crimson-brand" />
              ) : (
                <BookmarkCheck className="w-3.5 h-3.5 text-crimson-brand" />
              )}
              <span>Save as Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/templates")}
              className="text-xs font-semibold text-crimson-brand hover:underline px-2 py-1"
            >
              Change Template
            </button>
          </div>
        </div>

        {/* Institution Logo Selector & Uploader Component */}
        <LogoPicker
          availableLogos={logos}
          selectedLogoId={selectedLogoId}
          onSelectLogo={(id) => setSelectedLogoId(id)}
          onLogosUpdated={(updated) => setLogos(updated)}
        />

        {/* Enhanced Margin & Academic Border Controls */}
        <div className="academic-card p-5 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Frame className="w-4 h-4 text-crimson-brand" />
              <h3 className="text-sm font-bold text-slate-900">Institutional Margins &amp; Page Borders</h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={marginOptions.enabled}
                onChange={(e) =>
                  setMarginOptions((prev) => ({ ...prev, enabled: e.target.checked }))
                }
                className="rounded text-crimson-brand focus:ring-crimson-brand/20 w-4 h-4"
              />
              <span className={marginOptions.enabled ? "text-slate-900" : "text-slate-400"}>
                {marginOptions.enabled ? "Margins Active" : "No Borders"}
              </span>
            </label>
          </div>

          {marginOptions.enabled && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 animate-in fade-in duration-150">
              {/* Border Line Style */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Border Style
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium text-center">
                  {(["single", "double", "triple"] as MarginStyle[]).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setMarginOptions((prev) => ({ ...prev, style }))}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Line Thickness
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium text-center">
                  {(["narrow", "medium", "bold"] as MarginThickness[]).map((thk) => (
                    <button
                      key={thk}
                      type="button"
                      onClick={() => setMarginOptions((prev) => ({ ...prev, thickness: thk }))}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Frame Color
                </label>
                <div className="flex items-center gap-2 pt-0.5">
                  {[
                    { label: "Crimson", hex: "#800020" },
                    { label: "Navy", hex: "#1e3a8a" },
                    { label: "Slate", hex: "#334155" },
                    { label: "Classic Black", hex: "#111827" },
                  ].map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      title={c.label}
                      onClick={() => setMarginOptions((prev) => ({ ...prev, color: c.hex }))}
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

        {/* Refined Unified 5-Section Cover Page Form */}
        <UnifiedCoverPageForm
          data={unifiedData}
          onChange={handleUnifiedChange}
          errors={validationErrors}
        />
      </div>

      {/* Right Column: Live Synchronized A4 Sheet Preview (5 cols) */}
      <div className="lg:col-span-5 space-y-4 sticky top-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5 text-crimson-brand">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-crimson-brand"></span>
            </span>
            Real-Time Sheet Preview
          </span>
          <span className="font-mono text-slate-500 text-[11px]">ISO 216 / A4 (210×297mm)</span>
        </div>

        {/* Scaled Responsive A4 Document Container (Never Clips Content) */}
        <div
          ref={previewContainerRef}
          className="w-full bg-white rounded-xl border border-slate-300 shadow-xl overflow-hidden aspect-[1/1.414] relative"
        >
          <div
            style={{
              width: "794px",
              height: "1123px",
              transform: `scale(${previewScale})`,
              transformOrigin: "top left",
            }}
            className="absolute top-0 left-0 bg-white"
          >
            <iframe
              srcDoc={livePreviewHtml}
              title="Cover Page Live Preview"
              className="w-[794px] h-[1123px] border-0 pointer-events-none select-none bg-white"
              sandbox="allow-same-origin"
            />
          </div>
        </div>

        {/* Compliance Note */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900">Registrar Guideline Verified</p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Calibrated for standard institutional binding tolerances. All student, instructor, and evaluation blocks rendered at scale.
            </p>
          </div>
        </div>

        {/* Proceed Action Button */}
        <button
          type="button"
          onClick={handleProceedToPreview}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-crimson-brand text-white text-sm font-semibold hover:bg-crimson-hover shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-crimson-brand/30"
        >
          <span>Proceed to PDF Preview &amp; Export</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
