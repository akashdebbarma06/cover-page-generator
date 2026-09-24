import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Read .env.local
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

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

// Define 4 institutional SVG crests
const logos = [
  {
    id: "aaaaaaaa-0000-0000-0000-000000000001",
    name: "Classic Academic Crest",
    filename: "system/classic-academic-crest.svg",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="crestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#800020" />
      <stop offset="100%" stop-color="#4a0012" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <!-- Outer Shield -->
  <path d="M100 18 C150 18 175 35 175 90 C175 140 135 172 100 188 C65 172 25 140 25 90 C25 35 50 18 100 18 Z" fill="url(#crestGrad)" stroke="url(#goldGrad)" stroke-width="4" />
  <!-- Inner Shield Inset -->
  <path d="M100 28 C142 28 163 42 163 90 C163 133 130 161 100 175 C70 161 37 133 37 90 C37 42 58 28 100 28 Z" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.6" />
  <!-- Open Book of Wisdom -->
  <path d="M60 85 C75 80 92 82 100 88 C108 82 125 80 140 85 L140 125 C125 120 108 122 100 128 C92 122 75 120 60 125 Z" fill="#ffffff" />
  <path d="M100 88 L100 128" stroke="#800020" stroke-width="2" />
  <path d="M68 95 L92 92 M68 103 L92 100 M68 111 L92 108" stroke="#800020" stroke-width="1.5" stroke-linecap="round" opacity="0.7" />
  <path d="M108 92 L132 95 M108 100 L132 103 M108 108 L132 111" stroke="#800020" stroke-width="1.5" stroke-linecap="round" opacity="0.7" />
  <!-- Laurel / Wreath Leaves Top -->
  <polygon points="100,42 103,50 111,51 105,57 107,65 100,61 93,65 95,57 89,51 97,50" fill="url(#goldGrad)" />
  <!-- Academic Ribbon -->
  <path d="M45 155 Q100 170 155 155 L150 165 Q100 180 50 165 Z" fill="url(#goldGrad)" />
</svg>`
  },
  {
    id: "aaaaaaaa-0000-0000-0000-000000000002",
    name: "Institute of Technology Seal",
    filename: "system/tech-institute-seal.svg",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="techBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="cyanAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
  </defs>
  <!-- Circular Base -->
  <circle cx="100" cy="100" r="88" fill="url(#techBlue)" stroke="#0ea5e9" stroke-width="4" />
  <circle cx="100" cy="100" r="78" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.4" stroke-dasharray="4,4" />
  <!-- Inner Ring with Gear teeth or compass marks -->
  <circle cx="100" cy="100" r="62" fill="#1e293b" stroke="url(#cyanAccent)" stroke-width="2" />
  <!-- Technical Atom Orbits & Core -->
  <ellipse cx="100" cy="100" rx="42" ry="16" fill="none" stroke="#38bdf8" stroke-width="2" transform="rotate(30 100 100)" />
  <ellipse cx="100" cy="100" rx="42" ry="16" fill="none" stroke="#38bdf8" stroke-width="2" transform="rotate(-30 100 100)" />
  <ellipse cx="100" cy="100" rx="42" ry="16" fill="none" stroke="#38bdf8" stroke-width="2" transform="rotate(90 100 100)" />
  <!-- Central Nucleus -->
  <circle cx="100" cy="100" r="10" fill="#f8fafc" stroke="#0ea5e9" stroke-width="3" />
  <!-- Stars -->
  <polygon points="100,22 102,27 107,27 103,30 105,35 100,32 95,35 97,30 93,27 98,27" fill="#38bdf8" />
</svg>`
  },
  {
    id: "aaaaaaaa-0000-0000-0000-000000000003",
    name: "National Science & Research Emblem",
    filename: "system/science-research-emblem.svg",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
  </defs>
  <!-- Hexagonal Boundary -->
  <polygon points="100,15 178,58 178,142 100,185 22,142 22,58" fill="url(#emeraldGrad)" stroke="#10b981" stroke-width="4" stroke-linejoin="round" />
  <polygon points="100,25 168,63 168,137 100,175 32,137 32,63" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.5" stroke-linejoin="round" />
  <!-- Laboratory Flask & Laurel of Discovery -->
  <path d="M93 50 L107 50 L107 75 L125 115 C130 126 122 138 110 138 L90 138 C78 138 70 126 75 115 L93 75 Z" fill="#ffffff" opacity="0.95" />
  <path d="M78 118 Q100 125 122 118 L114 134 C112 136 108 138 104 138 L96 138 C92 138 88 136 86 134 Z" fill="#10b981" />
  <!-- Sparkles -->
  <circle cx="100" cy="98" r="3" fill="#047857" />
  <circle cx="95" cy="108" r="4" fill="#047857" />
  <circle cx="106" cy="105" r="2.5" fill="#047857" />
  <circle cx="100" cy="120" r="4" fill="#ffffff" />
</svg>`
  },
  {
    id: "aaaaaaaa-0000-0000-0000-000000000004",
    name: "Classical University Shield",
    filename: "system/classical-university-shield.svg",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="crimsonGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#800020" />
      <stop offset="100%" stop-color="#991b1b" />
    </linearGradient>
  </defs>
  <!-- Classic Oxford-Style Shield -->
  <path d="M30 30 L170 30 L170 105 C170 150 100 185 100 185 C100 185 30 150 30 105 Z" fill="url(#crimsonGold)" stroke="#d97706" stroke-width="4" stroke-linejoin="round" />
  <!-- Quartered Inset Lines -->
  <path d="M100 30 L100 185" stroke="#ffffff" stroke-width="2" opacity="0.4" />
  <path d="M30 95 L170 95" stroke="#ffffff" stroke-width="2" opacity="0.4" />
  <!-- Columns / Pillars Symbol -->
  <rect x="52" y="50" width="6" height="35" fill="#fde68a" />
  <rect x="68" y="50" width="6" height="35" fill="#fde68a" />
  <rect x="48" y="45" width="30" height="5" fill="#fde68a" />
  <rect x="48" y="85" width="30" height="5" fill="#fde68a" />
  <!-- Torch of Wisdom in top right -->
  <path d="M135 75 L145 75 L142 85 L138 85 Z" fill="#fde68a" />
  <path d="M140 50 Q148 60 140 70 Q132 60 140 50 Z" fill="#fbbf24" />
  <!-- Open Scroll bottom -->
  <path d="M70 125 C85 120 115 120 130 125 L130 145 C115 140 85 140 70 145 Z" fill="#ffffff" />
</svg>`
  }
];

async function seed() {
  console.log("Starting System Logo seeding...");

  for (const logo of logos) {
    console.log(`Uploading ${logo.name} (${logo.filename})...`);
    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(logo.filename, Buffer.from(logo.svg, "utf-8"), {
        contentType: "image/svg+xml",
        upsert: true,
      });

    if (uploadError) {
      console.error(`Failed to upload ${logo.filename}:`, uploadError);
      continue;
    }

    console.log(`Inserting logo record in 'logos' table...`);
    const { error: dbError } = await supabase
      .from("logos")
      .upsert({
        id: logo.id,
        user_id: null,
        name: logo.name,
        storage_path: logo.filename,
        is_system: true,
      });

    if (dbError) {
      console.error(`Failed to insert logo ${logo.name}:`, dbError);
    } else {
      console.log(`Successfully seeded ${logo.name}!`);
    }
  }

  // Also check signed URL generation
  const { data: testSigned } = await supabase.storage
    .from("logos")
    .createSignedUrl(logos[0].filename, 3600);

  console.log("Verification Signed URL for", logos[0].name, ":", testSigned?.signedUrl ? "GENERATED OK" : "FAILED");
  console.log("Logo seeding complete!");
}

seed().catch(console.error);
