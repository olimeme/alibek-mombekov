// Data-driven résumé. Content comes from resume.yaml — do not edit copy here.
// Compile from the repo root:  typst compile --root . resume/resume.typ resume/resume.pdf
// (CI does this automatically.) The --root flag lets typst read /resume.yaml.
#import "@preview/basic-resume:0.2.9": *

#let data = yaml("/resume.yaml")
#let p = data.profile

// Render **bold** markers inside a plain string as strong (bold) text.
#let md(s) = {
  for (i, part) in s.split("**").enumerate() {
    if calc.odd(i) { strong(part) } else { part }
  }
}

#show: resume.with(
  author: p.name,
  location: p.location,
  email: p.email,
  github: "github.com/" + p.github,
  phone: p.phone,
  // To surface these on the PDF too, uncomment and the info row will pick them up:
  // linkedin: "linkedin.com/in/" + p.linkedin,
  // personal-site: p.website,
  accent-color: p.accent_color,
  font: "New Computer Modern",
  paper: "us-letter",
  author-position: left,
  personal-info-position: left,
)

== Work Experience

#for job in data.experience {
  work(
    title: job.role,
    location: job.location,
    company: job.company,
    dates: dates-helper(start-date: job.start, end-date: job.end),
  )
  list(..job.bullets.map(b => md(b)))
}

== Education

#for e in data.education {
  edu(
    institution: e.institution,
    location: e.location,
    dates: dates-helper(start-date: e.start, end-date: e.end),
    degree: e.degree,
    gpa: e.gpa,
    consistent: true,
  )
  parbreak() // separate stacked education entries
}

== Projects

#for pr in data.projects {
  project(name: pr.name, url: pr.url)
  list(pr.desc)
}

== Certificates and achievements

#for c in data.certificates {
  certificates(name: c.name, issuer: c.issuer)
}

== Skills
#list(..data.skills.map(g => [#strong(g.category): #(g.items.join(", "))]))
