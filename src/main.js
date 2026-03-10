import './style.css'


/* ============================================================
   Bloomy Twists — main.js
   ============================================================ */

'use strict';


/* =========================
   THEME
========================= */

const THEME_KEY = 'bt-theme';
const root = document.documentElement;

function getTheme() {
  return localStorage.getItem(THEME_KEY) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.innerHTML = theme === 'dark'
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3z"/></svg>`;
  });
}

function toggleTheme() {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

/* =========================
   NAVBAR
========================= */

function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const path = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === path || (path === 'index.html' && href === '#')) {
      a.classList.add('active');
    }
  });
}

/* =========================
   MOBILE MENU
========================= */

function initMobileMenu() {
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => menu.classList.toggle('open'));

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

/* =========================
   FLOATING PETALS
========================= */

function initPetals() {
  const field = document.querySelector('.petal-field');
  if (!field) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const symbols = ['✿', '❀', '✾', '❁', '✽', '✸'];
  const count = window.innerWidth < 600 ? 10 : 18;

  for (let i = 0; i < count; i++) {

    const el = document.createElement('span');
    el.className = 'petal';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const left = Math.random() * 100;
    const dur = (Math.random() * 10 + 10).toFixed(1);
    const delay = (Math.random() * -14).toFixed(1);
    const drift = ((Math.random() - 0.5) * 120).toFixed(0);

    el.style.cssText =
      `left:${left}%;
       bottom:-8%;
       --dur:${dur}s;
       --delay:${delay}s;
       --drift:${drift}px;
       color:var(--c-300);`;

    field.appendChild(el);
  }
}

/* =========================
   SCROLL REVEAL
========================= */

function initReveal() {

  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);

      }

    });

  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));

}

/* =========================
   TOAST MESSAGE
========================= */

function showToast(message, icon = '✿') {

  let toast = document.querySelector('.toast');

  if (!toast) {

    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);

  }

  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(toast._timer);

  toast._timer = setTimeout(() => {

    toast.classList.remove('show');

  }, 3000);

}

/* =========================
   CART
========================= */

const CART_KEY = 'bt-cart';
let cart = [];

function loadCart() {

  try {

    const stored = localStorage.getItem(CART_KEY);
    cart = stored ? JSON.parse(stored) : [];

  } catch {

    cart = [];

  }

}

function saveCart() {

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();

}

function updateCartUI() {

  const total = cart.reduce((sum, item) => sum + item.qty, 0);

  document.querySelectorAll('.cart-count').forEach(el => {

    el.textContent = total;
    el.style.display = total ? 'flex' : 'none';

  });

}

function addToCart(name, price) {

  const found = cart.find(item => item.name === name);

  if (found) {
    found.qty++;
  } else {
    cart.push({
      name: name,
      price: parseFloat(price),
      qty: 1
    });
  }

  saveCart();
  showToast(`Added ${name} to cart`);

}

/* =========================
   PRODUCT FILTER
========================= */

function initFilter() {

  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.product-card');

  if (!btns.length) return;

  btns.forEach(btn => {

    btn.addEventListener('click', () => {

      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;

      cards.forEach(card => {

        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';

      });

    });

  });

}

/* =========================
   CARD 3D TILT
========================= */

function initTilt() {

  document.querySelectorAll('.card').forEach(card => {

    card.addEventListener('mousemove', e => {

      const rect = card.getBoundingClientRect();

      const dx = (e.clientX - rect.left) / rect.width - 0.5;
      const dy = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform =
        `translateY(-5px) perspective(800px)
         rotateX(${-dy * 6}deg)
         rotateY(${dx * 6}deg)`;

    });

    card.addEventListener('mouseleave', () => {

      card.style.transform = '';

    });

  });

}

/* =========================
   ORDER FORM
========================= */


/* FORM ID FROM FORMSPREE */

const FORMSPREE_ID = "xojkqnwy"; 


function initOrderForm(){

const form = document.getElementById("order-form");

if(!form) return;

// Prevent double-binding (this file initializes it in two places).
if (form.dataset.btBound === '1') return;
form.dataset.btBound = '1';

form.addEventListener("submit", async function(e){

e.preventDefault();

showToast("Submitting your order…", "✿");

const btn = form.querySelector('[type="submit"], button');

if (btn) {
  btn.disabled = true;
  btn.textContent = "Sending...";
}


/* COLLECT DATA */

const data = {

name: form.querySelector("#o-name")?.value || "",
phone: form.querySelector("#o-phone")?.value || "",
email: form.querySelector("#o-email")?.value || "",
flower: form.querySelector("#o-flower")?.value || "",
quantity: form.querySelector("#o-qty")?.value || "",
occasion: form.querySelector("#o-occasion")?.value || "",
message: form.querySelector("#o-msg")?.value || "",
date: new Date().toLocaleString()

};


/* SEND TO FORMSPREE */

try{

const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`,{

method:"POST",

headers:{
"Content-Type":"application/json",
"Accept":"application/json"
},

body:JSON.stringify(data)

});


if(response.ok){

const confirm = document.getElementById("order-confirm");
if (confirm) confirm.classList.add("show");

const confirmName = document.getElementById("confirm-name");
if (confirmName) confirmName.textContent = data.name || "friend";

showToast("Order submitted successfully", "✿");

form.reset();

}else{

let msg = "Error sending order";
try {
  const json = await response.json();
  if (json?.errors?.length) msg = json.errors.map(e => e.message).join(", ");
} catch {}
showToast(msg, "⚠");

}

}catch(error){

alert("Network error");

}

if (btn) {
  btn.disabled = false;
  btn.textContent = "Send Order";
}

});

}


// initOrderForm is called from the main DOMContentLoaded init below.
// const FORMSPREE_ID = "xojkqnwy";

// function initOrderForm() {

//   const form = document.getElementById('order-form');
//   if (!form) return;

//   form.addEventListener('submit', async e => {

//     e.preventDefault();

//     const btn = form.querySelector('[type="submit"]');

//     if (btn) {
//       btn.disabled = true;
//       btn.textContent = 'Sending...';
//     }

//     const data = {

//       name: form.querySelector('#o-name')?.value || '',
//       phone: form.querySelector('#o-phone')?.value || '',
//       email: form.querySelector('#o-email')?.value || '',
//       flower: form.querySelector('#o-flower')?.value || '',
//       quantity: form.querySelector('#o-qty')?.value || '',
//       occasion: form.querySelector('#o-occasion')?.value || '',
//       colors: [...form.querySelectorAll('input[name="colors"]:checked')]
//         .map(c => c.value).join(', '),
//       message: form.querySelector('#o-msg')?.value || '',
//       date: new Date().toLocaleString()

//     };

//     if (FORMSPREE_ID !== 'xojkqnwy') {

//       await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {

//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)

//       });

//     }

//     showToast("Order Submitted Successfully 🌸");

//     form.reset();

//     if (btn) {
//       btn.disabled = false;
//       btn.textContent = 'Submit Order';
//     }

//   });

// }

/* =========================
   COUNTERS
========================= */

function initCounters() {

  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let count = 0;

      const update = () => {

        count += target / 100;

        if (count < target) {

          el.textContent = Math.floor(count);
          requestAnimationFrame(update);

        } else {

          el.textContent = target;

        }

      };

      update();
      observer.unobserve(el);

    });

  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));

}

/* =========================
   INIT
========================= */

document.addEventListener('DOMContentLoaded', () => {

  applyTheme(getTheme());

  document.querySelectorAll('.theme-toggle')
    .forEach(btn => btn.addEventListener('click', toggleTheme));

  loadCart();
  updateCartUI();

  initNavbar();
  initMobileMenu();
  initPetals();
  initReveal();
  initFilter();
  initTilt();
  initOrderForm();
  initCounters();

  document.querySelectorAll('.btn-add-cart').forEach(btn => {

    const name = btn.dataset.name;
    const price = btn.dataset.price;

    if (!name || !price) return;

    btn.addEventListener('click', () => addToCart(name, price));

  });

});

