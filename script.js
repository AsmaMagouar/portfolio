"use strict";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 1. Skill bars fill up (and the % counts up) when the Skills section appears */
const meters = document.querySelectorAll("meter");

function animateMeter(meter) {
  const target = Number(meter.dataset.value);
  const label = meter.previousElementSibling.lastElementChild;
  if (reduceMotion) {
    meter.value = target;
    label.textContent = target + "%";
    return;
  }
  const duration = 1000;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const current = Math.round(target * eased);
    meter.value = current;
    label.textContent = current + "%";
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

meters.forEach(m => {
  m.dataset.value = m.value; // keep the real value from the HTML
  m.value = 0;
  m.previousElementSibling.lastElementChild.textContent = "0%";
});

const skillsSection = document.querySelector("#skills");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      meters.forEach(animateMeter);
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  observer.observe(skillsSection);
} else {
  meters.forEach(animateMeter);
}

/* 2. Back-to-top button */
const topBtn = document.querySelector("#top-btn");
window.addEventListener("scroll", () => {
  topBtn.classList.toggle("show", window.scrollY > 500);
}, { passive: true });
topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});

/* 3. Highlight the menu link of the section you are reading */
const links = document.querySelectorAll(".menu ul a");
const sections = [...links].map(a => document.querySelector(a.getAttribute("href")));
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });
sections.forEach(s => s && navObserver.observe(s));
