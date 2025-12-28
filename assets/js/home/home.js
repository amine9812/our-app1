// Enable smooth in-page scrolling for anchor links
const links = document.querySelectorAll('a[href^="#"]');
links.forEach((link) =>
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  })
);
