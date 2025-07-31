function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  }
  
  // Auto-enable dark mode if previously set
  window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
    }
    const offcanvasEl = document.getElementById('offcanvasNavbar');

    if (offcanvasEl) {
      offcanvasEl.addEventListener('hide.bs.offcanvas', function () {
        const mobileHistory = document.getElementById('mobile-history-sidebar');
        if (mobileHistory) {
          mobileHistory.classList.add('d-none'); // Hide mobile history list on close
        }
      });

      // offcanvasEl.addEventListener('show.bs.offcanvas', function () {
      //   console.log('Offcanvas is shown');
      //   // Optional: custom actions on open
      // });
    }
  });