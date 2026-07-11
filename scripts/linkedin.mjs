// Generate copy-paste-ready LinkedIn blocks from resume.yaml.
// LinkedIn has no write API for personal profiles, so this is the manual step —
// run `npm run linkedin`, then paste each block into the matching LinkedIn field.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, loadResume, links, mdToPlain, dateRange } from "./lib.mjs";

const data = loadResume();
const p = data.profile;
const L = links(p);

const line = "─".repeat(64);
const out = [];
const push = (s = "") => out.push(s);

push(line);
push("  LinkedIn update sheet — paste each block into the matching field");
push(line);
push();

// ── Headline ──
push("▸ HEADLINE (top of profile)");
push(`${p.headline} @ ${data.experience[0].company}`);
push();

// ── About ──
push("▸ ABOUT / SUMMARY");
push(
  `${p.headline} based in ${p.location}. Currently ${data.experience[0].role} at ` +
    `${data.experience[0].company}, building real-time data pipelines and services at scale.`,
);
push();
push("Recent impact:");
for (const b of data.experience[0].bullets) push(`• ${mdToPlain(b)}`);
push();

// ── Experience ──
push("▸ EXPERIENCE (one entry per role)");
push();
for (const j of data.experience) {
  push(`  ── ${j.company} · ${j.role} ──`);
  push(`  Title:    ${j.role}`);
  push(`  Company:  ${j.company}`);
  push(`  Dates:    ${dateRange(j.start, j.end)}`);
  push(`  Location: ${j.location}`);
  push(`  Description:`);
  for (const b of j.bullets) push(`  • ${mdToPlain(b)}`);
  push();
}

// ── Education ──
push("▸ EDUCATION");
push();
for (const e of data.education) {
  push(`  ${e.institution} — ${e.degree}`);
  push(`  ${dateRange(e.start, e.end)} · ${e.location}${e.gpa ? ` · GPA ${e.gpa}` : ""}`);
  push();
}

// ── Skills ──
push("▸ SKILLS (add these in the Skills section)");
push(data.skills.flatMap((g) => g.items).join(", "));
push();

// ── Projects ──
push("▸ PROJECTS (Featured / Projects section)");
push();
for (const pr of data.projects) {
  push(`  ${pr.name} — ${pr.url}`);
  push(`  ${pr.desc}`);
  push();
}

// ── Licenses & Certifications ──
push("▸ LICENSES & CERTIFICATIONS");
push();
for (const c of data.certificates) push(`  ${c.name} — ${c.issuer}`);
push();

// ── Contact ──
push("▸ CONTACT INFO");
push(`  Email:    ${p.email}`);
push(`  Website:  ${L.websiteUrl}`);
push(`  GitHub:   ${L.githubUrl}`);
push();

push(line);
push("  Checklist — update on linkedin.com/in/" + p.linkedin + " :");
push("   [ ] Headline    [ ] About    [ ] Experience (3 roles)");
push("   [ ] Education   [ ] Skills   [ ] Projects   [ ] Certifications");
push(line);

const text = out.join("\n");
console.log(text);
writeFileSync(join(ROOT, "dist", "linkedin.txt"), text);
