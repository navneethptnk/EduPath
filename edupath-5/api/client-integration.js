/**
 * EduPath API Client Integration
 * JavaScript client for frontend integration
 */

class EduPathAPIClient {
  constructor(baseURL = 'http://localhost:3000/api', options = {}) {
    this.baseURL = baseURL.replace(/\/$/, '');
    this.apiKey = options.apiKey;
    this.timeout = options.timeout || 10000;
    this.cache = new Map();
    this.cacheTimeout = options.cacheTimeout || 5 * 60 * 1000; // 5 minutes
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${url}?${new URLSearchParams(options.params || {})}`;
    
    // Check cache first (for GET requests)
    if (options.method !== 'POST' && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'X-API-Key': this.apiKey }),
        ...options.headers
      },
      signal: AbortSignal.timeout(this.timeout)
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    if (options.params) {
      const urlParams = new URLSearchParams(options.params);
      const separator = url.includes('?') ? '&' : '?';
      const finalUrl = `${url}${separator}${urlParams}`;
      
      try {
        const response = await fetch(finalUrl, config);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}`);
        }

        // Cache successful GET requests
        if (config.method === 'GET') {
          this.cache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
          });
        }

        return data;
      } catch (error) {
        throw new Error(`API Request failed: ${error.message}`);
      }
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      throw new Error(`API Request failed: ${error.message}`);
    }
  }

  // Get announcements with filters
  async getAnnouncements(filters = {}) {
    return await this.request('/announcements', { params: filters });
  }

  // Search announcements
  async searchAnnouncements(query, filters = {}) {
    return await this.request('/search', { 
      params: { q: query, ...filters } 
    });
  }

  // Get specific announcement
  async getAnnouncement(id) {
    return await this.request(`/announcements/${id}`);
  }

  // Get trending announcements
  async getTrending() {
    return await this.request('/trending');
  }

  // Get categories
  async getCategories() {
    return await this.request('/categories');
  }

  // Track user interaction
  async trackInteraction(announcementId, action, userId = null) {
    return await this.request('/track', {
      method: 'POST',
      body: {
        announcement_id: announcementId,
        action: action,
        user_id: userId
      }
    });
  }

  // Get API statistics
  async getStatistics() {
    return await this.request('/statistics');
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Helper methods for common use cases
  
  // Get active exam announcements
  async getActiveExams(filters = {}) {
    return await this.getAnnouncements({
      category: 'exam',
      status: ['active', 'upcoming'],
      ...filters
    });
  }

  // Get scholarship opportunities
  async getScholarships(filters = {}) {
    return await this.getAnnouncements({
      category: 'scholarship',
      status: ['active', 'upcoming'],
      ...filters
    });
  }

  // Get admission notifications
  async getAdmissions(filters = {}) {
    return await this.getAnnouncements({
      category: 'admission',
      status: ['active', 'upcoming'],
      ...filters
    });
  }

  // Get announcements by state
  async getAnnouncementsByState(state, filters = {}) {
    return await this.getAnnouncements({
      state: state,
      ...filters
    });
  }

  // Get urgent announcements
  async getUrgentAnnouncements(filters = {}) {
    return await this.getAnnouncements({
      priority: 'urgent',
      status: ['active', 'upcoming'],
      ...filters
    });
  }
}

// Frontend Integration Example for EduPath Timeline
class TimelineIntegration {
  constructor(apiClient) {
    this.api = apiClient;
    this.updateInterval = null;
    this.lastUpdate = null;
  }

  // Initialize timeline with API data
  async initializeTimeline() {
    try {
      console.log('Loading government exam data from API...');
      
      // Get active and upcoming announcements
      const response = await this.api.getAnnouncements({
        status: ['active', 'upcoming'],
        limit: 50,
        sort_by: 'date_application_end',
        sort_order: 'ASC'
      });

      this.renderExamAnnouncements(response.data);
      this.lastUpdate = new Date();
      
      // Set up auto-refresh every 30 minutes
      this.startAutoRefresh();
      
    } catch (error) {
      console.error('Failed to load exam data:', error);
      this.showErrorMessage(error.message);
    }
  }

  renderExamAnnouncements(announcements) {
    const container = document.getElementById('exam-announcements');
    if (!container) return;

    if (announcements.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8">
          <div class="text-4xl mb-2">📚</div>
          <p class="text-gray-600">No upcoming announcements available.</p>
        </div>
      `;
      return;
    }

    const groupedAnnouncements = this.groupAnnouncementsByCategory(announcements);
    
    container.innerHTML = `
      <div class="space-y-6">
        ${Object.entries(groupedAnnouncements).map(([category, items]) => `
          <div class="category-section">
            <h3 class="text-lg font-semibold mb-3 capitalize">${category} Announcements</h3>
            <div class="grid gap-4 md:grid-cols-2">
              ${items.map(announcement => this.createAnnouncementCard(announcement)).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="text-center mt-6">
        <button onclick="timelineIntegration.loadMoreAnnouncements()" class="btn-secondary">
          Load More Announcements
        </button>
      </div>
    `;

    // Add event listeners for tracking
    this.attachEventListeners();
  }

  groupAnnouncementsByCategory(announcements) {
    return announcements.reduce((groups, announcement) => {
      const category = announcement.category || 'other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(announcement);
      return groups;
    }, {});
  }

  createAnnouncementCard(announcement) {
    const status = this.getDisplayStatus(announcement);
    const dates = this.formatDates(announcement);
    
    return `
      <div class="announcement-card bg-white rounded-lg border p-4 hover:shadow-md transition-shadow" 
           data-announcement-id="${announcement.id}">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h4 class="font-bold text-gray-900 mb-1">${announcement.title}</h4>
            <p class="text-sm text-gray-600">${announcement.source_name}</p>
          </div>
          <span class="px-2 py-1 rounded-full text-xs font-medium ${status.colorClass}">
            ${status.icon} ${status.text}
          </span>
        </div>
        
        <div class="space-y-2 text-sm mb-4">
          ${dates.application ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Application:</span>
              <span class="font-medium">${dates.application}</span>
            </div>
          ` : ''}
          ${dates.exam ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Exam Date:</span>
              <span class="font-medium">${dates.exam}</span>
            </div>
          ` : ''}
          ${announcement.eligibility ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Eligibility:</span>
              <span class="font-medium text-right">${this.getEligibilityText(announcement.eligibility)}</span>
            </div>
          ` : ''}
        </div>
        
        ${announcement.description ? `
          <p class="text-sm text-gray-700 mb-4 line-clamp-2">${announcement.description}</p>
        ` : ''}
        
        <div class="flex gap-2">
          ${announcement.links?.official_url ? `
            <a href="${announcement.links.official_url}" target="_blank" 
               class="btn-primary text-xs flex-1 text-center"
               onclick="timelineIntegration.trackClick('${announcement.id}', 'official_website')">
              Official Website
            </a>
          ` : ''}
          <button onclick="timelineIntegration.addToPersonalTimeline('${announcement.id}')" 
                  class="btn-secondary text-xs flex-1">
            Add to Timeline
          </button>
        </div>
      </div>
    `;
  }

  getDisplayStatus(announcement) {
    const now = new Date();
    const appEnd = announcement.date_application_end ? new Date(announcement.date_application_end) : null;
    const examDate = announcement.date_exam ? new Date(announcement.date_exam) : null;

    if (announcement.status === 'active' && appEnd) {
      const daysLeft = Math.ceil((appEnd - now) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 7) {
        return {
          text: `${daysLeft} days to apply`,
          colorClass: 'bg-red-100 text-red-800',
          icon: '🚨'
        };
      } else {
        return {
          text: `${daysLeft} days to apply`,
          colorClass: 'bg-green-100 text-green-800',
          icon: '✅'
        };
      }
    } else if (announcement.status === 'upcoming') {
      return {
        text: 'Coming Soon',
        colorClass: 'bg-blue-100 text-blue-800',
        icon: '⏰'
      };
    } else if (announcement.status === 'closed' && examDate) {
      const daysToExam = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));
      return {
        text: `Exam in ${daysToExam} days`,
        colorClass: 'bg-yellow-100 text-yellow-800',
        icon: '📝'
      };
    }

    return {
      text: announcement.status,
      colorClass: 'bg-gray-100 text-gray-800',
      icon: '📋'
    };
  }

  formatDates(announcement) {
    const formatDate = (dateString) => {
      if (!dateString) return null;
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    };

    const dates = {};
    
    if (announcement.date_application_start && announcement.date_application_end) {
      dates.application = `${formatDate(announcement.date_application_start)} - ${formatDate(announcement.date_application_end)}`;
    } else if (announcement.date_application_end) {
      dates.application = `Deadline: ${formatDate(announcement.date_application_end)}`;
    }

    if (announcement.date_exam) {
      dates.exam = formatDate(announcement.date_exam);
    }

    return dates;
  }

  getEligibilityText(eligibility) {
    if (typeof eligibility === 'string') {
      try {
        eligibility = JSON.parse(eligibility);
      } catch {
        return eligibility;
      }
    }

    if (eligibility.education_level) {
      return eligibility.education_level;
    }

    return 'See notification';
  }

  async addToPersonalTimeline(announcementId) {
    try {
      const announcement = await this.api.getAnnouncement(announcementId);
      
      if (!announcement.success) {
        throw new Error('Announcement not found');
      }

      const data = announcement.data;
      const deadline = data.date_application_end || data.date_exam;
      
      if (!deadline) {
        throw new Error('No deadline found for this announcement');
      }

      // Add to local timeline (integrate with your existing timeline code)
      const timelineItem = {
        title: `${data.title} - Deadline`,
        date: deadline.split('T')[0], // Convert to YYYY-MM-DD format
        category: 'Exam'
      };

      // Call your existing timeline functions
      if (window.addTimelineItem) {
        window.addTimelineItem(timelineItem);
      }

      // Track the action
      await this.api.trackInteraction(announcementId, 'add_to_timeline');

      // Show success message
      if (window.__showNotification) {
        window.__showNotification('Added to your personal timeline!', 'success');
      }

    } catch (error) {
      console.error('Failed to add to timeline:', error);
      if (window.__showNotification) {
        window.__showNotification('Failed to add to timeline', 'error');
      }
    }
  }

  async trackClick(announcementId, action) {
    try {
      await this.api.trackInteraction(announcementId, action);
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }
  }

  attachEventListeners() {
    // Track views for announcements in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const announcementId = entry.target.dataset.announcementId;
          if (announcementId) {
            this.api.trackInteraction(announcementId, 'view').catch(console.error);
          }
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.announcement-card').forEach(card => {
      observer.observe(card);
    });
  }

  startAutoRefresh() {
    // Refresh every 30 minutes
    this.updateInterval = setInterval(() => {
      this.initializeTimeline();
    }, 30 * 60 * 1000);
  }

  stopAutoRefresh() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  showErrorMessage(message) {
    const container = document.getElementById('exam-announcements');
    if (container) {
      container.innerHTML = `
        <div class="text-center py-8">
          <div class="text-4xl mb-2">⚠️</div>
          <p class="text-gray-600 mb-4">Failed to load exam data: ${message}</p>
          <button onclick="timelineIntegration.initializeTimeline()" class="btn-primary">
            Try Again
          </button>
        </div>
      `;
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize API client
  const apiClient = new EduPathAPIClient('http://localhost:3000/api');
  
  // Initialize timeline integration
  window.timelineIntegration = new TimelineIntegration(apiClient);
  
  // Load initial data
  window.timelineIntegration.initializeTimeline();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EduPathAPIClient, TimelineIntegration };
}