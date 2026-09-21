const html = document.documentElement;
const themeCheckbox = document.getElementById("theme-checkbox");
const langButton = document.getElementById("lang-btn");
const menuButton = document.getElementById("mobile-menu-btn");
const mobileOverlay = document.getElementById("mobile-overlay");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

const translations = {
  en: {
    "nav-about": "About", "nav-projects": "Projects", "nav-contact": "Contact",
    "hero-greeting": "Hello, welcome", "hero-name": "I'm <span class=\"gradient-text\">Rodrigo</span>",
    "hero-availability": "<i class=\"fa-solid fa-circle\"></i> Available for opportunities", "hero-location": "<i class=\"fa-solid fa-location-dot\"></i> Spain · Remote",
    "hero-desc": "I build modern, fast and scalable web applications. I care deeply about clean code architecture and engaging user interfaces.",
    "hero-btn-1": "View projects", "hero-btn-2": "Let's talk", "about-title": "About me",
    "about-p1": "I'm a Full Stack developer focused on creating efficient, engaging digital experiences. I enjoy turning complex problems into intuitive web applications using industry best practices.",
    "about-p2": "My constant goal is to write clean, modular and maintainable code while exploring new technologies that expand my skill set.",
    "skills-tools": "Tools", "projects-title": "Selected projects", "proj1-badge": "Featured project · DAW final project",
    "proj1-desc": "A web platform to create, manage and analyse Formula 1 setups. It includes setup sharing, data visualisation, 3D models, user roles, an admin panel and an online store.",
    "proj1-roadmap-title": "Key features:", "proj1-r1": "Create, edit and manage custom setups.",
    "proj1-r2": "User roles, protected routes and secure access.", "proj1-r3": "Online store with catalogue, cart and order management.",
    "proj1-r4": "Administration panel for users and content.", "proj1-r5": "Data visualisation with charts, 3D models and interactive animations.",
    "proj2-title": "Whac-a-mole game", "proj2-desc": "A fast-paced reflex game built with vanilla JavaScript, where the challenge grows as the player progresses.",
    "proj3-title": "Battleship", "proj3-desc": "The classic strategy board game for the web, with ship placement logic and an opponent AI.",
    "btn-code": "Code", "btn-demo": "Live demo", "contact-title": "Let's talk",
    "contact-desc": "I'm looking for my first professional web development opportunity. If my profile fits your team, you have an exciting project, or simply want to say hi, my inbox is open!",
    "footer-text": "© 2026 Rodrigo. Designed and built with care."
  }
};

function setTheme(theme) {
  html.dataset.theme = theme;
  if (themeCheckbox) themeCheckbox.checked = theme === "dark";
  localStorage.setItem("portfolio-theme", theme);
}

function setLanguage(language) {
  if (language === "es" && html.lang === "en") {
    localStorage.setItem("portfolio-language", "es");
    window.location.reload();
    return;
  }
  const dictionary = translations[language];
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = dictionary?.[element.dataset.i18n];
    if (value) element.innerHTML = value;
  });
  html.lang = language === "en" ? "en" : "es";
  localStorage.setItem("portfolio-language", language);
  langButton.innerHTML = `<span class="language-code language-en ${language === "en" ? "is-active" : ""}" aria-hidden="true">EN</span><span class="language-separator" aria-hidden="true">/</span><span class="language-code language-es ${language === "es" ? "is-active" : ""}" aria-hidden="true">ES</span>`;
  langButton.setAttribute("aria-label", language === "en" ? "Cambiar a español" : "Switch to English");
  document.title = language === "en" ? "RCM | Full Stack Developer" : "RCM | Desarrollador Full Stack";
}

function toggleMenu(force) {
  const isOpen = typeof force === "boolean" ? force : !mobileOverlay.classList.contains("visible");
  mobileOverlay.classList.toggle("visible", isOpen);
  menuButton.classList.toggle("nav-active", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  mobileOverlay.setAttribute("aria-hidden", String(!isOpen));
  document.body.classList.toggle("no-scroll", isOpen);
}

const savedTheme = localStorage.getItem("portfolio-theme");
setTheme(savedTheme || (systemTheme.matches ? "dark" : "light"));
setLanguage(localStorage.getItem("portfolio-language") || "es");

themeCheckbox?.addEventListener("change", () => setTheme(themeCheckbox.checked ? "dark" : "light"));
systemTheme.addEventListener("change", (event) => {
  if (!localStorage.getItem("portfolio-theme")) setTheme(event.matches ? "dark" : "light");
});
langButton?.addEventListener("click", () => setLanguage(html.lang === "es" ? "en" : "es"));
menuButton?.addEventListener("click", () => toggleMenu());
document.querySelectorAll(".mobile-link").forEach((link) => link.addEventListener("click", () => toggleMenu(false)));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealItems = document.querySelectorAll(".section-title, .glass-card, .hero-text, .hero-visual, .contact-text, .contact-email, .social-links");
revealItems.forEach((item) => item.classList.add("reveal"));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
}, { threshold: 0.12 });
revealItems.forEach((item) => observer.observe(item));

const sections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll(".nav-links a, .mobile-nav-links a");
const navigationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
      link.classList.toggle("is-active", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });
sections.forEach((section) => navigationObserver.observe(section));

if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches && typeof gsap !== "undefined") {
  const nameElement = document.querySelector(".name .gradient-text");
  if (nameElement) {
    const name = nameElement.textContent.trim();
    nameElement.textContent = "";
    gsap.to({ value: 0 }, { value: name.length, duration: 1.1, delay: 0.2, ease: "none", onUpdate() {
      nameElement.textContent = name.slice(0, Math.floor(this.targets()[0].value));
    }});
  }
}
