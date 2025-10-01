/**
 * EduPath Unified API Server
 * REST API for education announcements aggregation
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

const DataAggregator = require('./data-aggregator');
const Database = require('./database');

class EduPathAPI {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.aggregator = new DataAggregator();
    this.db = new Database();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Security
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: { error: 'Too many requests, please try again later' }
    });
    this.app.use('/api/', limiter);

    // Compression
    this.app.use(compression());

    // Logging
    this.app.use(morgan('combined'));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    });

    // Root endpoint with API documentation dashboard
    this.app.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>EduPath Unified API</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 1200px; margin: 0 auto; background: white; min-height: 100vh; }
            .header { background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); color: white; padding: 40px; text-align: center; }
            .content { padding: 40px; }
            h1 { margin: 0; font-size: 2.5em; font-weight: 300; }
            h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-top: 40px; }
            .subtitle { opacity: 0.9; margin-top: 10px; font-size: 1.2em; }
            .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin: 30px 0; }
            .stat-card { background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .stat-card h3 { margin: 0 0 10px 0; font-size: 1.1em; opacity: 0.9; }
            .stat-card .number { font-size: 2em; font-weight: bold; }
            .endpoint { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #3498db; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
            .method { display: inline-block; background: #27ae60; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 0.9em; }
            .url { font-family: 'Monaco', 'Menlo', monospace; background: #2c3e50; color: white; padding: 3px 8px; border-radius: 4px; margin-left: 10px; }
            .sample { background: white; border: 1px solid #ddd; padding: 15px; border-radius: 4px; margin: 10px 0; }
            .sample a { color: #3498db; text-decoration: none; }
            .sample a:hover { text-decoration: underline; }
            .nav { display: flex; gap: 15px; margin-top: 20px; }
            .nav a { background: rgba(255,255,255,0.2); color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; transition: all 0.3s; }
            .nav a:hover { background: rgba(255,255,255,0.3); }
            .filters { background: #ecf0f1; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .filter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
            .filter-item { background: white; padding: 15px; border-radius: 6px; }
            .filter-item strong { color: #2c3e50; }
            .status-indicator { display: inline-block; width: 8px; height: 8px; background: #27ae60; border-radius: 50%; margin-right: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 EduPath Unified API</h1>
              <div class="subtitle">Comprehensive education announcements aggregator for India</div>
              <div class="nav">
                <a href="/">🏠 Dashboard</a>
                <a href="/api/announcements">📢 Announcements</a>
                <a href="/api/sources">📊 Sources</a>
                <a href="/health">❤️ Health</a>
              </div>
            </div>
            
            <div class="content">
              <div class="stats">
                <div class="stat-card">
                  <h3>🏛️ Data Sources</h3>
                  <div class="number">5</div>
                  <p>NTA • UPSC • SSC • NSP • CBSE</p>
                </div>
                <div class="stat-card">
                  <h3>📚 Categories</h3>
                  <div class="number">5</div>
                  <p>Exams • Scholarships • Admissions • Results</p>
                </div>
                <div class="stat-card">
                  <h3>🔄 Auto Updates</h3>
                  <div class="number">6h</div>
                  <p>Automatic data refresh</p>
                </div>
                <div class="stat-card">
                  <h3>⚙️ Status</h3>
                  <div class="number"><span class="status-indicator"></span>Live</div>
                  <p>API is operational</p>
                </div>
              </div>
              
              <h2>🚀 Quick Start Examples</h2>
              
              <div class="endpoint">
                <span class="method">GET</span><span class="url">/api/announcements</span>
                <p>Get all announcements with optional filters</p>
                <div class="sample">
                  🔗 <a href="/api/announcements?category=exam&status=active&limit=5" target="_blank">View Active Exams</a> |
                  <a href="/api/announcements?category=scholarship&limit=3" target="_blank">View Scholarships</a> |
                  <a href="/api/announcements?priority=high" target="_blank">High Priority</a>
                </div>
              </div>
              
              <div class="endpoint">
                <span class="method">GET</span><span class="url">/api/search</span>
                <p>Search announcements by text keywords</p>
                <div class="sample">
                  🔍 <a href="/api/search?q=JEE&limit=3" target="_blank">Search "JEE"</a> |
                  <a href="/api/search?q=scholarship&category=scholarship" target="_blank">Search Scholarships</a> |
                  <a href="/api/search?q=UPSC" target="_blank">Search "UPSC"</a>
                </div>
              </div>
              
              <div class="endpoint">
                <span class="method">GET</span><span class="url">/api/categories</span>
                <p>Get available categories and subcategories</p>
                <div class="sample">
                  📊 <a href="/api/categories" target="_blank">View All Categories</a>
                </div>
              </div>
              
              <div class="endpoint">
                <span class="method">GET</span><span class="url">/api/sources</span>
                <p>Get data source status and error logs</p>
                <div class="sample">
                  🏛️ <a href="/api/sources" target="_blank">View Source Health</a>
                </div>
              </div>
              
              <div class="filters">
                <h2>🔍 Available Filters</h2>
                <div class="filter-grid">
                  <div class="filter-item">
                    <strong>category:</strong><br>
                    exam, admission, scholarship, notification, result
                  </div>
                  <div class="filter-item">
                    <strong>status:</strong><br>
                    upcoming, active, closed, completed, cancelled
                  </div>
                  <div class="filter-item">
                    <strong>priority:</strong><br>
                    low, medium, high, urgent
                  </div>
                  <div class="filter-item">
                    <strong>scope:</strong><br>
                    national, state, regional, institutional
                  </div>
                  <div class="filter-item">
                    <strong>source:</strong><br>
                    nta, upsc, ssc, nsp, cbse
                  </div>
                  <div class="filter-item">
                    <strong>Other params:</strong><br>
                    search, limit, page, sort_by, date_from, date_to
                  </div>
                </div>
              </div>
              
              <h2>📖 Integration</h2>
              <p>Use this API to power your education platform, mobile app, or website. All data is automatically normalized and kept up-to-date from official government sources.</p>
              
              <div class="sample">
                <strong>JavaScript Example:</strong><br>
                <code>fetch('/api/announcements?category=exam&status=active').then(r => r.json()).then(data => console.log(data));</code>
              </div>
            </div>
          </div>
        </body>
        </html>
      `);
    });

    // API documentation
    this.app.get('/api', (req, res) => {
      res.json({
        name: 'EduPath Unified API',
        version: '1.0.0',
        description: 'Aggregated education announcements API for India',
        endpoints: {
          'GET /api/announcements': 'Get filtered announcements',
          'GET /api/announcements/:id': 'Get specific announcement',
          'GET /api/categories': 'Get available categories',
          'GET /api/sources': 'Get data sources information',
          'GET /api/statistics': 'Get platform statistics',
          'POST /api/refresh': 'Trigger data refresh',
          'POST /api/track': 'Track user interaction'
        },
        filters: {
          category: ['exam', 'admission', 'scholarship', 'notification', 'result'],
          status: ['upcoming', 'active', 'closed', 'completed', 'cancelled'],
          priority: ['low', 'medium', 'high', 'urgent'],
          scope: ['national', 'state', 'regional', 'institutional']
        }
      });
    });

    // Get announcements with filters
    this.app.get('/api/announcements', async (req, res) => {
      try {
        const filters = this.parseFilters(req.query);
        const announcements = await this.db.searchAnnouncements(filters);
        
        // Track popular searches
        if (req.query.search) {
          // Log search query for analytics
          console.log(`Search query: "${req.query.search}" - Results: ${announcements.length}`);
        }

        res.json({
          success: true,
          data: announcements,
          count: announcements.length,
          filters: filters,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch announcements',
          message: error.message
        });
      }
    });

    // Get specific announcement
    this.app.get('/api/announcements/:id', async (req, res) => {
      try {
        const announcement = await this.db.getAnnouncementById(req.params.id);
        
        if (!announcement) {
          return res.status(404).json({
            success: false,
            error: 'Announcement not found'
          });
        }

        // Track view
        await this.db.trackInteraction(req.params.id, req.ip, 'view');

        res.json({
          success: true,
          data: announcement,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error fetching announcement:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch announcement',
          message: error.message
        });
      }
    });

    // Get available categories and subcategories
    this.app.get('/api/categories', async (req, res) => {
      try {
        const announcements = await this.db.searchAnnouncements({});
        
        const categories = {};
        announcements.forEach(announcement => {
          if (!categories[announcement.category]) {
            categories[announcement.category] = new Set();
          }
          if (announcement.subcategory) {
            categories[announcement.category].add(announcement.subcategory);
          }
        });

        // Convert Sets to Arrays
        Object.keys(categories).forEach(category => {
          categories[category] = Array.from(categories[category]);
        });

        res.json({
          success: true,
          data: categories,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch categories',
          message: error.message
        });
      }
    });

    // Get data sources information
    this.app.get('/api/sources', (req, res) => {
      try {
        const sources = this.aggregator.getSourceStatus();
        const errorLog = this.aggregator.getErrorLog();

        res.json({
          success: true,
          data: {
            sources: sources,
            recent_errors: errorLog.slice(-10), // Last 10 errors
            last_update: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Error fetching sources:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch sources information',
          message: error.message
        });
      }
    });

    // Get platform statistics
    this.app.get('/api/statistics', async (req, res) => {
      try {
        const stats = await this.db.getStatistics();
        
        res.json({
          success: true,
          data: stats,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch statistics',
          message: error.message
        });
      }
    });

    // Trigger data refresh (protected endpoint)
    this.app.post('/api/refresh', async (req, res) => {
      try {
        // In production, add authentication/authorization here
        const apiKey = req.headers['x-api-key'];
        if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
          return res.status(401).json({
            success: false,
            error: 'Unauthorized'
          });
        }

        console.log('Manual refresh triggered');
        const result = await this.aggregator.triggerUpdate();
        
        // Save to database
        if (result.announcements.length > 0) {
          const dbResult = await this.db.insertAnnouncements(result.announcements);
          result.database = dbResult;
        }

        res.json({
          success: true,
          data: result,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error during refresh:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to refresh data',
          message: error.message
        });
      }
    });

    // Track user interactions
    this.app.post('/api/track', async (req, res) => {
      try {
        const { announcement_id, action, user_id } = req.body;
        
        if (!announcement_id || !action) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: announcement_id, action'
          });
        }

        const validActions = ['view', 'bookmark', 'share', 'click', 'apply'];
        if (!validActions.includes(action)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid action. Valid actions: ' + validActions.join(', ')
          });
        }

        await this.db.trackInteraction(announcement_id, user_id || req.ip, action);

        res.json({
          success: true,
          message: 'Interaction tracked successfully'
        });
      } catch (error) {
        console.error('Error tracking interaction:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to track interaction',
          message: error.message
        });
      }
    });

    // Search endpoint with advanced features
    this.app.get('/api/search', async (req, res) => {
      try {
        const { q, ...filters } = req.query;
        
        if (!q) {
          return res.status(400).json({
            success: false,
            error: 'Search query (q) is required'
          });
        }

        const searchFilters = {
          ...this.parseFilters(filters),
          search: q,
          limit: parseInt(filters.limit) || 20
        };

        const announcements = await this.db.searchAnnouncements(searchFilters);

        res.json({
          success: true,
          data: announcements,
          query: q,
          count: announcements.length,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({
          success: false,
          error: 'Search failed',
          message: error.message
        });
      }
    });

    // Trending/Popular announcements
    this.app.get('/api/trending', async (req, res) => {
      try {
        // Get announcements with high interaction counts
        const announcements = await this.db.searchAnnouncements({
          status: ['active', 'upcoming'],
          priority: ['high', 'urgent'],
          limit: 10,
          sort_by: 'date_published',
          sort_order: 'DESC'
        });

        res.json({
          success: true,
          data: announcements,
          count: announcements.length,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error fetching trending:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch trending announcements',
          message: error.message
        });
      }
    });
  }

  parseFilters(query) {
    const filters = {};

    // Category filters
    if (query.category) filters.category = query.category;
    if (query.subcategory) filters.subcategory = query.subcategory;
    
    // Status filters
    if (query.status) {
      filters.status = Array.isArray(query.status) ? query.status : [query.status];
    }
    
    // Priority filter
    if (query.priority) filters.priority = query.priority;
    
    // Geographic filters
    if (query.scope) filters.scope = query.scope;
    if (query.state) filters.state = query.state;
    
    // Source filter
    if (query.source) filters.source = query.source;
    
    // Date filters
    if (query.date_from) filters.date_from = query.date_from;
    if (query.date_to) filters.date_to = query.date_to;
    if (query.application_deadline_from) filters.application_deadline_from = query.application_deadline_from;
    if (query.application_deadline_to) filters.application_deadline_to = query.application_deadline_to;
    
    // Search filter
    if (query.search) filters.search = query.search;
    
    // Tags filter
    if (query.tags) {
      filters.tags = Array.isArray(query.tags) ? query.tags : query.tags.split(',');
    }
    
    // Pagination
    if (query.limit) filters.limit = parseInt(query.limit);
    if (query.offset) filters.offset = parseInt(query.offset);
    if (query.page) {
      const page = parseInt(query.page);
      const limit = parseInt(query.limit) || 20;
      filters.limit = limit;
      filters.offset = (page - 1) * limit;
    }
    
    // Sorting
    if (query.sort_by) filters.sort_by = query.sort_by;
    if (query.sort_order) filters.sort_order = query.sort_order.toUpperCase();

    return filters;
  }

  setupErrorHandling() {
    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        available_endpoints: '/api for documentation'
      });
    });

    // Global error handler
    this.app.use((err, req, res, next) => {
      console.error('Global error handler:', err);
      
      res.status(err.status || 500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
      });
    });
  }

  async start() {
    try {
      // Initial data load
      console.log('Loading initial data...');
      const result = await this.aggregator.triggerUpdate();
      console.log(`Initial load: ${result.summary.total_announcements} announcements`);
      
      // Save to database
      if (result.announcements.length > 0) {
        await this.db.insertAnnouncements(result.announcements);
        console.log('Initial data saved to database');
      }

      // Start server
      this.app.listen(this.port, () => {
        console.log(`\n🚀 EduPath API Server running on port ${this.port}`);
        console.log(`📖 API Documentation: http://localhost:${this.port}/api`);
        console.log(`🔍 Health Check: http://localhost:${this.port}/health`);
        console.log(`📊 Example: http://localhost:${this.port}/api/announcements?category=exam&status=active&limit=5`);
      });

    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  async stop() {
    console.log('Stopping EduPath API Server...');
    this.db.close();
    process.exit(0);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  if (global.apiServer) {
    await global.apiServer.stop();
  }
});

process.on('SIGINT', async () => {
  console.log('SIGINT received');
  if (global.apiServer) {
    await global.apiServer.stop();
  }
});

// Start server if this file is run directly
if (require.main === module) {
  const server = new EduPathAPI();
  global.apiServer = server;
  server.start();
}

module.exports = EduPathAPI;