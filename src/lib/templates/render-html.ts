/**
 * Escapes HTML characters to prevent XSS / HTML injection during template interpolation.
 * Required by design.md Section 7 security specifications.
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export type MarginStyle = "none" | "single" | "double" | "triple";
export type MarginThickness = "narrow" | "medium" | "bold";

export interface MarginOptions {
  enabled: boolean;
  style: MarginStyle;
  thickness: MarginThickness;
  color?: string;
}

export const DEFAULT_MARGIN_OPTIONS: MarginOptions = {
  enabled: true,
  style: "single",
  thickness: "narrow",
  color: "#800020",
};

interface RenderTemplateOptions {
  htmlTemplate: string;
  formData: Record<string, string>;
  logoUrl?: string | null;
  marginOptions?: MarginOptions;
}

/**
 * Builds CSS border rules for the institutional margin frame.
 */
function buildMarginFrameCss(options?: MarginOptions): string {
  if (!options || !options.enabled || options.style === "none") {
    return "";
  }

  const color = options.color || "#800020";
  let borderRule = "";

  if (options.style === "single") {
    const width =
      options.thickness === "narrow"
        ? "1.5px"
        : options.thickness === "medium"
        ? "2.5px"
        : "4px";
    borderRule = `border: ${width} solid ${color};`;
  } else if (options.style === "double") {
    const width =
      options.thickness === "narrow"
        ? "4px"
        : options.thickness === "medium"
        ? "6px"
        : "8px";
    borderRule = `border: ${width} double ${color};`;
  } else if (options.style === "triple") {
    if (options.thickness === "narrow") {
      borderRule = `border: 2.5px solid ${color}; outline: 1px solid ${color}; outline-offset: -4px;`;
    } else if (options.thickness === "medium") {
      borderRule = `border: 3.5px solid ${color}; outline: 1.5px solid ${color}; outline-offset: -6px;`;
    } else {
      borderRule = `border: 5px solid ${color}; outline: 2.5px solid ${color}; outline-offset: -8px;`;
    }
  }

  return `
    <style id="academic-margin-frame-style">
      @page {
        margin: 15mm 15mm 15mm 15mm !important;
      }
      .academic-margin-frame {
        position: fixed;
        top: 10mm;
        left: 10mm;
        right: 10mm;
        bottom: 10mm;
        pointer-events: none;
        z-index: 99999;
        box-sizing: border-box;
        ${borderRule}
      }
    </style>
    <div class="academic-margin-frame" aria-hidden="true"></div>
  `;
}

/**
 * Generates dynamic font scaling and word-wrapping CSS to prevent overflow or truncation
 * on long institution names, assignment titles, and multi-faculty rosters.
 */
function buildLayoutSafetyCss(formData: Record<string, string>): string {
  const instLength = (formData.institutionName || "").length;
  const titleLength = (formData.assignmentTitle || "").length;

  let instFontSize = "18pt";
  if (instLength > 75) {
    instFontSize = "12.5pt";
  } else if (instLength > 55) {
    instFontSize = "14.5pt";
  } else if (instLength > 40) {
    instFontSize = "16pt";
  }

  let titleFontSize = "20pt";
  if (titleLength > 110) {
    titleFontSize = "14pt";
  } else if (titleLength > 80) {
    titleFontSize = "16pt";
  } else if (titleLength > 55) {
    titleFontSize = "18pt";
  }

  return `
    <style id="academic-layout-safety-style">
      /* Universal text-wrap and word-break rules */
      body, .inst, .dept, .title, .subtitle, .course-box, .grid, .col, .val, .meta, table, td, h1, h2, h3 {
        overflow-wrap: break-word !important;
        word-break: break-word !important;
        hyphens: auto !important;
      }
      .inst {
        font-size: ${instFontSize} !important;
        max-width: 100% !important;
        line-height: 1.25 !important;
      }
      .title {
        font-size: ${titleFontSize} !important;
        max-width: 100% !important;
        line-height: 1.3 !important;
      }
      /* Prevent multiple faculty members from overlapping */
      .faculty-item, .faculty-entry {
        display: block;
        page-break-inside: avoid;
        margin-bottom: 6px;
      }
      .grid {
        align-items: flex-start !important;
      }
    </style>
  `;
}

/**
 * Renders an institutional HTML template with validated, sanitized form data and optional margin borders.
 * Supports:
 * - Simple variable interpolation: {{variableName}}
 * - Conditional presence blocks: {{#variableName}}content{{/variableName}}
 * - Logo markup injection: {{logoHtml}}
 * - Multi-faculty roster injection: {{facultyHtml}}
 * - Dynamic font scaling & word wrapping safety
 * - Institutional margin framing
 */
export function renderTemplateHtml({
  htmlTemplate,
  formData,
  logoUrl,
  marginOptions = DEFAULT_MARGIN_OPTIONS,
}: RenderTemplateOptions): string {
  let output = htmlTemplate;

  // 1. Handle logo HTML insertion
  const logoMarkup = logoUrl
    ? `<img src="${escapeHtml(
        logoUrl
      )}" alt="Institution Logo" class="logo" style="max-height:85px; max-width:180px; object-fit:contain; margin:0 auto 12px; display:block;" />`
    : `<div class="logo" style="width:50px; height:50px; background:#800020; border-radius:12px; margin:0 auto 12px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:bold; font-size:24px;">🏛</div>`;

  output = output.replace(/\{\{logoHtml\}\}/g, logoMarkup);

  // 2. Handle facultyHtml injection if template supports it
  if (formData.facultyHtml) {
    output = output.replace(/\{\{facultyHtml\}\}/g, formData.facultyHtml);
  }

  // 3. Process conditional blocks: {{#key}}content{{/key}}
  output = output.replace(
    /\{\{#([a-zA-Z0-9_]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
    (_, key: string, innerContent: string) => {
      const val = formData[key];
      if (val && val.trim().length > 0) {
        return innerContent.replace(
          new RegExp(`\\{\\{${key}\\}\\}`, "g"),
          escapeHtml(val)
        );
      }
      return "";
    }
  );

  // 4. Process remaining regular variable substitutions: {{key}}
  output = output.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key: string) => {
    const val = formData[key];
    return val ? escapeHtml(val) : "";
  });

  // 5. Inject Layout Safety CSS (Dynamic Font Scaling & Word Wrapping)
  const safetyCss = buildLayoutSafetyCss(formData);
  if (output.includes("</head>")) {
    output = output.replace("</head>", `${safetyCss}</head>`);
  } else {
    output = `${safetyCss}${output}`;
  }

  // 6. Inject institutional margin border if enabled
  const marginHtml = buildMarginFrameCss(marginOptions);
  if (marginHtml) {
    if (output.includes("</body>")) {
      output = output.replace("</body>", `${marginHtml}</body>`);
    } else {
      output += marginHtml;
    }
  }

  return output;
}
