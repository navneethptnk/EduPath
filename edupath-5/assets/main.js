// Initialize i18n support
let i18nInitialized = false;

function initializeI18n() {
  if (window.i18n && !i18nInitialized) {
    i18nInitialized = true;
    
    // Add language change listener
    window.addEventListener('languageChanged', () => {
      updatePageTitle();
      updateDynamicContent();
    });
    
    // Initial update
    updatePageTitle();
  }
}

function updatePageTitle() {
  if (!window.i18n) return;
  
  const currentPage = getCurrentPageName();
  const baseTitle = 'EduPath';
  let pageTitle = baseTitle;

  if (currentPage) {
    const pageTitleKey = `nav.${currentPage}`;
    const translatedTitle = window.i18n.t(pageTitleKey);
    if (translatedTitle !== pageTitleKey) {
      pageTitle = `${translatedTitle} — ${baseTitle}`;
    }
  }

  document.title = pageTitle;
}

function getCurrentPageName() {
  const path = window.location.pathname;
  const fileName = path.split('/').pop().split('.')[0];
  
  const pageMap = {
    'index': 'home',
    'quiz': 'quiz', 
    'courses': 'courses',
    'career': 'career',
    'colleges': 'colleges',
    'scholarships': 'scholarships',
    'timeline': 'timeline',
    'profile': 'profile'
  };

  return pageMap[fileName] || 'home';
}

function updateDynamicContent() {
  // Update any dynamic content when language changes
  if (window.i18n) {
    // Update notification messages with current language
    window.__showNotification = createLocalizedNotificationFunction();
  }
}

function createLocalizedNotificationFunction() {
  return (messageKey, type = 'info', duration = 4000) => {
    // If messageKey starts with a translation key pattern, translate it
    let message = messageKey;
    if (messageKey.includes('.') && window.i18n) {
      const translated = window.i18n.t(messageKey);
      if (translated !== messageKey) {
        message = translated;
      }
    }
    
    // Call the original notification function
    originalShowNotification(message, type, duration);
  };
}

// Initialize i18n when available
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initializeI18n, 100); // Small delay to ensure i18n is loaded
});

const activeClass = 'nav-link active';
const inactiveClass = 'nav-link';

window.__setActiveNav = (key) => {
  document.querySelectorAll('a[data-nav]').forEach((a) => {
    const isActive = a.getAttribute('data-nav') === key;
    a.className = isActive ? activeClass : inactiveClass;
  });
};

window.__storage = {
  get(key, fallback = null) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) { localStorage.removeItem(key); }
};

// Load authentication system
function loadAuthSystem() {
  const script = document.createElement('script');
  script.src = 'assets/auth.js';
  script.onload = () => {
    console.log('🔐 Authentication system loaded');
    // Initialize authentication UI updates after auth system loads
    if (window.eduPathAuth) {
      window.eduPathAuth.updateUI();
    }
  };
  script.onerror = () => {
    console.warn('⚠️ Authentication system failed to load, continuing without auth features');
  };
  document.head.appendChild(script);
}

// Load auth system on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAuthSystem);
} else {
  loadAuthSystem();
}

// Enhanced mobile menu controls with better animations and accessibility
function openDrawer() {
  const drawer = document.querySelector('[data-drawer]');
  const backdrop = document.querySelector('[data-backdrop]');
  const menuButton = document.querySelector('[data-open-drawer]');
  if (!drawer || !backdrop || !menuButton) return;
  
  // Animate opening
  drawer.classList.add('open');
  backdrop.classList.add('show');
  menuButton.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  // Focus management
  const firstFocusable = drawer.querySelector('a, button');
  if (firstFocusable) {
    setTimeout(() => firstFocusable.focus(), 300);
  }
  
  // Trap focus
  window.__trapFocus && window.__trapFocus(drawer);
  
  // Add ARIA attributes
  drawer.setAttribute('aria-hidden', 'false');
  menuButton.setAttribute('aria-expanded', 'true');
}

function closeDrawer() {
  const drawer = document.querySelector('[data-drawer]');
  const backdrop = document.querySelector('[data-backdrop]');
  const menuButton = document.querySelector('[data-open-drawer]');
  if (!drawer || !backdrop || !menuButton) return;
  
  // Animate closing
  drawer.classList.remove('open');
  backdrop.classList.remove('show');
  menuButton.classList.remove('open');
  document.body.style.overflow = '';
  
  // Return focus to menu button
  menuButton.focus();
  
  // Update ARIA attributes
  drawer.setAttribute('aria-hidden', 'true');
  menuButton.setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', (e) => {
  const openBtn = e.target.closest && e.target.closest('[data-open-drawer]');
  if (openBtn) {
    e.preventDefault();
    openDrawer();
  }
  if (e.target.matches('[data-backdrop]')) closeDrawer();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});

// Close mobile menu when clicking on nav links
document.addEventListener('click', (e) => {
  if (e.target.matches('.nav-mobile .nav-link')) {
    closeDrawer();
  }
});

// Enhanced loading states for better UX
window.__showLoading = (element) => {
  if (element) {
    element.classList.add('loading');
    element.setAttribute('aria-busy', 'true');
  }
};

window.__hideLoading = (element) => {
  if (element) {
    element.classList.remove('loading');
    element.removeAttribute('aria-busy');
  }
};

// Store original notification function
let originalShowNotification;

// Enhanced notification system with better styling and accessibility
window.__showNotification = (message, type = 'info', duration = 4000) => {
  // Store original function if not already stored
  if (!originalShowNotification && window.showNotification) {
    originalShowNotification = window.showNotification;
  }
  
  // Remove existing notifications
  document.querySelectorAll('.notification').forEach(n => n.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'polite');
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${icons[type] || icons.info}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Close notification">×</button>
    </div>
  `;
  
  // Add styles if not already present
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        min-width: 300px;
        max-width: 500px;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .notification.show {
        opacity: 1;
        transform: translateX(0);
      }
      
      .notification-success {
        background: #10b981;
        color: white;
      }
      
      .notification-error {
        background: #ef4444;
        color: white;
      }
      
      .notification-warning {
        background: #f59e0b;
        color: white;
      }
      
      .notification-info {
        background: #3b82f6;
        color: white;
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .notification-icon {
        font-size: 18px;
        flex-shrink: 0;
      }
      
      .notification-message {
        flex: 1;
        font-size: 14px;
        line-height: 1.4;
      }
      
      .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        opacity: 0.7;
        transition: opacity 0.2s;
      }
      
      .notification-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
      }
      
      @media (max-width: 640px) {
        .notification {
          left: 20px;
          right: 20px;
          min-width: auto;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Close button functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  });
  
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Auto-remove after duration
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }
  }, duration);
};

// Enhanced API client for timeline and other services
window.__apiClient = {
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },

  // Generic request method with error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      console.log(`🌐 API Request: ${config.method} ${url}`);
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ API Response: ${data.success ? 'Success' : 'Failed'}`);
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - API server may be down');
      }
      
      console.error(`❌ API Error for ${endpoint}:`, error.message);
      
      // Return mock data for development/demo purposes
      if (endpoint.includes('/api/announcements')) {
        console.warn('🔄 Using fallback data for timeline');
        return this.getFallbackAnnouncementData();
      }
      
      throw error;
    }
  },

  // Get announcements with filters
  async getAnnouncements(filters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    
    const endpoint = `/api/announcements${params.toString() ? '?' + params.toString() : ''}`;
    return await this.request(endpoint);
  },

  // Search announcements
  async searchAnnouncements(query, filters = {}) {
    return await this.request('/api/search', {
      method: 'GET',
      headers: {
        ...this.defaultHeaders,
        'X-Search-Query': encodeURIComponent(query)
      }
    });
  },

  // Trigger API refresh
  async refreshData() {
    return await this.request('/api/refresh', {
      method: 'POST',
      headers: {
        ...this.defaultHeaders,
        'X-API-Key': 'edupath-admin-2024-secure-key'
      }
    });
  },

  // Get API health status
  async getHealth() {
    return await this.request('/health');
  },

  // Get categories
  async getCategories() {
    return await this.request('/api/categories');
  },

  // Get sources status
  async getSources() {
    return await this.request('/api/sources');
  },

  // Fallback data for when API is not available
  getFallbackAnnouncementData() {
    const currentDate = new Date();
    const futureDate30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const futureDate45 = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
    const futureDate60 = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    
    return {
      success: true,
      data: [
        {
          id: 'current-1',
          title: 'JEE Main 2025 Registration Open - Apply Now!',
          description: 'National Testing Agency has announced JEE Main 2025 registration. Apply online for engineering entrance exam with new pattern and syllabus updates.',
          category: 'exam',
          status: 'active',
          priority: 'high',
          source_name: 'NTA',
          date_published: currentDate.toISOString(),
          date_application_end: futureDate30.toISOString(),
          links: {
            official_url: 'https://jeemain.nta.nic.in'
          },
          financial: {
            amount: 0,
            frequency: 'One-time'
          }
        },
        {
          id: 'current-2',
          title: 'NEET UG 2025 - Medical Entrance Preparation',
          description: 'National Eligibility Entrance Test for medical courses 2025. Updated eligibility criteria and exam pattern for MBBS/BDS admissions.',
          category: 'exam',
          status: 'upcoming',
          priority: 'high',
          source_name: 'NTA',
          date_published: currentDate.toISOString(),
          date_application_end: futureDate45.toISOString(),
          links: {
            official_url: 'https://neet.nta.nic.in'
          },
          financial: {
            amount: 0,
            frequency: 'One-time'
          }
        },
        {
          id: 'current-3',
          title: 'PM Scholarship Scheme 2024-25 - ₹3L Annual',
          description: 'Prime Minister Scholarship for meritorious students. Apply for ₹3,00,000 annual scholarship covering tuition and living expenses.',
          category: 'scholarship',
          status: 'active',
          priority: 'high',
          source_name: 'NSP',
          date_published: currentDate.toISOString(),
          date_application_end: futureDate60.toISOString(),
          links: {
            official_url: 'https://scholarships.gov.in'
          },
          financial: {
            amount: 300000,
            frequency: 'Annual'
          }
        },
        {
          id: 'current-4',
          title: 'CUET UG 2025 - Common University Entrance',
          description: 'Common University Entrance Test for undergraduate admissions in central universities. New exam pattern and registration process.',
          category: 'exam',
          status: 'upcoming',
          priority: 'medium',
          source_name: 'NTA',
          date_published: currentDate.toISOString(),
          date_application_end: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
          links: {
            official_url: 'https://cuet.samarth.ac.in'
          },
          financial: {
            amount: 0,
            frequency: 'One-time'
          }
        },
        {
          id: 'current-5',
          title: 'Digital India Scholarship 2024-25',
          description: 'Ministry of Electronics & IT scholarship for computer science and IT students. Covers full tuition + ₹50K stipend for top performers.',
          category: 'scholarship',
          status: 'active',
          priority: 'high',
          source_name: 'MeitY',
          date_published: currentDate.toISOString(),
          date_application_end: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          links: {
            official_url: 'https://digitalindia.gov.in/scholarships'
          },
          financial: {
            amount: 250000,
            frequency: 'Annual'
          }
        }
      ],
      count: 5,
      timestamp: currentDate.toISOString(),
      fallback: true
    };
  },

  // Check if API server is running
  async checkApiStatus() {
    try {
      await this.getHealth();
      return true;
    } catch (error) {
      console.warn('⚠️ API server not available:', error.message);
      return false;
    }
  }
};

// Timeline-specific API functions
window.__timelineAPI = {
  // Load announcements for timeline page
  async loadAnnouncements(forceRefresh = false) {
    try {
      // Clear browser cache for fresh data when forcing refresh
      if (forceRefresh) {
        console.log('🔄 Triggering API refresh and cache clear...');
        
        // Clear relevant localStorage cache
        if (window.__storage) {
          const cacheKeys = ['api:announcements', 'api:last_fetch', 'timeline:cache'];
          cacheKeys.forEach(key => window.__storage.remove(key));
        }
        
        try {
          await window.__apiClient.refreshData();
          // Wait for refresh to complete
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (refreshError) {
          console.warn('⚠️ API refresh failed:', refreshError.message);
        }
      }

      // Get announcements with timeline-specific filters and cache-busting
      const filters = {
        limit: 10,
        status: 'active,upcoming',
        sort_by: 'date_published',
        sort_order: 'DESC',
        cache_bust: Date.now() // Add timestamp to prevent caching
      };

      const result = await window.__apiClient.getAnnouncements(filters);
      
      // If result is empty or failed, ensure we return fresh fallback data
      if (!result.success || !result.data || result.data.length === 0) {
        console.log('🔄 API returned no data, using updated fallback');
        return window.__apiClient.getFallbackAnnouncementData();
      }
      
      return result;
    } catch (error) {
      console.error('❌ Failed to load timeline announcements:', error.message);
      // Return fallback data on error
      return window.__apiClient.getFallbackAnnouncementData();
    }
  },

  // Add announcement to personal timeline
  addToPersonalTimeline(title, date, category) {
    try {
      const timelineItems = window.__storage.get('timeline:items', []);
      const newItem = {
        id: Date.now().toString(),
        title: title,
        date: date,
        category: category,
        added_at: new Date().toISOString(),
        source: 'api'
      };
      
      timelineItems.push(newItem);
      window.__storage.set('timeline:items', timelineItems);
      
      window.__showNotification(`Added "${title}" to your timeline!`, 'success');
      
      // Trigger timeline update if on timeline page
      if (window.location.pathname.includes('timeline') && window.applyFilter) {
        window.applyFilter();
      }
      
      return newItem;
    } catch (error) {
      console.error('❌ Failed to add to timeline:', error);
      window.__showNotification('Failed to add to timeline', 'error');
      throw error;
    }
  },

  // Get personal timeline items
  getPersonalTimeline() {
    return window.__storage.get('timeline:items', []);
  },

  // Remove from personal timeline
  removeFromPersonalTimeline(itemId) {
    try {
      const timelineItems = window.__storage.get('timeline:items', []);
      const filteredItems = timelineItems.filter(item => item.id !== itemId);
      window.__storage.set('timeline:items', filteredItems);
      
      window.__showNotification('Removed from timeline', 'info');
      
      // Trigger timeline update if on timeline page
      if (window.location.pathname.includes('timeline') && window.applyFilter) {
        window.applyFilter();
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to remove from timeline:', error);
      window.__showNotification('Failed to remove from timeline', 'error');
      return false;
    }
  },

  // Clear all personal timeline items
  clearPersonalTimeline() {
    try {
      window.__storage.set('timeline:items', []);
      window.__showNotification('Timeline cleared', 'info');
      
      // Trigger timeline update if on timeline page
      if (window.location.pathname.includes('timeline') && window.applyFilter) {
        window.applyFilter();
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to clear timeline:', error);
      window.__showNotification('Failed to clear timeline', 'error');
      return false;
    }
  },

  // Check API connectivity
  async checkConnectivity() {
    try {
      const isOnline = await window.__apiClient.checkApiStatus();
      return {
        online: isOnline,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        online: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
};

// Make timeline functions globally available
window.addToTimeline = function(title, date, category) {
  return window.__timelineAPI.addToPersonalTimeline(title, date, category);
};

window.loadTimelineAnnouncements = function(forceRefresh = false) {
  return window.__timelineAPI.loadAnnouncements(forceRefresh);
};

// Common validators
window.__validators = {
  required: (value) => value.length > 0 || 'This field is required',
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Please enter a valid email address';
  },
  minLength: (min) => (value) => value.length >= min || `Minimum ${min} characters required`,
  maxLength: (max) => (value) => value.length <= max || `Maximum ${max} characters allowed`
};