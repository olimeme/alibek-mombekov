// Validate resume.yaml before building. Exits non-zero on any problem.
import { loadResume } from "./lib.mjs";

const errors = [];
let data;
try {
  data = loadResume();
} catch (e) {
  console.error("✗ resume.yaml is not valid YAML:\n  " + e.message);
  process.exit(1);
}

const req = (obj, path, keys) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) {
      errors.push(`${path}.${k} is missing or empty`);
    }
  }
};

req(data, "root", ["profile", "experience", "education", "skills", "projects", "certificates"]);
if (data.profile)
  req(data.profile, "profile", ["name", "headline", "location", "email", "github"]);

(data.experience || []).forEach((j, i) => {
  req(j, `experience[${i}]`, ["company", "role", "location", "start", "end"]);
  if (!Array.isArray(j.bullets) || j.bullets.length === 0)
    errors.push(`experience[${i}].bullets must have at least one item`);
  // Bold markers must be balanced (even count of **).
  for (const b of j.bullets || [])
    if ((b.match(/\*\*/g) || []).length % 2 !== 0)
      errors.push(`experience[${i}] bullet has unbalanced ** markers: "${b.slice(0, 40)}…"`);
});

(data.education || []).forEach((e, i) =>
  req(e, `education[${i}]`, ["institution", "location", "degree", "start", "end"]),
);
(data.skills || []).forEach((g, i) => {
  req(g, `skills[${i}]`, ["category"]);
  if (!Array.isArray(g.items) || g.items.length === 0)
    errors.push(`skills[${i}].items must have at least one item`);
});
(data.projects || []).forEach((p, i) => req(p, `projects[${i}]`, ["name", "url", "desc"]));
(data.certificates || []).forEach((c, i) => req(c, `certificates[${i}]`, ["name", "issuer"]));

if (errors.length) {
  console.error("✗ resume.yaml has " + errors.length + " problem(s):");
  for (const e of errors) console.error("  • " + e);
  process.exit(1);
}
console.log("✓ resume.yaml is valid");
