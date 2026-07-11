// Generate dist/index.html from resume.yaml + templates/site.html.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  ROOT,
  loadResume,
  links,
  initials,
  htmlEscape,
  mdToHtml,
  dateRange,
} from "./lib.mjs";

const data = loadResume();
const p = data.profile;
const L = links(p);

// Reusable SVG icons (kept identical to the original hand-written markup).
const ICON_PIN = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>`;
const ICON_CLOCK = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const ICON_SUN = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const ICON_BRIEFCASE = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8L6 7h12z"/></svg>`;

const openToWorkChip = p.open_to_work
  ? `
    <span class="chip">
      ${ICON_BRIEFCASE}
      Open to work
    </span>`
  : "";

const current = data.experience[0];

const header = `
  <div class="topbar">
    <button class="theme-btn" onclick="toggleTheme()" aria-label="Toggle theme" id="theme-btn">
      ${ICON_SUN}
      <span id="theme-label">Dark</span>
    </button>
  </div>

  <div class="avatar">${initials(p.name)}</div>
  <h1>${htmlEscape(p.name)}</h1>
  <p class="subtitle">${htmlEscape(p.headline)} · ${htmlEscape(p.location)}</p>

  <div class="meta-row">
    <span class="chip">
      ${ICON_PIN}
      ${htmlEscape(p.location_short)}
    </span>${openToWorkChip}
    <span class="chip">
      ${ICON_CLOCK}
      ${htmlEscape(dateRange(current.start, current.end))} @ ${htmlEscape(current.company)}
    </span>
  </div>

  <div class="contact-line">
    <a href="mailto:${p.email}" class="contact-link">${htmlEscape(p.email)}</a>
    <span class="sep">·</span>
    <a href="${L.githubUrl}" class="contact-link" target="_blank">${htmlEscape(L.githubLabel)}</a>
    <span class="sep">·</span>
    <a href="${L.telegramUrl}" class="contact-link" target="_blank">tg: ${htmlEscape(L.telegramLabel)}</a>
  </div>`;

const experience = `
  <div class="section">
    <p class="section-title">Experience</p>
${data.experience
  .map(
    (j) => `
    <div class="exp-row">
      <div>
        <div class="exp-company">${htmlEscape(j.company)}</div>
        <div class="exp-date">${htmlEscape(dateRange(j.start, j.end))}</div>
        <div class="exp-location">${htmlEscape(j.location)}</div>
      </div>
      <div>
        <div class="exp-role">${htmlEscape(j.role)}</div>
        <ul class="exp-bullets">
${j.bullets.map((b) => `          <li>${mdToHtml(b)}</li>`).join("\n")}
        </ul>
      </div>
    </div>`,
  )
  .join("\n")}
  </div>`;

const education = `
  <div class="section">
    <p class="section-title">Education</p>
${data.education
  .map(
    (e) => `
    <div class="edu-row">
      <div class="edu-date">${htmlEscape(dateRange(e.start, e.end))}</div>
      <div>
        <div class="edu-degree">${htmlEscape(e.degree)}</div>
        <div class="edu-school">${htmlEscape(e.institution)} · ${htmlEscape(e.location)}</div>
      </div>
    </div>`,
  )
  .join("\n")}
  </div>`;

const skills = `
  <div class="section">
    <p class="section-title">Skills</p>
${data.skills
  .map(
    (g) => `
    <div class="skill-group">
      <div class="skill-group-label">${htmlEscape(g.category)}</div>
      <div class="tags">
        ${g.items.map((t) => `<span class="tag">${htmlEscape(t)}</span>`).join("")}
      </div>
    </div>`,
  )
  .join("")}
  </div>`;

const projects = `
  <div class="section">
    <p class="section-title">Projects</p>
${data.projects
  .map(
    (pr) => `
    <a class="project-row" href="${pr.url}" target="_blank">
      <div>
        <div class="project-name">${htmlEscape(pr.name)}</div>
        <div class="project-desc">${htmlEscape(pr.desc)}</div>
      </div>
      <span class="project-arrow">↗</span>
    </a>`,
  )
  .join("\n")}
  </div>`;

const certificates = `
  <div class="section">
    <p class="section-title">Certificates &amp; Achievements</p>
    <ul class="cert-list">
${data.certificates
  .map((c) => `      <li>${htmlEscape(c.name)} — ${htmlEscape(c.issuer)}</li>`)
  .join("\n")}
    </ul>
  </div>`;

const footer = `
  <div class="footer">
    <span class="footer-left">${htmlEscape(p.name)} · ${new Date().getFullYear()}</span>
    <div class="footer-links">
      <a href="mailto:${p.email}">Email</a>
      <a href="${L.githubUrl}" target="_blank">GitHub</a>
    </div>
  </div>`;

const body = [
  header,
  "\n  <hr />\n",
  experience,
  "\n  <hr />\n",
  education,
  "\n  <hr />\n",
  skills,
  "\n  <hr />\n",
  projects,
  "\n  <hr />\n",
  certificates,
  "\n  <hr />\n",
  footer,
].join("\n");

const template = readFileSync(join(ROOT, "templates", "site.html"), "utf8");
const html = template
  .replace("__NAME__", htmlEscape(p.name))
  .replace("__BODY__", body);

mkdirSync(join(ROOT, "dist"), { recursive: true });
writeFileSync(join(ROOT, "dist", "index.html"), html);
console.log("✓ dist/index.html written");
