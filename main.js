import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

// Scroll to projects, fade
document.querySelector('.hero-scroll-to-projects').addEventListener('click', () => {
  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
});

document.querySelectorAll('.project-icon').forEach((el) => {
  el.style.setProperty('--delay', `${Math.random() * 700}ms`);
});

const revealObserver = new IntersectionObserver(([entry], obs) => {
  if (!entry.isIntersecting) return;
  document.body.classList.add('icons-visible');
  obs.disconnect();
}, { rootMargin: '0px 0px -25% 0px' });

revealObserver.observe(document.getElementById('projects'));


// Dark mode
const lightbulb = document.querySelector('.lightbulb-toggle');

lightbulb.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

// Project links
const projectLinks = {
  '.The-Dictionary': 'https://github.com/FixesMix/Dictionary_1.0.0',
  '.CYOA': 'https://github.com/FixesMix/Bellbloom',
  '.PC-Monitor': 'https://github.com/FixesMix/System_Dashboard',
  '.portfolio-v0': 'https://github.com/FixesMix/Portfolio_v0',
  '.Notella': 'https://github.com/FixesMix/Notella',
  '.Bellbloom': 'https://github.com/FixesMix/Bellbloom',
};

Object.entries(projectLinks).forEach(([selector, url]) => {
  const el = document.querySelector(selector);
  if (el) el.addEventListener('dblclick', () => window.open(url, '_blank'));
});

// Unique stickies
document.getElementById('date-sticky').textContent = "Today is " + new Date().toLocaleDateString();

// Icon hop
document.querySelectorAll('.project-icon').forEach((icon) => {
  icon.addEventListener('animationend', () => {
    icon.style.opacity = '1';
    icon.style.animation = 'none';
  }, { once: true });

  icon.addEventListener('pointerenter', () => {
    icon.style.transition = 'transform 0.1s';
    icon.style.transform = 'translateY(-7px)';
    setTimeout(() => {
      icon.style.transform = 'translateY(0)';
    }, 150);
  });
});