// Shared helpers for the resume generators.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import yaml from "js-yaml";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export function loadResume() {
  const raw = readFileSync(join(ROOT, "resume.yaml"), "utf8");
  return yaml.load(raw);
}

// Derived contact links from handles.
export function links(profile) {
  return {
    githubUrl: `https://github.com/${profile.github}`,
    githubLabel: `github.com/${profile.github}`,
    telegramUrl: `https://t.me/${profile.telegram}`,
    telegramLabel: `@${profile.telegram}`,
    linkedinUrl: `https://www.linkedin.com/in/${profile.linkedin}`,
    websiteUrl: `https://${profile.website}`,
  };
}

export function initials(name) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const htmlEscape = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

// **bold** → <b>bold</b>, with the surrounding text HTML-escaped.
export const mdToHtml = (s) =>
  htmlEscape(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

// **bold** → bold (plain text, markers stripped) — for LinkedIn.
export const mdToPlain = (s) => String(s).replaceAll("**", "");

export const dateRange = (a, b) => `${a} – ${b}`; // en dash, matches existing site
