/**
 * Simplified Navigation for EduPath
 * No transitions - instant, clean navigation
 */

// Simple navigation class that just handles link clicks without any visual effects
class SimpleNavigation {
  constructor() {
    this.bindEvents();
  }

  navigateToPage(url) {
    // Direct navigation without any effects
    window.location.href = url;
  }

  bindEvents() {
    // Only handle navigation clicks - no visual effects
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
        return;
      }
      
      // For internal navigation, just let browser handle it naturally
      // No preventDefault, no custom handling
    });
  }
}

// Initialize simple navigation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SimpleNavigation();
  });
} else {
  new SimpleNavigation();
}

// Export for compatibility
window.SimpleNavigation = SimpleNavigation;