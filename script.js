/* =====================================================================
   COS 106 Term Project — Shared JavaScript
   Contains: icon library, student/portfolio data,
   navigation (desktop + mobile), and footer year helper.
   Page-specific logic (planner, contact, projects) lives at the
   bottom, guarded so it only runs on the page that needs it.
===================================================================== */

/* ---------------------- Inline SVG Icon Library ---------------------- */
/* I am using inline SVGs for icons to avoid external dependencies and to allow for easy CSS styling. Each icon is defined as a string of SVG markup, and the `icon` function wraps it in a span with a class for styling. */

const ICONS = {
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  gradCap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 10-10-5L2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>',
  calendarDays: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  bookOpen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5c3 0 6 1 8 3v11c-2-2-5-3-8-3Z"/><path d="M22 5c-3 0-6 1-8 3v11c2-2 5-3 8-3Z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="m9 13.5-1.5 7L12 18l4.5 2.5-1.5-7"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>',
  checkCircle2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>',
  circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18a13 13 0 0 1-9-9l2.3-1.5a1.5 1.5 0 0 0 .6-1.8L7.6 2.9A1.5 1.5 0 0 0 5.8 2L3.6 3A2 2 0 0 0 2.7 5C3.4 12 10 18.6 17 19.3a2 2 0 0 0 2-.9l1-2.2a1.5 1.5 0 0 0-.9-1.8l-2.8-1.3a1.5 1.5 0 0 0-1.8.6Z"/></svg>',
  mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.4 0C6.4 2.8 5.3 3.1 5.3 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 3.9 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
  zoomIn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16l-6 8v5l-4 2v-7Z"/></svg>',
  clipboardList: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 2h6v4H9zM9 11h6M9 15h4"/></svg>',
  trash2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  alertTriangle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
  alertCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5v14l11-7Z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>',
  volume2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4Z"/><path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14"/></svg>',
  volumeX: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4Z"/><path d="m17 9 6 6M23 9l-6 6"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4Z"/></svg>',
  cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="1"/><rect x="10" y="10" width="4" height="4"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 6.5a3.5 3.5 0 1 0-4.95 4.95L4 17v3h3l5.55-5.55a3.5 3.5 0 0 0 4.95-4.95l-2.5 2.5-2-2 2.5-2.5Z"/></svg>',
};

function icon(name, cls) { return `<span class="i ${cls || ''}">${ICONS[name] || ''}</span>`; }

/* ---------------------- Portfolio Data ---------------------- */
const STUDENT_PROFILE = {
  name: 'Adedayo Oriaifo',
  title: 'B.Sc. Computer Science Student',
  university: 'MIVA Open University',
  courseCode: 'COS 106',
  courseName: 'Introduction to Web Technologies',
  email: 'a.oriaifo3659@miva.edu.ng',
  phone: '+2348084174158',
  avatar: 'assets/images/dayo-profile.jpg',
  welcomeMessage: "Welcome to my Academic Portfolio! I'm a passionate web developer and computer science student focusing on building fast, accessible, and user-centric digital experiences.",
  bio: 'I am a highly motivated Computer Science sophomore at MIVA Open University, specializing in modern web design and software engineering. I love translating complex requirements into elegant, structured, and user-friendly web interfaces. This site serves as both my term project for COS 106 and my personal learning space.',
  careerAspirations: 'Upon graduation, I aim to work as a Full-Stack Software Engineer, eventually transitioning into Systems Architecture. I am particularly excited about cloud-native web architectures, decentralized systems, and designing educational tech tools that make coding accessible to everyone.',
  hobbies: [
    { name: 'Coding Side Projects', description: 'Experimenting with React, Node.js, and browser micro-games.' },
    { name: 'Reading Tech Blogs', description: 'Keeping up with the latest web standards, CSS specifications, and tech news.' },
    { name: 'Research', description: 'I love carrying out research. From wondering how something works or wanting to get familiar with a concept, I find myself getting lost in research for hours at a time until I get the result I want.' },
    { name: 'Watching Anime', description: 'I have a deep love for anime because that have the creative freedom to tell deep, emotional and compelling stories otherwise not possible with live action.' }
  ],
  skills: [
    { name: 'HTML5 & Semantic Markup', percentage: 45 },
    { name: 'CSS3 & Responsive Design', percentage: 40 },
    { name: 'JavaScript (DOM & Events)', percentage: 40 },
    { name: 'UI Interaction Patterns', percentage: 30 },
    { name: 'Git & Source Control', percentage: 49 },
    { name: 'Responsive UI Design', percentage: 50 }
  ]
};

const INITIAL_COURSES = [
  { code: 'COS 101', title: 'Introduction to Computer Science', credits: 3, grade: 'A', semester: 'Semester 1' },
  { code: 'STA 111', title: 'Descriptive Statistics', credits: 3, grade: 'A', semester: 'Semester 1' },
  { code: 'PHY 101', title: 'General Physics I', credits: 2, grade: 'B', semester: 'Semester 1' },
  { code: 'MTH 101', title: 'Elementary Mathematics', credits: 2, grade: 'A', semester: 'Semester 2' },
  { code: 'GST 127', title: 'Environmental Sustainability', credits: 2, grade: 'A', semester: 'Semester 2' },
  { code: 'GST 111', title: 'Communication in English I', credits: 2, grade: 'A', semester: 'Semester 1' },
  { code: 'GST 121', title: 'Use of Library Study Skills and ICT', credits: 2, grade: 'A', semester: 'Semester 1' },
  { code: 'PHY 107', title: 'General Practical Physics', credits: 1, grade: 'A', semester: 'Semester 2' }
];

const INITIAL_TASKS = [
  { id: '1', title: 'Complete COS 106 Term Project Web Page', course: 'COS 106 - Web Technologies', dueDate: '2026-07-05', priority: 'high', completed: false },
  { id: '2', title: 'Review Python Lists and Tuples Lecture Notes', course: 'COS 108 - Python Programming', dueDate: '2026-06-30', priority: 'medium', completed: true },
  { id: '3', title: 'Submit GST 101 English Essay Assignment', course: 'GST 101 - English Communication', dueDate: '2026-07-01', priority: 'low', completed: false },
  { id: '4', title: 'Prepare for COS 102 Semester Review Session', course: 'COS 102 - Logic Design', dueDate: '2026-07-03', priority: 'high', completed: false }
];

/* None of the project data below is real. These are mock projects for the purpose of this academic portfolio showcase. */

const PROJECTS = [
  {
    id: 'proj1',
    title: 'MIVA Academic Portal Dashboard',
    description: 'A comprehensive educational dashboard enabling students to view grades, schedule courses, and track tuition payments. Built with semantic HTML, CSS grid layouts, and active interactive filters.',
    image: 'assets/images/portal-mockup.jpg',
    tags: ['HTML5', 'CSS Grid', 'Dynamic Charts', 'Data Table'],
    demoUrl: 'https://ais-pre-ecaiqf3k6sn2ru5s7hzloo-536585578792.europe-west2.run.app/portal',
    githubUrl: 'https://github.com/aria-thorne/miva-portal'
  },
  {
    id: 'proj2',
    title: 'FocusTrack Checklist Pro',
    description: 'A responsive, interactive schedule-planning application featuring priority sorting, custom labels, progress bars, and persistent localStorage sync.',
    image: 'assets/images/task-app-illustration.jpg',
    tags: ['JavaScript', 'Local Storage', 'Micro-Animations'],
    demoUrl: 'https://ais-pre-ecaiqf3k6sn2ru5s7hzloo-536585578792.europe-west2.run.app/focustrack',
    githubUrl: 'https://github.com/aria-thorne/focustrack'
  },
  {
    id: 'proj3',
    title: 'Socrates: Smart Study Buddy',
    description: 'A smart chatbot interface customized for university curriculum assistance. Socrates can index lectures, generate quizzes, and summarize research papers.',
    image: 'assets/images/study-buddy.jpg',
    tags: ['Chat UI', 'JavaScript', 'Markdown Parser'],
    demoUrl: 'https://ais-pre-ecaiqf3k6sn2ru5s7hzloo-536585578792.europe-west2.run.app/socrates',
    githubUrl: 'https://github.com/aria-thorne/socrates-helper'
  }
];

/* ---------------------- Navigation (mobile drawer + active link) ---------------------- */
function initNav() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-nav');
  if (toggle && drawer) {
    toggle.innerHTML = icon('menu');
    toggle.addEventListener('click', () => {
      const isOpen = !drawer.hidden;
      drawer.hidden = isOpen;
      toggle.innerHTML = isOpen ? icon('menu') : icon('close');
    });
    drawer.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        drawer.hidden = true;
        toggle.innerHTML = icon('menu');
      });
    });
  }

  // Render icons for nav icon placeholders
  document.querySelectorAll('[data-icon]').forEach((el) => {
    el.innerHTML = icon(el.getAttribute('data-icon'));
  });
}

/* ---------------------- Back to top ---------------------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (btn) {
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
}

/* ---------------------- Boot shared UI ---------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initBackToTop();
});
