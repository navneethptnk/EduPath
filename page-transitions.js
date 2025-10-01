/**
 * Page Transition System for EduPath
 * Provides smooth transitions between pages
 */

// Page Transition Class
class PageTransition {
  constructor() {
    this.isTransitioning = false;
    this.createOverlay();
    this.bindEvents();
    this.init();
  }

  createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.innerHTML = `
      <div class=\"page-transition-content\">
        <div class=\"transition-spinner\"></div>
        <p style=\"margin: 1rem 0 0 0; font-size: 0.9rem; opacity: 0.9;\">Loading...</p>
      </div>
    `;
    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  async navigateToPage(url, immediate = false) {
    if (this.isTransitioning) return;
    
    // Don't transition if it's the same page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const targetPath = url.split('/').pop();
    if (currentPath === targetPath) {
      return;
    }

    this.isTransitioning = true;
    
    if (!immediate) {
      // Show transition overlay
      this.overlay.classList.add('active');
      document.body.classList.add('page-transitioning');
      
      // Wait for transition animation
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Navigate to new page
    window.location.href = url;
  }

  bindEvents() {
    // Intercept navigation clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
        return;
      }
      
      // Check if it's an internal navigation link
      if (href.endsWith('.html') || link.classList.contains('nav-link') || link.dataset.nav) {
        e.preventDefault();
        this.navigateToPage(href);
      }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.hideOverlay();
    });

    // Hide overlay when page loads
    window.addEventListener('load', () => {
      this.hideOverlay();
    });

    // Hide overlay on DOMContentLoaded as fallback
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => this.hideOverlay(), 100);
    });
  }

  hideOverlay() {
    if (this.overlay) {
      this.overlay.classList.remove('active');
    }
    document.body.classList.remove('page-transitioning');
    this.isTransitioning = false;
  }

  init() {
    // Add CSS if not already present
    if (!document.querySelector('#page-transition-styles')) {
      const style = document.createElement('style');
      style.id = 'page-transition-styles';
      style.textContent = `
        /* Page transition overlay */
        .page-transition-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .page-transition-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .page-transition-content {
          text-align: center;
          color: white;
          transform: translateY(20px);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .page-transition-overlay.active .page-transition-content {
          transform: translateY(0);
        }

        .transition-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Page fade animations */
        body {
          transition: opacity 0.3s ease-in-out;
        }

        body.page-transitioning {
          opacity: 0.7;
        }

        /* Enhanced content fade-in */
        .content-page, main {
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Enhance nav link transitions */
        .nav-link {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent);
          transition: left 0.5s ease;
        }
        
        .nav-link:hover::before {
          left: 100%;
        }
        
        .nav-link:hover {
          transform: translateY(-1px);
        }
      `;
      document.head.appendChild(style);
    }

    // Hide overlay immediately if page is already loaded
    if (document.readyState === 'complete') {
      setTimeout(() => this.hideOverlay(), 50);
    }
  }
}

// Initialize page transitions when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PageTransition();
  });
} else {
  new PageTransition();
}

// Export for global access
window.PageTransition = PageTransition;