// Call this in your main JS
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  }
  
  // Auto-enable dark mode if previously set
  window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
    }
  });

document.getElementById('side-navbar-close').addEventListener('click', () => {
  document.getElementById('mobile-history-sidebar').classList.add('d-none')
});