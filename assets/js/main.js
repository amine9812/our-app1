const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('pam-theme');

// Restore persisted theme preference on page load
if (savedTheme) {
  body.setAttribute('data-theme', savedTheme);
}

// Toggle and persist theme choice
const toggleTheme = () => {
  const next = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  body.setAttribute('data-theme', next);
  localStorage.setItem('pam-theme', next);
};

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

// Lazy-load scripts per page for lighter initial load
const page = body.dataset.page;

if (page === 'home') {
  import('./home/home.js');
}

if (page === 'editor') {
  import('./editor/ui.js');
}
