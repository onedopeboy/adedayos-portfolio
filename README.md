# My Website Portfolio

**Course:** COS 106 – Introduction to Web Technologies
**Student:** Adedayo Oriaifo
**Institution:** MIVA Open University
**Project:** Build a fully functional, responsive, multi-page academic portfolio and student management website using **HTML, CSS and Javascript**


- **Live site:** https://onedopeboy.github.io/adedayos-portfolio/
- **GitHub repository:** https://github.com/onedopeboy/adedayos-portfolio

## 📄 Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Profile photo, welcome message, brief bio, quick links |
| About Me | `about.html` | Educational background, career aspirations, coursework table, technical skills, video log, hobbies |
| Projects | `projects.html` | Three sample projects with screenshots, descriptions, tags, demo/repo links, and a click-to-zoom lightbox |
| Academic Planner | `planner.html` | Interactive task manager (add / complete / delete / filter) plus an ambient focus sound player |
| Contact | `contact.html` | Validated contact form (name, email, phone, message) |

Every page shares the same header and footer for a consistent experience.

## ✨ Features

**HTML**
- Semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- A validated form, a data table, images, hyperlinks, lists, and an embedded `<video>` element

**CSS**
- Single external stylesheet (`styles.css`) shared across all pages
- Responsive layout using Flexbox and CSS Grid (mobile → desktop)
- Hover states, transitions, and fade-in animations
- Consistent color scheme, spacing, and typography (Poppins) [Extensive research was done to pick a colour scheme for this project]

**JavaScript**
- Event handling and DOM manipulation throughout
- Interactive Academic Planner: add, complete, delete, and filter tasks — persisted with `localStorage`
- Contact form validation: rejects empty fields, validates email format, enforces digits-only phone numbers
- Project gallery lightbox (zoom-to-view screenshots)
- Mobile navigation drawer
- An "Ambient Focus Synth" sound player built entirely with the **Web Audio API** (binaural beats, brown-noise rain, and a deep drone — synthesized live in the browser, no audio files needed)

## 🗂️ File Structure

```
Adedayos portfolio/
├── index.html          # Home page
├── about.html           # About Me page
├── projects.html        # Projects page
├── planner.html          # Academic Planner page
├── contact.html          # Contact page
├── styles.css            # Shared stylesheet (theme, layout, components)
├── script.js             # Shared JS: icons, data, navigation
├── planner.js             # Academic Planner logic + sound synth
└── assets/
    └── images/
        ├── dayo-profile.jpg
        ├── portal-mockup.jpg
        ├── study-buddy.jpg
        ├── hero-illustration.png
        └── task-app-illustration.jpg
```

## 🛠️ Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, CSS Custom Properties)
- Vanilla JavaScript (ES6+)
- Web Audio API

## 📋 Assignment Requirements Checklist

- [x] Homepage with name, photo, welcome message, nav, bio
- [x] About Me page with education, aspirations, skills, hobbies
- [x] Projects page with 3+ sample projects, descriptions, images, links
- [x] Interactive Academic Planner (add / complete / delete tasks)
- [x] Contact form with full validation (empty fields, email format, digits-only phone)
- [x] Semantic HTML, forms, tables, images, hyperlinks, lists, multimedia
- [x] External CSS, responsive design, Flexbox/Grid, animations, consistent color scheme
- [x] Event handling, DOM manipulation, form validation, dynamic content, arrays/functions

## 📃 License

This project was created for academic purposes as part of the COS 106 Lab Assesment at MIVA Open University.