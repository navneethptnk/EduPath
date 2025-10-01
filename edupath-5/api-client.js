/**
 * EduPath API Client
 * Simple JavaScript client for interacting with the EduPath Unified API
 */

class EduPathAPIClient {
  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // Make HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'GET',
      headers: this.headers,
      ...options
    };

    try {
      console.log(`🌐 API Request: ${config.method} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ API Response: ${data.data?.length || data.count || 'success'} items`);
      
      return data;
    } catch (error) {
      console.error(`❌ API Error (${config.method} ${url}):`, error);
      throw error;
    }
  }

  // Get announcements with filters
  async getAnnouncements(filters = {}) {
    const params = new URLSearchParams();
    
    // Add filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    const endpoint = `/announcements${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // Get specific announcement by ID
  async getAnnouncement(id) {
    return this.request(`/announcements/${id}`);
  }

  // Search announcements
  async search(query, filters = {}) {
    const params = new URLSearchParams({ q: query });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });

    return this.request(`/search?${params.toString()}`);
  }

  // Get available categories
  async getCategories() {
    return this.request('/categories');
  }

  // Get API sources status
  async getSources() {
    return this.request('/sources');
  }

  // Get platform statistics
  async getStatistics() {
    return this.request('/statistics');
  }

  // Get trending announcements
  async getTrending(limit = 10) {
    return this.request(`/trending?limit=${limit}`);
  }

  // Track user interaction
  async trackInteraction(announcementId, action, userId = null) {
    return this.request('/track', {
      method: 'POST',
      body: JSON.stringify({
        announcement_id: announcementId,
        action: action,
        user_id: userId
      })
    });
  }

  // Check API health
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Set authentication header (for future use)
  setAuthToken(token) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.headers['Authorization'];
    }
  }

  // Convenience methods for common queries
  async getActiveExams(limit = 20) {
    return this.getAnnouncements({
      category: 'exam',
      status: ['upcoming', 'active'],
      limit: limit,
      sort_by: 'priority',
      sort_order: 'DESC'
    });
  }

  async getActiveScholarships(limit = 15) {
    return this.getAnnouncements({
      category: 'scholarship',
      status: ['upcoming', 'active'],
      limit: limit,
      sort_by: 'date_application_end',
      sort_order: 'ASC'
    });
  }

  async getUpcomingResults(limit = 10) {
    return this.getAnnouncements({
      category: 'result',
      status: 'upcoming',
      limit: limit,
      sort_by: 'date_result',
      sort_order: 'ASC'
    });
  }

  async getUrgentDeadlines(days = 7) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    return this.getAnnouncements({
      priority: 'urgent',
      status: ['upcoming', 'active'],
      application_deadline_to: endDate.toISOString().split('T')[0],
      limit: 50,
      sort_by: 'date_application_end',
      sort_order: 'ASC'
    });
  }
}

// Export for browser usage
if (typeof window !== 'undefined') {
  window.EduPathAPIClient = EduPathAPIClient;
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EduPathAPIClient;
}