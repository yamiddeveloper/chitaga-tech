// Theme toggle functionality with transition effect
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Function to apply theme
  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
      themeToggle.checked = true;
    } else {
      htmlElement.classList.remove('dark');
      themeToggle.checked = false;
    }
    localStorage.setItem('theme', theme);
    
    // Dispatch event for other components to listen to
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  // Set initial theme
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Set initial theme based on system preference
    const initialTheme = systemPrefersDark ? 'dark' : 'light';
    applyTheme(initialTheme);
  }

  // Toggle theme when checkbox changes
  themeToggle.addEventListener('change', function() {
    applyTheme(this.checked ? 'dark' : 'light');
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
});