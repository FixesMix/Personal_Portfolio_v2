import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

const desktopMode = window.matchMedia('(min-width: 768px)');

window.addEventListener('load', () => {
  if (!desktopMode.matches) return;   
  document.querySelectorAll('.project-icon').forEach((el) => makeDraggable(el, 80));
});

// Scroll to projects
document.querySelector('.hero-scroll-to-projects').addEventListener('click', () => {
  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
});

// Toggle dark mode
const lightbulb = document.querySelector('.col-start-2.row-start-1');

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

// Icon dragging

    // Icon spacing
const ICON_SPACING_BUFFER = 24;

// Additional spacing when pushing an icon from protected zones
const PROTECTED_ZONE_BUFFER = 32;

const occupiedCells = new Set(); // tracks "col,row" strings

function getGridCell(left, top, gridSize) {
  return {
    col: Math.round(left / gridSize),
    row: Math.round(top / gridSize),
  };
}

function cellKey(col, row) {
  return `${col},${row}`;
}

// Search outwards from desired cell until a free one is located.
function findNearestFreeCell(startCol, startRow) {
  let radius = 0;
  while (radius < 50) {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const col = startCol + dx;
        const row = startRow + dy;
        if (col < 0 || row < 0) continue;
        if (!occupiedCells.has(cellKey(col, row))) {
          return { col, row };
        }
      }
    }
    radius++;
  }
  return { col: startCol, row: startRow };
}

// gridSize here is the CENTER-TO-CENTER distance between cells.
// Adding ICON_SPACING_BUFFER to the effective cell size is what actually
// changes the visual gap between icons. Occupied-cell tracking alone
// only guarantees "not the same cell", not "comfortably spaced".
function snapToGrid(el, baseGridSize) {
  const effectiveGridSize = baseGridSize + ICON_SPACING_BUFFER;

  const currentLeft = parseFloat(el.style.left);
  const currentTop = parseFloat(el.style.top);

  const desired = getGridCell(currentLeft, currentTop, effectiveGridSize);

  // free up this icon's OLD cell first, if it had one
  if (el.dataset.col !== undefined) {
    occupiedCells.delete(cellKey(el.dataset.col, el.dataset.row));
  }

  const free = findNearestFreeCell(desired.col, desired.row);

  occupiedCells.add(cellKey(free.col, free.row));
  el.dataset.col = free.col;
  el.dataset.row = free.row;

  el.style.left = `${free.col * effectiveGridSize}px`;
  el.style.top = `${free.row * effectiveGridSize}px`;
}

function isOverlapping(el, target) {
  const a = el.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}





function pushOutOfElement(el, target, buffer = PROTECTED_ZONE_BUFFER) {
  const a = el.getBoundingClientRect();
  const b = target.getBoundingClientRect();

  const overlapBottom = a.bottom - b.top;
  const overlapTop = b.bottom - a.top;
  const overlapRight = a.right - b.left;
  const overlapLeft = b.right - a.left;

  const minOverlap = Math.min(overlapBottom, overlapTop, overlapRight, overlapLeft);

  const currentLeft = parseFloat(el.style.left);
  const currentTop = parseFloat(el.style.top);

  // Never push by less than one full buffer, so grid-snapping can't undo it
  const pushAmount = minOverlap + buffer;

  if (minOverlap === overlapBottom) {
    el.style.top = `${currentTop - pushAmount}px`;
  } else if (minOverlap === overlapTop) {
    el.style.top = `${currentTop + pushAmount}px`;
  } else if (minOverlap === overlapRight) {
    el.style.left = `${currentLeft - pushAmount}px`;
  } else {
    el.style.left = `${currentLeft + pushAmount}px`;
  }
}

function resolveCollisions(el, targets) {
  targets.forEach((target) => {
    if (target !== el && isOverlapping(el, target)) {
      pushOutOfElement(el, target);
    }
  });
}

function clampToPage(el) {
  const pageWidth = document.documentElement.clientWidth;
  const pageHeight = document.body.offsetHeight;
  const rect = el.getBoundingClientRect();

  let left = parseFloat(el.style.left);
  let top = parseFloat(el.style.top);

  left = Math.max(0, Math.min(left, pageWidth - rect.width));
  top = Math.max(0, Math.min(top, pageHeight - rect.height));

  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
}

function settlePosition(el, gridSize) {
  const protectedEls = document.querySelectorAll('.protected-zone');

  snapToGrid(el, gridSize);

  for (let i = 0; i < 4; i++) {
    resolveCollisions(el, protectedEls);
    clampToPage(el);
    snapToGrid(el, gridSize);
  }
}

function makeDraggable(el, gridSize = 80) {
  let offsetX, offsetY;
  let isDragging = false;

  const rect = el.getBoundingClientRect();
  document.body.appendChild(el);

  el.style.position = 'absolute';
  el.style.left = `${rect.left + window.scrollX}px`;
  el.style.top = `${rect.top + window.scrollY}px`;
  el.style.margin = '0';
  el.classList.add('touch-none');

 


  // Register this icon's starting cell so nothing else can snap on top of it
  settlePosition(el, gridSize);

   el.addEventListener('mousedown', (e) => {
    el.addEventListener('pointerdown', (e) => {
    isDragging = true;
    el.dataset.dragged = '';
    el.setPointerCapture(e.pointerId);
    });

    isDragging = true;
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;
    el.style.zIndex = 1000;
    el.focus();
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    
    if (!isDragging) return;
    el.style.left = `${e.clientX - offsetX + window.scrollX}px`;
    el.style.top = `${e.clientY - offsetY + window.scrollY}px`;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    settlePosition(el, gridSize);
  });
}



window.addEventListener('load', () => {
  document.querySelectorAll('.project-icon').forEach((el) => makeDraggable(el, 80));
});
