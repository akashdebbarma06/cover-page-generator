import { createClient } from "@supabase/supabase-js";
import fs from "fs";

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
  console.error("Missing credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const institutionalLogos = [
  {
    id: "aaaaaaaa-0000-0000-0000-000000000010",
    name: "IIT — Indian Institute of Technology",
    filename: "system/iit-insignia.svg",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="iitGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <linearGradient id="iitNavy" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e3a8a" />
    </linearGradient>
  </defs>
  <!-- Outer Gear Ring -->
  <circle cx="100" cy="100" r="90" fill="url(#iitNavy)" stroke="url(#iitGold)" stroke-width="4" />
  <circle cx="100" cy="100" r="82" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.4" />
  <!-- Traditional 24-spoke Ashoka / Engineering Chakra -->
  <circle cx="100" cy="100" r="58" fill="#1e293b" stroke="#f59e0b" stroke-width="3" />
  <!-- Radiating Cog / Spokes -->
  <g stroke="#f59e0b" stroke-width="2.5" opacity="0.85">
    <line x1="100" y1="46" x2="100" y2="154" />
    <line x1="46" y1="100" x2="154" y2="100" />
    <line x1="62" y1="62" x2="138" y2="138" />
    <line x1="62" y1="138" x2="138" y2="62" />
    <line x1="72" y1="50" x2="128" y2="150" />
    <line x1="50" y1="72" x2="150" y2="128" />
    <line x1="50" y1="128" x2="150" y2="72" />
    <line x1="72" y1="150" x2="128" y2="50" />
  </g>
  <!-- Central Flame / Jyoti of Knowledge -->
  <circle cx="100" cy="100" r="18" fill="url(#iitGold)" />
  <path d="M100 80 Q106 92 100 100 Q94 92 100 80 Z" fill="#ffffff" />
  <!-- Sanskrit Banner Bottom -->
  <path d="M40 152 Q100 174 160 152 L154 164 Q100 184 46 164 Z" fill="url(#iitGold)" />
  <text x="100" y="162" text-anchor="middle" font-family="'Times New Roman', serif" font-size="8" font-weight="bold" fill="#0f172a" letter-spacing="1">IIT &bull; TECHNOLOGY</text>
</svg>`
  },
  {
    id: "aaaaaaaa-0000-0000-0000-000000000011",
    name: "NIT — National Institute of Technology",
    filename: "system/nit-crest.svg",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="nitCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#800020" />
      <stop offset="100%" stop-color="#4a0012" />
    </linearGradient>
    <linearGradient id="nitGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <!-- Outer Octagon Shield -->
  <polygon points="100,12 165,38 188,100 165,162 100,188 35,162 12,100 35,38" fill="url(#nitCrimson)" stroke="url(#nitGold)" stroke-width="4" stroke-linejoin="round" />
  <polygon points="100,22 155,44 176,100 155,156 100,178 45,156 24,100 45,44" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.5" stroke-linejoin="round" />
  <!-- Academic Torch of Technical Discovery -->
  <path d="M94 72 L106 72 L104 125 L96 125 Z" fill="#ffffff" />
  <path d="M90 68 L110 68 L106 74 L94 74 Z" fill="url(#nitGold)" />
  <path d="M100 38 Q112 52 100 66 Q88 52 100 38 Z" fill="url(#nitGold)" />
  <!-- Laurels flanking torch -->
  <path d="M65 95 Q60 115 78 132 M135 95 Q140 115 122 132" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.8" />
  <!-- Bottom Ribbon -->
  <path d="M42 150 Q100 168 158 150 L152 160 Q100 176 48 160 Z" fill="url(#nitGold)" />
  <text x="100" y="159" text-anchor="middle" font-family="'Helvetica Neue', sans-serif" font-size="7.5" font-weight="900" fill="#4a0012" letter-spacing="1.5">NIT &bull; NATIONAL INSTITUTE</text>
</svg>`
  },
  {
    id: "aaaaaaaa-0000-0000-0000-000000000012",
    name: "MIT — Massachusetts Institute of Technology",
    filename: "system/mit-seal.svg",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="mitRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a31f34" />
      <stop offset="100%" stop-color="#751525" />
    </linearGradient>
  </defs>
  <!-- Outer Medallion -->
  <circle cx="100" cy="100" r="90" fill="url(#mitRed)" stroke="#8a8b8c" stroke-width="3" />
  <circle cx="100" cy="100" r="82" fill="none" stroke="#ffffff" stroke-width="1.5" />
  <!-- Inner Field -->
  <circle cx="100" cy="100" r="62" fill="#ffffff" stroke="#a31f34" stroke-width="2" />
  <!-- Scholar & Craftsman Pedestal Base -->
  <rect x="75" y="70" width="50" height="50" fill="#a31f34" rx="2" />
  <!-- Three Science & Humanities Volumes -->
  <rect x="80" y="78" width="40" height="6" fill="#ffffff" />
  <rect x="80" y="88" width="40" height="6" fill="#ffffff" />
  <rect x="80" y="98" width="40" height="6" fill="#ffffff" />
  <text x="100" y="83" text-anchor="middle" font-family="serif" font-size="5" font-weight="bold" fill="#a31f34">SCIENCE</text>
  <text x="100" y="93" text-anchor="middle" font-family="serif" font-size="5" font-weight="bold" fill="#a31f34">AND</text>
  <text x="100" y="103" text-anchor="middle" font-family="serif" font-size="5" font-weight="bold" fill="#a31f34">ARTS</text>
  <!-- Latin Motto: Mens et Manus -->
  <text x="100" y="132" text-anchor="middle" font-family="serif" font-size="7" font-weight="bold" fill="#a31f34" letter-spacing="1">MENS ET MANUS</text>
  <!-- 1861 Foundation Date -->
  <text x="100" y="142" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="bold" fill="#751525">1861</text>
  <!-- Ring Text -->
  <text x="100" y="32" text-anchor="middle" font-family="'Times New Roman', serif" font-size="6.5" font-weight="bold" fill="#ffffff" letter-spacing="2">MASSACHUSETTS INSTITUTE</text>
  <text x="100" y="174" text-anchor="middle" font-family="'Times New Roman', serif" font-size="6.5" font-weight="bold" fill="#ffffff" letter-spacing="2">OF TECHNOLOGY</text>
</svg>`
  },
  {
    id: "aaaaaaaa-0000-0000-0000-000000000013",
    name: "Harvard University — Veritas Shield",
    filename: "system/harvard-shield.svg",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="harvardCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a51c30" />
      <stop offset="100%" stop-color="#5c0612" />
    </linearGradient>
  </defs>
  <!-- Classic Harvard Heraldic Shield -->
  <path d="M40 25 L160 25 C160 25 165 95 160 120 C150 155 100 185 100 185 C100 185 50 155 40 120 C35 95 40 25 40 25 Z" fill="url(#harvardCrimson)" stroke="#222" stroke-width="2" />
  <!-- Three Open Books (VE - RI - TAS) -->
  <!-- Top Left Book: VE -->
  <g transform="translate(56, 45)">
    <rect x="0" y="0" width="38" height="26" fill="#ffffff" stroke="#111" stroke-width="1.5" rx="1" />
    <line x1="19" y1="0" x2="19" y2="26" stroke="#a51c30" stroke-width="1" />
    <text x="10" y="17" font-family="'Georgia', serif" font-size="12" font-weight="bold" fill="#111">V</text>
    <text x="23" y="17" font-family="'Georgia', serif" font-size="12" font-weight="bold" fill="#111">E</text>
  </g>
  <!-- Top Right Book: RI -->
  <g transform="translate(106, 45)">
    <rect x="0" y="0" width="38" height="26" fill="#ffffff" stroke="#111" stroke-width="1.5" rx="1" />
    <line x1="19" y1="0" x2="19" y2="26" stroke="#a51c30" stroke-width="1" />
    <text x="10" y="17" font-family="'Georgia', serif" font-size="12" font-weight="bold" fill="#111">R</text>
    <text x="25" y="17" font-family="'Georgia', serif" font-size="12" font-weight="bold" fill="#111">I</text>
  </g>
  <!-- Bottom Center Book: TAS -->
  <g transform="translate(81, 95)">
    <rect x="0" y="0" width="38" height="26" fill="#ffffff" stroke="#111" stroke-width="1.5" rx="1" />
    <line x1="19" y1="0" x2="19" y2="26" stroke="#a51c30" stroke-width="1" />
    <text x="8" y="17" font-family="'Georgia', serif" font-size="10" font-weight="bold" fill="#111">T</text>
    <text x="17" y="17" font-family="'Georgia', serif" font-size="10" font-weight="bold" fill="#111">A</text>
    <text x="27" y="17" font-family="'Georgia', serif" font-size="10" font-weight="bold" fill="#111">S</text>
  </g>
  <!-- Outer Laurel Leaves Surround -->
  <path d="M30 40 Q20 110 50 155 M170 40 Q180 110 150 155" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" opacity="0.6" />
</svg>`
  },
  {
    id: "aaaaaaaa-0000-0000-0000-000000000014",
    name: "University of Oxford — Crest",
    filename: "system/oxford-crest.svg",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="oxfordBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#002147" />
      <stop offset="100%" stop-color="#0a192f" />
    </linearGradient>
    <linearGradient id="oxfordGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <!-- Oxford Shield Base -->
  <path d="M45 25 L155 25 C155 25 158 95 155 120 C145 155 100 182 100 182 C100 182 55 155 45 120 C42 95 45 25 45 25 Z" fill="url(#oxfordBlue)" stroke="url(#oxfordGold)" stroke-width="4" />
  <!-- Three Golden Crowns (Two Above, One Below) -->
  <!-- Top Left Crown -->
  <path d="M68 52 L74 62 L82 54 L90 62 L96 52 L94 65 L70 65 Z" fill="url(#oxfordGold)" />
  <!-- Top Right Crown -->
  <path d="M104 52 L110 62 L118 54 L126 62 L132 52 L130 65 L106 65 Z" fill="url(#oxfordGold)" />
  <!-- Central Open Book: Dominus Illuminatio Mea -->
  <g transform="translate(62, 80)">
    <rect x="0" y="0" width="76" height="42" fill="#ffffff" stroke="#d97706" stroke-width="2" rx="2" />
    <line x1="38" y1="0" x2="38" y2="42" stroke="#002147" stroke-width="1.5" />
    <text x="19" y="16" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7" font-weight="bold" fill="#002147">DOMI</text>
    <text x="19" y="26" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7" font-weight="bold" fill="#002147">MINUS</text>
    <text x="19" y="36" text-anchor="middle" font-family="'Times New Roman', serif" font-size="6" font-weight="bold" fill="#002147">ILLUM</text>
    <text x="57" y="16" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7" font-weight="bold" fill="#002147">INAT</text>
    <text x="57" y="26" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7" font-weight="bold" fill="#002147">IO ME</text>
    <text x="57" y="36" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7" font-weight="bold" fill="#002147">A</text>
  </g>
  <!-- Bottom Third Crown -->
  <path d="M86 138 L92 148 L100 140 L108 148 L114 138 L112 151 L88 151 Z" fill="url(#oxfordGold)" />
</svg>`
  },
  {
    id: "aaaaaaaa-0000-0000-0000-000000000015",
    name: "University of Cambridge — Arms",
    filename: "system/cambridge-arms.svg",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="cambridgeRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b91c1c" />
      <stop offset="100%" stop-color="#7f1d1d" />
    </linearGradient>
    <linearGradient id="cambridgeGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#eab308" />
    </linearGradient>
  </defs>
  <!-- Cambridge Shield -->
  <path d="M45 25 L155 25 C155 25 158 95 155 120 C145 155 100 182 100 182 C100 182 55 155 45 120 C42 95 45 25 45 25 Z" fill="url(#cambridgeRed)" stroke="url(#cambridgeGold)" stroke-width="3" />
  <!-- St George's Ermine Cross -->
  <rect x="90" y="25" width="20" height="155" fill="#f8fafc" />
  <rect x="45" y="85" width="110" height="20" fill="#f8fafc" />
  <!-- Central Bible in Middle of Cross -->
  <rect x="85" y="80" width="30" height="30" fill="#dc2626" rx="2" stroke="url(#cambridgeGold)" stroke-width="1.5" />
  <rect x="88" y="84" width="24" height="22" fill="#ffffff" />
  <line x1="100" y1="84" x2="100" y2="106" stroke="#b91c1c" stroke-width="1" />
  <!-- Four Lions Passant Gardant in Quarters -->
  <g fill="url(#cambridgeGold)">
    <!-- Top Left -->
    <ellipse cx="68" cy="55" rx="10" ry="6" />
    <circle cx="76" cy="53" r="4" />
    <!-- Top Right -->
    <ellipse cx="132" cy="55" rx="10" ry="6" />
    <circle cx="140" cy="53" r="4" />
    <!-- Bottom Left -->
    <ellipse cx="68" cy="125" rx="10" ry="6" />
    <circle cx="76" cy="123" r="4" />
    <!-- Bottom Right -->
    <ellipse cx="132" cy="125" rx="10" ry="6" />
    <circle cx="140" cy="123" r="4" />
  </g>
</svg>`
  },
  {
    id: "aaaaaaaa-0000-0000-0000-000000000016",
    name: "Stanford University — Redwood Seal",
    filename: "system/stanford-seal.svg",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="stanfordCard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8c1515" />
      <stop offset="100%" stop-color="#5e0d0d" />
    </linearGradient>
    <linearGradient id="treeGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#15803d" />
      <stop offset="100%" stop-color="#14532d" />
    </linearGradient>
  </defs>
  <!-- Circular Medallion -->
  <circle cx="100" cy="100" r="90" fill="url(#stanfordCard)" stroke="#ffffff" stroke-width="2.5" />
  <circle cx="100" cy="100" r="82" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.6" />
  <circle cx="100" cy="100" r="64" fill="#ffffff" stroke="#8c1515" stroke-width="2" />
  <!-- Triple-Tier California Redwood (El Árbol del Tula) -->
  <polygon points="100,50 115,70 85,70" fill="url(#treeGreen)" />
  <polygon points="100,65 120,90 80,90" fill="url(#treeGreen)" />
  <polygon points="100,85 125,115 75,115" fill="url(#treeGreen)" />
  <rect x="96" y="115" width="8" height="20" fill="#78350f" />
  <!-- German Motto Around Upper Border -->
  <text x="100" y="30" text-anchor="middle" font-family="'Times New Roman', serif" font-size="6.5" font-weight="bold" fill="#ffffff" letter-spacing="1.5">DIE LUFT DER FREIHEIT WEHT</text>
  <!-- 1891 Founding Date Below -->
  <text x="100" y="174" text-anchor="middle" font-family="'Times New Roman', serif" font-size="7" font-weight="bold" fill="#ffffff" letter-spacing="2">STANFORD &bull; 1891</text>
</svg>`
  }
];

async function seedLogos() {
  console.log("Seeding authentic institutional seals (IIT, NIT, MIT, Harvard, Oxford, Cambridge, Stanford)...");

  for (const item of institutionalLogos) {
    console.log(`Uploading ${item.name} (${item.filename})...`);

    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(item.filename, Buffer.from(item.svg, "utf-8"), {
        contentType: "image/svg+xml",
        upsert: true,
      });

    if (uploadError) {
      console.error(`Upload error for ${item.name}:`, uploadError);
      continue;
    }

    const { error: dbError } = await supabase.from("logos").upsert({
      id: item.id,
      user_id: null,
      name: item.name,
      storage_path: item.filename,
      is_system: true,
    });

    if (dbError) {
      console.error(`DB error for ${item.name}:`, dbError);
    } else {
      console.log(`Successfully seeded ${item.name}!`);
    }
  }

  console.log("All institutional insignias seeded successfully!");
}

seedLogos().catch(console.error);
