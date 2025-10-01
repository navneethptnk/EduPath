/**
 * EduPath API Monitoring and Data Quality System
 * Handles source monitoring, data validation, and alerting
 */

class SourceMonitor {
  constructor(db, aggregator) {
    this.db = db;
    this.aggregator = aggregator;
    this.alerts = [];
    this.dataQualityThresholds = {
      minQualityScore: 6,
      maxErrorRate: 0.1,
      minDataFreshness: 48 // hours
    };
  }

  // Monitor all sources for issues
  async monitorSources() {
    const sources = this.aggregator.getSourceStatus();
    const issues = [];

    for (const source of sources) {
      const issue = await this.checkSourceHealth(source);
      if (issue) {
        issues.push(issue);
      }
    }

    if (issues.length > 0) {
      await this.handleIssues(issues);
    }

    return {
      healthy_sources: sources.length - issues.length,
      total_sources: sources.length,
      issues: issues,
      last_check: new Date().toISOString()
    };
  }

  async checkSourceHealth(source) {
    const issues = [];

    // Check last fetch time
    if (source.last_fetch) {
      const hoursSinceLastFetch = (Date.now() - new Date(source.last_fetch)) / (1000 * 60 * 60);
      if (hoursSinceLastFetch > source.update_frequency * 2) {
        issues.push(`Source ${source.name} hasn't been updated in ${Math.round(hoursSinceLastFetch)} hours`);
      }
    }

    // Check data quality
    const recentData = await this.db.searchAnnouncements({
      source: source.name,
      date_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
      limit: 100
    });

    if (recentData.length > 0) {
      const avgQuality = recentData.reduce((sum, item) => {
        const metadata = typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata;
        return sum + (metadata.data_quality_score || 0);
      }, 0) / recentData.length;

      if (avgQuality < this.dataQualityThresholds.minQualityScore) {
        issues.push(`Source ${source.name} has low data quality: ${avgQuality.toFixed(2)}/10`);
      }
    }

    return issues.length > 0 ? {
      source: source.name,
      issues: issues,
      severity: this.calculateSeverity(issues)
    } : null;
  }

  calculateSeverity(issues) {
    if (issues.some(issue => issue.includes('hasn\'t been updated'))) {
      return 'high';
    }
    if (issues.some(issue => issue.includes('low data quality'))) {
      return 'medium';
    }
    return 'low';
  }

  // Detect when sources change format
  async detectFormatChanges() {
    const sources = this.aggregator.getSourceStatus();
    const formatChanges = [];

    for (const source of sources) {
      try {
        // Attempt to parse recent data
        const testResult = await this.aggregator.fetchData(source.source);
        
        // Compare with expected schema
        const validation = await this.validateDataFormat(testResult, source);
        if (!validation.valid) {
          formatChanges.push({
            source: source.name,
            changes: validation.changes,
            severity: 'high'
          });
        }
      } catch (error) {
        formatChanges.push({
          source: source.name,
          error: error.message,
          severity: 'critical'
        });
      }
    }

    return formatChanges;
  }

  async validateDataFormat(data, source) {
    // Implement format validation logic based on source type
    const validation = {
      valid: true,
      changes: []
    };

    try {
      if (source.format === 'xml') {
        // Check for XML structure changes
        const xml2js = require('xml2js');
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(data);
        
        // Validate expected RSS structure
        if (!result.rss || !result.rss.channel) {
          validation.valid = false;
          validation.changes.push('RSS structure changed');
        }
      } else if (source.format === 'json') {
        // Check for JSON structure changes
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        
        // Validate expected API response structure
        if (source.name.includes('Scholarship') && !parsed.schemes) {
          validation.valid = false;
          validation.changes.push('API response structure changed');
        }
      }
    } catch (error) {
      validation.valid = false;
      validation.changes.push(`Parsing error: ${error.message}`);
    }

    return validation;
  }

  // Update strategy when sources change
  async adaptToSourceChanges(sourceChanges) {
    const adaptations = [];

    for (const change of sourceChanges) {
      const adaptation = {
        source: change.source,
        action: 'none',
        details: []
      };

      if (change.severity === 'critical') {
        // Disable source temporarily
        adaptation.action = 'disable';
        adaptation.details.push('Source disabled due to critical error');
        
        // Look for alternative sources
        const alternatives = await this.findAlternativeSources(change.source);
        if (alternatives.length > 0) {
          adaptation.details.push(`Alternative sources found: ${alternatives.join(', ')}`);
        }
      } else if (change.severity === 'high') {
        // Attempt automatic adaptation
        adaptation.action = 'adapt';
        
        if (change.changes.includes('RSS structure changed')) {
          // Try alternative RSS parsing
          adaptation.details.push('Attempting alternative RSS parsing');
        }
        
        if (change.changes.includes('API response structure changed')) {
          // Try schema mapping
          adaptation.details.push('Attempting automatic schema mapping');
        }
      }

      adaptations.push(adaptation);
    }

    return adaptations;
  }

  async findAlternativeSources(failedSource) {
    // Map of alternative sources
    const alternatives = {
      'National Testing Agency': ['CBSE', 'UGC'],
      'UPSC': ['SSC', 'Railway Recruitment Board'],
      'National Scholarship Portal': ['AICTE Scholarships', 'State Scholarship Portals']
    };

    return alternatives[failedSource] || [];
  }

  // Data freshness monitoring
  async checkDataFreshness() {
    const stats = await this.db.getStatistics();
    const staleCategories = [];

    const categories = ['exam', 'admission', 'scholarship', 'notification'];
    
    for (const category of categories) {
      const recentData = await this.db.searchAnnouncements({
        category: category,
        date_from: new Date(Date.now() - this.dataQualityThresholds.minDataFreshness * 60 * 60 * 1000).toISOString(),
        limit: 1
      });

      if (recentData.length === 0) {
        staleCategories.push(category);
      }
    }

    return {
      fresh_categories: categories.length - staleCategories.length,
      stale_categories: staleCategories,
      threshold_hours: this.dataQualityThresholds.minDataFreshness
    };
  }

  // Automated data quality improvement
  async improveDataQuality() {
    const improvements = [];

    // Find low-quality announcements
    const allData = await this.db.searchAnnouncements({ limit: 1000 });
    const lowQualityData = allData.filter(item => {
      const metadata = typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata;
      return (metadata.data_quality_score || 0) < this.dataQualityThresholds.minQualityScore;
    });

    for (const item of lowQualityData) {
      const improved = await this.enhanceDataQuality(item);
      if (improved) {
        improvements.push({
          id: item.id,
          improvements: improved
        });
      }
    }

    return improvements;
  }

  async enhanceDataQuality(announcement) {
    const improvements = [];

    // Enhance title
    if (!announcement.title || announcement.title.length < 10) {
      // Extract better title from description
      const enhancedTitle = this.extractTitleFromDescription(announcement.description);
      if (enhancedTitle) {
        announcement.title = enhancedTitle;
        improvements.push('Enhanced title');
      }
    }

    // Extract missing dates
    if (!announcement.date_application_end && announcement.description) {
      const extractedDates = this.extractDatesFromText(announcement.description);
      if (extractedDates.applicationEnd) {
        announcement.date_application_end = extractedDates.applicationEnd;
        improvements.push('Extracted application deadline');
      }
    }

    // Improve categorization
    const betterCategory = this.improveCategorization(announcement);
    if (betterCategory !== announcement.category) {
      announcement.category = betterCategory;
      improvements.push('Improved categorization');
    }

    // Update in database if improvements were made
    if (improvements.length > 0) {
      await this.db.upsertAnnouncement(announcement);
    }

    return improvements.length > 0 ? improvements : null;
  }

  extractTitleFromDescription(description) {
    if (!description) return null;
    
    // Extract first sentence or line that looks like a title
    const sentences = description.split('.')[0];
    if (sentences.length > 10 && sentences.length < 100) {
      return sentences.trim();
    }
    
    return null;
  }

  extractDatesFromText(text) {
    // Use the existing date extraction logic from data-aggregator
    const datePatterns = [
      /(\d{1,2}[-\/]\d{1,2}[-\/]\d{4})/g,
      /(\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})/gi
    ];

    const foundDates = [];
    datePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        foundDates.push(...matches.map(date => new Date(date)));
      }
    });

    foundDates.sort((a, b) => a - b);
    
    return {
      applicationStart: foundDates[0] || null,
      applicationEnd: foundDates[1] || null,
      examDate: foundDates[2] || null
    };
  }

  improveCategorization(announcement) {
    const title = announcement.title.toLowerCase();
    const description = (announcement.description || '').toLowerCase();
    const text = `${title} ${description}`;

    // More sophisticated categorization rules
    if (text.includes('scholarship') || text.includes('stipend') || text.includes('financial aid')) {
      return 'scholarship';
    }
    if (text.includes('admission') || text.includes('counseling') || text.includes('seat')) {
      return 'admission';
    }
    if (text.includes('result') || text.includes('score') || text.includes('merit list')) {
      return 'result';
    }
    if (text.includes('exam') || text.includes('test') || text.includes('assessment')) {
      return 'exam';
    }

    return announcement.category; // Keep original if no better match
  }

  // Alert system
  async handleIssues(issues) {
    for (const issue of issues) {
      await this.sendAlert(issue);
    }
  }

  async sendAlert(issue) {
    const alert = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'source_issue',
      severity: issue.severity,
      source: issue.source,
      message: issue.issues.join('; '),
      acknowledged: false
    };

    this.alerts.push(alert);

    // In production, send to monitoring service, email, Slack, etc.
    console.warn(`🚨 ALERT [${alert.severity.toUpperCase()}]: ${alert.message}`);

    // Could integrate with:
    // - Email notifications
    // - Slack/Discord webhooks
    // - PagerDuty
    // - Custom monitoring dashboard
  }

  getRecentAlerts() {
    return this.alerts.slice(-20); // Last 20 alerts
  }

  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledged_at = new Date().toISOString();
    }
  }

  // Health dashboard data
  async getHealthDashboard() {
    const sourceStatus = await this.monitorSources();
    const dataFreshness = await this.checkDataFreshness();
    const recentAlerts = this.getRecentAlerts();
    const stats = await this.db.getStatistics();

    return {
      overall_health: this.calculateOverallHealth(sourceStatus, dataFreshness, recentAlerts),
      sources: sourceStatus,
      data_freshness: dataFreshness,
      recent_alerts: recentAlerts,
      statistics: stats,
      last_updated: new Date().toISOString()
    };
  }

  calculateOverallHealth(sourceStatus, dataFreshness, alerts) {
    let score = 100;

    // Deduct for source issues
    const sourceHealthRatio = sourceStatus.healthy_sources / sourceStatus.total_sources;
    score -= (1 - sourceHealthRatio) * 40;

    // Deduct for stale data
    const dataFreshnessRatio = dataFreshness.fresh_categories / 4; // 4 main categories
    score -= (1 - dataFreshnessRatio) * 30;

    // Deduct for recent alerts
    const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;
    const highAlerts = alerts.filter(a => a.severity === 'high' && !a.acknowledged).length;
    score -= criticalAlerts * 10 + highAlerts * 5;

    return {
      score: Math.max(0, Math.round(score)),
      status: score > 80 ? 'healthy' : score > 60 ? 'warning' : 'critical'
    };
  }
}

module.exports = SourceMonitor;