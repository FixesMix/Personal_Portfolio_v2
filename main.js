import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

const lightbulb = document.querySelector('.col-start-2.row-start-1');

lightbulb.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

// persist on refresh
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}


document.querySelector(".The-Dictionary").addEventListener('dblclick', () => {
  window.open('https://github.com/FixesMix/Dictionary_1.0.0', '_blank');
});

document.querySelector(".CYOA").addEventListener('dblclick', () => {
  window.open('https://github.com/FixesMix/Bellbloom', '_blank');
});

document.querySelector(".PC-Monitor").addEventListener('dblclick', () => {
  window.open('https://github.com/FixesMix/System_Dashboard', '_blank');
});

document.querySelector(".portfolio-v0").addEventListener('dblclick', () => {
  window.open('https://github.com/FixesMix/Portfolio_v0', '_blank');
});

document.querySelector(".Notella").addEventListener('dblclick', () => {
  window.open('https://github.com/FixesMix/Notella', '_blank');
});

document.querySelector(".Bellbloom").addEventListener('dblclick', () => {
  window.open('https://github.com/FixesMix/Bellbloom', '_blank');
});

document.getElementById('date-sticky').textContent = "Today is " + new Date().toLocaleDateString();



