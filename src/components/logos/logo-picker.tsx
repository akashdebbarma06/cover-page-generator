"use client";

import React, { useState, useRef } from "react";
import type { LogoWithSignedUrl } from "@/lib/supabase/types";
import { uploadStudentLogoAction, deleteStudentLogoAction } from "@/actions/logos";
import {
  Building,
  Upload,
  CheckCircle2,
  Trash2,
  X,
  FileImage,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface LogoPickerProps {
  availableLogos: LogoWithSignedUrl[];
  selectedLogoId: string | null;
  onSelectLogo: (logoId: string | null, logo: LogoWithSignedUrl | null) => void;
  onLogosUpdated?: (logos: LogoWithSignedUrl[]) => void;
}

export function LogoPicker({
  availableLogos: initialLogos,
  selectedLogoId,
  onSelectLogo,
  onLogosUpdated,
}: LogoPickerProps) {
  const [logos, setLogos] = useState<LogoWithSignedUrl[]>(initialLogos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);
  const [customName, setCustomName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 3MB
    if (file.size > 3 * 1024 * 1024) {
      setUploadError("File size exceeds 3MB limit. Please upload a smaller image.");
      return;
    }

    setUploadError(null);
    setUploadFile(file);

    // Create object URL for instant preview
    const preview = URL.createObjectURL(file);
    setUploadPreviewUrl(preview);

    // Auto-fill name if empty
    if (!customName) {
      setCustomName(file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setUploadError("File size exceeds 3MB limit. Please upload a smaller image.");
      return;
    }

    setUploadError(null);
    setUploadFile(file);
    const preview = URL.createObjectURL(file);
    setUploadPreviewUrl(preview);

    if (!customName) {
      setCustomName(file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError("Please choose a logo file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("name", customName.trim());

      const res = await uploadStudentLogoAction(formData);

      if (!res.success || !res.logo) {
        setUploadError(res.error || "Failed to upload logo.");
        setIsUploading(false);
        return;
      }

      // Add newly uploaded logo to state
      const updated = [res.logo, ...logos];
      setLogos(updated);
      onLogosUpdated?.(updated);

      // Automatically select the newly uploaded logo
      onSelectLogo(res.logo.id, res.logo);

      // Reset and close modal
      setIsModalOpen(false);
      setUploadFile(null);
      setUploadPreviewUrl(null);
      setCustomName("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteCustomLogo = async (logoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to remove this custom logo?")) return;

    setDeletingId(logoId);
    try {
      const res = await deleteStudentLogoAction(logoId);
      if (res.success) {
        const filtered = logos.filter((l) => l.id !== logoId);
        setLogos(filtered);
        onLogosUpdated?.(filtered);

        // If active logo was deleted, fallback to default seal
        if (selectedLogoId === logoId) {
          onSelectLogo(null, null);
        }
      } else {
        alert(res.error || "Failed to delete logo.");
      }
    } catch (err) {
      console.error("Delete logo error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="academic-card p-6 space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-crimson-brand" />
            <span>Institution Logo &amp; Insignia</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a verified system seal or upload your department emblem
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setUploadError(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-crimson-50 text-crimson-brand hover:bg-crimson-100 transition-colors border border-crimson-brand/20 shadow-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Custom</span>
        </button>
      </div>

      {/* Grid of Logos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Option 1: Default Academic Crest (No custom image) */}
        <button
          type="button"
          onClick={() => onSelectLogo(null, null)}
          className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all relative group ${
            selectedLogoId === null
              ? "border-crimson-brand bg-crimson-50/50 ring-2 ring-crimson-brand/20 shadow-sm"
              : "border-slate-200 bg-white hover:bg-slate-50/80"
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-crimson-brand text-white flex items-center justify-center shrink-0 font-bold text-base shadow-xs">
            🏛
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-slate-900 truncate">Default Seal</p>
              {selectedLogoId === null && (
                <CheckCircle2 className="w-3.5 h-3.5 text-crimson-brand shrink-0" />
              )}
            </div>
            <p className="text-[10px] text-slate-500 truncate">Standard academic emblem</p>
          </div>
        </button>

        {/* Dynamic Logos from Supabase */}
        {logos.map((logo) => {
          const isSelected = selectedLogoId === logo.id;
          const isCustom = !logo.is_system;

          return (
            <button
              key={logo.id}
              type="button"
              onClick={() => onSelectLogo(logo.id, logo)}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all relative group ${
                isSelected
                  ? "border-crimson-brand bg-crimson-50/50 ring-2 ring-crimson-brand/20 shadow-sm"
                  : "border-slate-200 bg-white hover:bg-slate-50/80"
              }`}
            >
              {/* Thumbnail */}
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 p-1 overflow-hidden">
                {logo.signed_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={logo.signed_url}
                    alt={logo.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building className="w-5 h-5 text-slate-400" />
                )}
              </div>

              {/* Title & Metadata */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-900 truncate">{logo.name}</p>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-crimson-brand shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                      isCustom
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {isCustom ? "Custom" : "System Seal"}
                  </span>
                </div>
              </div>

              {/* Delete button for user's custom logos */}
              {isCustom && (
                <button
                  type="button"
                  title="Delete custom logo"
                  onClick={(e) => handleDeleteCustomLogo(logo.id, e)}
                  disabled={deletingId === logo.id}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all shrink-0"
                >
                  {deletingId === logo.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </button>
          );
        })}
      </div>

      {/* Upload Custom Logo Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-crimson-50 text-crimson-brand flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Upload Institution Logo</h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setUploadFile(null);
                  setUploadPreviewUrl(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>{uploadError}</div>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  uploadPreviewUrl
                    ? "border-crimson-brand/40 bg-crimson-50/20"
                    : "border-slate-200 hover:border-crimson-brand/40 hover:bg-slate-50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {uploadPreviewUrl ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 p-2 shadow-xs flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={uploadPreviewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-xs font-bold text-slate-800">{uploadFile?.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {((uploadFile?.size || 0) / 1024).toFixed(1)} KB &bull; Click or drop another
                      to replace
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                      <FileImage className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Click to upload or drag &amp; drop
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        High-res SVG, PNG, JPG, or WEBP (up to 3MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Logo / Institution Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Cambridge Crest or Dept. of Physics"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand"
                />
              </div>

              {/* Security & Print Guideline Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-crimson-brand shrink-0 mt-0.5" />
                <span>
                  Logos are stored privately in Supabase Storage and rendered at 300 DPI vector
                  quality in generated PDF cover pages.
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isUploading}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile || isUploading}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-crimson-brand text-white hover:bg-crimson-hover shadow-sm disabled:opacity-50 transition-all"
                >
                  {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isUploading ? "Uploading..." : "Save & Use Logo"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
