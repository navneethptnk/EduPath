/**
 * EduPath Database Layer
 * Handles data storage, indexing, and retrieval
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor(dbPath = './edupath_announcements.db') {
    this.dbPath = dbPath;
    this.db = null;
    this.init();
  }

  init() {
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database');
        this.createTables();
        this.createIndexes();
      }
    });
  }

  createTables() {
    const createAnnouncementsTable = `
      CREATE TABLE IF NOT EXISTS announcements (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        subcategory TEXT,
        
        -- Source information
        source_name TEXT NOT NULL,
        source_url TEXT NOT NULL,
        source_type TEXT,
        credibility_score INTEGER,
        
        -- Dates (stored as ISO strings for SQLite compatibility)
        date_published TEXT NOT NULL,
        date_application_start TEXT,
        date_application_end TEXT,
        date_exam TEXT,
        date_result TEXT,
        date_last_updated TEXT NOT NULL,
        
        -- Geography
        country TEXT DEFAULT 'India',
        states TEXT, -- JSON array as string
        regions TEXT, -- JSON array as string
        scope TEXT,
        
        -- Eligibility (stored as JSON)
        eligibility TEXT, -- JSON object as string
        
        -- Financial information (stored as JSON)
        financial TEXT, -- JSON object as string
        
        -- Links (stored as JSON)
        links TEXT, -- JSON object as string
        
        -- Status and priority
        status TEXT NOT NULL,
        priority TEXT NOT NULL,
        
        -- Tags and metadata
        tags TEXT, -- JSON array as string
        metadata TEXT, -- JSON object as string
        
        -- Timestamps
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createSourcesTable = `
      CREATE TABLE IF NOT EXISTS sources (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        type TEXT,
        format TEXT,
        category TEXT,
        credibility_score INTEGER,
        update_frequency INTEGER,
        last_fetch TEXT,
        last_success TEXT,
        error_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createErrorLogsTable = `
      CREATE TABLE IF NOT EXISTS error_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_id TEXT,
        error_message TEXT,
        error_details TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        resolved BOOLEAN DEFAULT 0
      )
    `;

    const createUserInteractionsTable = `
      CREATE TABLE IF NOT EXISTS user_interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        announcement_id TEXT,
        user_id TEXT,
        action TEXT, -- 'view', 'bookmark', 'share', 'click'
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (announcement_id) REFERENCES announcements (id)
      )
    `;

    this.db.serialize(() => {
      this.db.run(createAnnouncementsTable);
      this.db.run(createSourcesTable);
      this.db.run(createErrorLogsTable);
      this.db.run(createUserInteractionsTable);
    });
  }

  createIndexes() {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_announcements_category ON announcements(category)',
      'CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status)',
      'CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority)',
      'CREATE INDEX IF NOT EXISTS idx_announcements_date_published ON announcements(date_published)',
      'CREATE INDEX IF NOT EXISTS idx_announcements_date_application_end ON announcements(date_application_end)',
      'CREATE INDEX IF NOT EXISTS idx_announcements_scope ON announcements(scope)',
      'CREATE INDEX IF NOT EXISTS idx_announcements_source_name ON announcements(source_name)',
      'CREATE INDEX IF NOT EXISTS idx_user_interactions_announcement_id ON user_interactions(announcement_id)',
      'CREATE INDEX IF NOT EXISTS idx_error_logs_source_id ON error_logs(source_id)'
    ];

    this.db.serialize(() => {
      indexes.forEach(indexSQL => {
        this.db.run(indexSQL);
      });
    });
  }

  // Insert or update announcement
  async upsertAnnouncement(announcement) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT OR REPLACE INTO announcements (
          id, title, description, category, subcategory,
          source_name, source_url, source_type, credibility_score,
          date_published, date_application_start, date_application_end, 
          date_exam, date_result, date_last_updated,
          country, states, regions, scope,
          eligibility, financial, links,
          status, priority, tags, metadata,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        announcement.id,
        announcement.title,
        announcement.description || null,
        announcement.category,
        announcement.subcategory || null,
        announcement.source.name,
        announcement.source.url,
        announcement.source.type || null,
        announcement.source.credibility_score || null,
        announcement.dates.published.toISOString(),
        announcement.dates.application_start?.toISOString() || null,
        announcement.dates.application_end?.toISOString() || null,
        announcement.dates.exam_date?.toISOString() || null,
        announcement.dates.result_date?.toISOString() || null,
        announcement.dates.last_updated.toISOString(),
        announcement.geography?.country || 'India',
        JSON.stringify(announcement.geography?.states || []),
        JSON.stringify(announcement.geography?.regions || []),
        announcement.geography?.scope || null,
        JSON.stringify(announcement.eligibility || {}),
        JSON.stringify(announcement.financial || {}),
        JSON.stringify(announcement.links || {}),
        announcement.status,
        announcement.priority,
        JSON.stringify(announcement.tags || []),
        JSON.stringify(announcement.metadata || {}),
        new Date().toISOString()
      ];

      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: announcement.id, changes: this.changes });
        }
      });
    });
  }

  // Batch insert announcements
  async insertAnnouncements(announcements) {
    const results = [];
    const errors = [];

    for (const announcement of announcements) {
      try {
        const result = await this.upsertAnnouncement(announcement);
        results.push(result);
      } catch (error) {
        errors.push({
          announcement_id: announcement.id,
          error: error.message
        });
      }
    }

    return { results, errors };
  }

  // Search announcements with filters
  async searchAnnouncements(filters = {}) {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT 
          id, title, description, category, subcategory,
          source_name, source_url, source_type, credibility_score,
          date_published, date_application_start, date_application_end,
          date_exam, date_result, date_last_updated,
          country, states, regions, scope,
          eligibility, financial, links,
          status, priority, tags, metadata,
          created_at, updated_at
        FROM announcements 
        WHERE 1=1
      `;

      const params = [];
      const conditions = [];

      // Apply filters
      if (filters.category) {
        conditions.push('category = ?');
        params.push(filters.category);
      }

      if (filters.subcategory) {
        conditions.push('subcategory = ?');
        params.push(filters.subcategory);
      }

      if (filters.status) {
        if (Array.isArray(filters.status)) {
          conditions.push(`status IN (${filters.status.map(() => '?').join(',')})`);
          params.push(...filters.status);
        } else {
          conditions.push('status = ?');
          params.push(filters.status);
        }
      }

      if (filters.priority) {
        conditions.push('priority = ?');
        params.push(filters.priority);
      }

      if (filters.scope) {
        conditions.push('scope = ?');
        params.push(filters.scope);
      }

      if (filters.source) {
        conditions.push('source_name = ?');
        params.push(filters.source);
      }

      if (filters.state) {
        conditions.push('(states LIKE ? OR scope = "national")');
        params.push(`%"${filters.state}"%`);
      }

      if (filters.date_from) {
        conditions.push('date_published >= ?');
        params.push(filters.date_from);
      }

      if (filters.date_to) {
        conditions.push('date_published <= ?');
        params.push(filters.date_to);
      }

      if (filters.application_deadline_from) {
        conditions.push('date_application_end >= ?');
        params.push(filters.application_deadline_from);
      }

      if (filters.application_deadline_to) {
        conditions.push('date_application_end <= ?');
        params.push(filters.application_deadline_to);
      }

      if (filters.search) {
        conditions.push('(title LIKE ? OR description LIKE ?)');
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      if (filters.tags) {
        const tagConditions = filters.tags.map(() => 'tags LIKE ?');
        conditions.push(`(${tagConditions.join(' OR ')})`);
        filters.tags.forEach(tag => params.push(`%"${tag}"%`));
      }

      // Add conditions to SQL
      if (conditions.length > 0) {
        sql += ' AND ' + conditions.join(' AND ');
      }

      // Sorting
      const sortBy = filters.sort_by || 'date_published';
      const sortOrder = filters.sort_order || 'DESC';
      sql += ` ORDER BY ${sortBy} ${sortOrder}`;

      // Pagination
      if (filters.limit) {
        sql += ' LIMIT ?';
        params.push(filters.limit);

        if (filters.offset) {
          sql += ' OFFSET ?';
          params.push(filters.offset);
        }
      }

      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Parse JSON fields
          const announcements = rows.map(row => ({
            ...row,
            states: JSON.parse(row.states || '[]'),
            regions: JSON.parse(row.regions || '[]'),
            eligibility: JSON.parse(row.eligibility || '{}'),
            financial: JSON.parse(row.financial || '{}'),
            links: JSON.parse(row.links || '{}'),
            tags: JSON.parse(row.tags || '[]'),
            metadata: JSON.parse(row.metadata || '{}')
          }));
          resolve(announcements);
        }
      });
    });
  }

  // Get announcement by ID
  async getAnnouncementById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM announcements WHERE id = ?
      `;

      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          // Parse JSON fields
          const announcement = {
            ...row,
            states: JSON.parse(row.states || '[]'),
            regions: JSON.parse(row.regions || '[]'),
            eligibility: JSON.parse(row.eligibility || '{}'),
            financial: JSON.parse(row.financial || '{}'),
            links: JSON.parse(row.links || '{}'),
            tags: JSON.parse(row.tags || '[]'),
            metadata: JSON.parse(row.metadata || '{}')
          };
          resolve(announcement);
        }
      });
    });
  }

  // Track user interaction
  async trackInteraction(announcementId, userId, action) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO user_interactions (announcement_id, user_id, action)
        VALUES (?, ?, ?)
      `;

      this.db.run(sql, [announcementId, userId, action], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }

  // Get statistics
  async getStatistics() {
    return new Promise((resolve, reject) => {
      const queries = {
        total_announcements: 'SELECT COUNT(*) as count FROM announcements',
        by_category: 'SELECT category, COUNT(*) as count FROM announcements GROUP BY category',
        by_status: 'SELECT status, COUNT(*) as count FROM announcements GROUP BY status',
        by_priority: 'SELECT priority, COUNT(*) as count FROM announcements GROUP BY priority',
        recent_announcements: 'SELECT COUNT(*) as count FROM announcements WHERE date_published >= date("now", "-7 days")',
        active_applications: 'SELECT COUNT(*) as count FROM announcements WHERE status = "active"'
      };

      const stats = {};
      let completed = 0;
      const total = Object.keys(queries).length;

      Object.entries(queries).forEach(([key, query]) => {
        this.db.all(query, [], (err, rows) => {
          if (err) {
            stats[key] = { error: err.message };
          } else {
            stats[key] = rows;
          }

          completed++;
          if (completed === total) {
            resolve(stats);
          }
        });
      });
    });
  }

  // Clean up old data
  async cleanup(daysToKeep = 365) {
    return new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM announcements 
        WHERE date_published < date('now', '-${daysToKeep} days')
        AND status = 'completed'
      `;

      this.db.run(sql, [], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted_count: this.changes });
        }
      });
    });
  }

  // Close database connection
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

module.exports = Database;