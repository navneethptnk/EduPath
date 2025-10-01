/**
 * EduPath Data Aggregator Service
 * Fetches and normalizes data from multiple education sources
 */

const axios = require('axios');
const xml2js = require('xml2js');
const cheerio = require('cheerio');
const cron = require('node-cron');

class DataAggregator {
  constructor() {
    this.sources = new Map();
    this.cache = new Map();
    this.lastFetch = new Map();
    this.errorLog = [];
    
    this.setupSources();
    this.scheduleUpdates();
  }

  setupSources() {
    // NTA (National Testing Agency)
    this.sources.set('nta', {
      name: 'National Testing Agency',
      url: 'https://nta.ac.in/rss-feed',
      type: 'rss',
      format: 'xml',
      category: 'exam',
      parser: this.parseNTAFeed.bind(this),
      credibilityScore: 10,
      updateFrequency: 6 // hours
    });

    // UPSC
    this.sources.set('upsc', {
      name: 'Union Public Service Commission',
      url: 'https://upsc.gov.in/rss.xml',
      type: 'rss',
      format: 'xml',
      category: 'exam',
      parser: this.parseUPSCFeed.bind(this),
      credibilityScore: 10,
      updateFrequency: 12
    });

    // SSC
    this.sources.set('ssc', {
      name: 'Staff Selection Commission',
      url: 'https://ssc.nic.in/ssc-rss-feed.xml',
      type: 'rss',
      format: 'xml',
      category: 'exam',
      parser: this.parseSSCFeed.bind(this),
      credibilityScore: 10,
      updateFrequency: 8
    });

    // National Scholarship Portal
    this.sources.set('nsp', {
      name: 'National Scholarship Portal',
      url: 'https://scholarships.gov.in/api/v1/schemes',
      type: 'api',
      format: 'json',
      category: 'scholarship',
      parser: this.parseNSPData.bind(this),
      credibilityScore: 9,
      updateFrequency: 24
    });

    // CBSE
    this.sources.set('cbse', {
      name: 'Central Board of Secondary Education',
      url: 'https://cbse.gov.in/rss-feed.xml',
      type: 'rss',
      format: 'xml',
      category: 'admission',
      parser: this.parseCBSEFeed.bind(this),
      credibilityScore: 9,
      updateFrequency: 12
    });
  }

  // Generic fetch method with error handling and retry logic
  async fetchData(source, retries = 3) {
    const config = this.sources.get(source);
    if (!config) throw new Error(`Unknown source: ${source}`);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Fetching data from ${config.name} (attempt ${attempt})`);
        
        const response = await axios.get(config.url, {
          timeout: 30000,
          headers: {
            'User-Agent': 'EduPath-Aggregator/1.0 (Educational Platform)',
            'Accept': config.format === 'xml' ? 'application/xml,text/xml' : 'application/json'
          }
        });

        this.lastFetch.set(source, new Date());
        return response.data;
      } catch (error) {
        console.error(`Attempt ${attempt} failed for ${source}:`, error.message);
        
        if (attempt === retries) {
          this.errorLog.push({
            source,
            error: error.message,
            timestamp: new Date(),
            attempts: retries
          });
          throw error;
        }
        
        // Exponential backoff
        await this.sleep(Math.pow(2, attempt) * 1000);
      }
    }
  }

  // NTA RSS Feed Parser
  async parseNTAFeed(data) {
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(data);
    const items = result.rss?.channel?.[0]?.item || [];

    return items.map(item => {
      const title = item.title?.[0] || '';
      const description = item.description?.[0] || '';
      const link = item.link?.[0] || '';
      const pubDate = new Date(item.pubDate?.[0] || Date.now());

      // Extract exam information using regex patterns
      const examType = this.extractExamType(title);
      const dates = this.extractDates(description);
      
      return {
        id: this.generateId('nta', title, pubDate),
        title: this.cleanTitle(title),
        description: this.cleanDescription(description),
        category: 'exam',
        subcategory: examType,
        source: {
          name: 'National Testing Agency',
          url: 'https://nta.ac.in',
          type: 'government',
          credibility_score: 10
        },
        dates: {
          published: pubDate,
          application_start: dates.applicationStart,
          application_end: dates.applicationEnd,
          exam_date: dates.examDate,
          last_updated: new Date()
        },
        geography: {
          country: 'India',
          scope: 'national'
        },
        eligibility: this.extractEligibility(description),
        links: {
          official_url: link,
          notification_pdf: this.extractPDFLink(description)
        },
        status: this.determineStatus(dates),
        priority: this.determinePriority(title, dates),
        tags: this.extractTags(title, description),
        metadata: {
          last_scraped: new Date(),
          data_quality_score: this.calculateQualityScore(title, description, dates),
          automated: true
        }
      };
    });
  }

  // UPSC RSS Feed Parser
  async parseUPSCFeed(data) {
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(data);
    const items = result.rss?.channel?.[0]?.item || [];

    return items.map(item => {
      const title = item.title?.[0] || '';
      const description = item.description?.[0] || '';
      const link = item.link?.[0] || '';
      const pubDate = new Date(item.pubDate?.[0] || Date.now());

      const examType = this.extractUPSCExamType(title);
      const dates = this.extractDates(description);

      return {
        id: this.generateId('upsc', title, pubDate),
        title: this.cleanTitle(title),
        description: this.cleanDescription(description),
        category: 'exam',
        subcategory: examType,
        source: {
          name: 'Union Public Service Commission',
          url: 'https://upsc.gov.in',
          type: 'government',
          credibility_score: 10
        },
        dates: {
          published: pubDate,
          application_start: dates.applicationStart,
          application_end: dates.applicationEnd,
          exam_date: dates.examDate,
          last_updated: new Date()
        },
        geography: {
          country: 'India',
          scope: 'national'
        },
        eligibility: this.extractEligibility(description),
        links: {
          official_url: link,
          notification_pdf: this.extractPDFLink(description)
        },
        status: this.determineStatus(dates),
        priority: this.determinePriority(title, dates),
        tags: this.extractTags(title, description),
        metadata: {
          last_scraped: new Date(),
          data_quality_score: this.calculateQualityScore(title, description, dates),
          automated: true
        }
      };
    });
  }

  // SSC RSS Feed Parser
  async parseSSCFeed(data) {
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(data);
    const items = result.rss?.channel?.[0]?.item || [];

    return items.map(item => {
      const title = item.title?.[0] || '';
      const description = item.description?.[0] || '';
      const link = item.link?.[0] || '';
      const pubDate = new Date(item.pubDate?.[0] || Date.now());

      const examType = this.extractSSCExamType(title);
      const dates = this.extractDates(description);

      return {
        id: this.generateId('ssc', title, pubDate),
        title: this.cleanTitle(title),
        description: this.cleanDescription(description),
        category: 'exam',
        subcategory: examType,
        source: {
          name: 'Staff Selection Commission',
          url: 'https://ssc.nic.in',
          type: 'government',
          credibility_score: 10
        },
        dates: {
          published: pubDate,
          application_start: dates.applicationStart,
          application_end: dates.applicationEnd,
          exam_date: dates.examDate,
          last_updated: new Date()
        },
        geography: {
          country: 'India',
          scope: 'national'
        },
        eligibility: this.extractEligibility(description),
        links: {
          official_url: link,
          notification_pdf: this.extractPDFLink(description)
        },
        status: this.determineStatus(dates),
        priority: this.determinePriority(title, dates),
        tags: this.extractTags(title, description),
        metadata: {
          last_scraped: new Date(),
          data_quality_score: this.calculateQualityScore(title, description, dates),
          automated: true
        }
      };
    });
  }

  // CBSE RSS Feed Parser
  async parseCBSEFeed(data) {
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(data);
    const items = result.rss?.channel?.[0]?.item || [];

    return items.map(item => {
      const title = item.title?.[0] || '';
      const description = item.description?.[0] || '';
      const link = item.link?.[0] || '';
      const pubDate = new Date(item.pubDate?.[0] || Date.now());

      const category = this.extractCBSECategory(title);
      const dates = this.extractDates(description);

      return {
        id: this.generateId('cbse', title, pubDate),
        title: this.cleanTitle(title),
        description: this.cleanDescription(description),
        category: category,
        subcategory: this.extractCBSESubcategory(title),
        source: {
          name: 'Central Board of Secondary Education',
          url: 'https://cbse.gov.in',
          type: 'government',
          credibility_score: 9
        },
        dates: {
          published: pubDate,
          application_start: dates.applicationStart,
          application_end: dates.applicationEnd,
          exam_date: dates.examDate,
          last_updated: new Date()
        },
        geography: {
          country: 'India',
          scope: 'national'
        },
        eligibility: this.extractEligibility(description),
        links: {
          official_url: link,
          notification_pdf: this.extractPDFLink(description)
        },
        status: this.determineStatus(dates),
        priority: this.determinePriority(title, dates),
        tags: this.extractTags(title, description),
        metadata: {
          last_scraped: new Date(),
          data_quality_score: this.calculateQualityScore(title, description, dates),
          automated: true
        }
      };
    });
  }

  // National Scholarship Portal API Parser
  async parseNSPData(data) {
    const schemes = data.schemes || [];

    return schemes.map(scheme => {
      const dates = {
        applicationStart: scheme.application_start_date ? new Date(scheme.application_start_date) : null,
        applicationEnd: scheme.application_end_date ? new Date(scheme.application_end_date) : null
      };

      return {
        id: this.generateId('nsp', scheme.scheme_name, new Date()),
        title: scheme.scheme_name,
        description: scheme.description || scheme.brief_description,
        category: 'scholarship',
        subcategory: scheme.scheme_type,
        source: {
          name: 'National Scholarship Portal',
          url: 'https://scholarships.gov.in',
          type: 'government',
          credibility_score: 9
        },
        dates: {
          published: new Date(scheme.created_at || Date.now()),
          application_start: dates.applicationStart,
          application_end: dates.applicationEnd,
          last_updated: new Date()
        },
        geography: {
          country: 'India',
          states: scheme.applicable_states || [],
          scope: scheme.applicable_states?.length === 1 ? 'state' : 'national'
        },
        eligibility: {
          education_level: scheme.education_level,
          category_restrictions: scheme.eligible_categories || [],
          income_criteria: {
            max: scheme.income_ceiling
          }
        },
        financial: {
          amount: scheme.scholarship_amount,
          currency: 'INR',
          type: 'scholarship',
          frequency: scheme.payment_frequency
        },
        links: {
          official_url: scheme.official_url,
          application_url: scheme.application_url
        },
        status: this.determineStatus(dates),
        priority: this.determinePriority(scheme.scheme_name, dates),
        tags: this.extractScholarshipTags(scheme),
        metadata: {
          last_scraped: new Date(),
          data_quality_score: this.calculateQualityScore(scheme.scheme_name, scheme.description, dates),
          automated: true
        }
      };
    });
  }

  // Utility methods for data extraction and normalization
  extractUPSCExamType(title) {
    const upscExams = {
      'Civil Services': 'civil_services',
      'CDS': 'defence',
      'CAPF': 'paramilitary',
      'NDA': 'defence',
      'ESE': 'engineering',
      'SO': 'statistical'
    };

    for (const [exam, type] of Object.entries(upscExams)) {
      if (title.includes(exam)) return type;
    }
    return 'government';
  }

  extractSSCExamType(title) {
    const sscExams = {
      'CGL': 'graduate',
      'CHSL': 'senior_secondary',
      'MTS': 'multitasking',
      'GD': 'constable',
      'CPO': 'police',
      'JE': 'engineering'
    };

    for (const [exam, type] of Object.entries(sscExams)) {
      if (title.includes(exam)) return type;
    }
    return 'government';
  }

  extractCBSECategory(title) {
    if (title.includes('Result') || title.includes('Score')) return 'result';
    if (title.includes('Admission') || title.includes('Application')) return 'admission';
    if (title.includes('Exam') || title.includes('Date Sheet')) return 'exam';
    return 'notification';
  }

  extractCBSESubcategory(title) {
    if (title.includes('Class X') || title.includes('10th')) return 'class_10';
    if (title.includes('Class XII') || title.includes('12th')) return 'class_12';
    if (title.includes('Compartment')) return 'compartment';
    return 'general';
  }

  extractExamType(title) {
    const examTypes = {
      'JEE': 'engineering',
      'NEET': 'medical',
      'UGC NET': 'research',
      'GATE': 'engineering',
      'CAT': 'management',
      'CLAT': 'law',
      'AIIMS': 'medical'
    };

    for (const [key, value] of Object.entries(examTypes)) {
      if (title.toUpperCase().includes(key)) {
        return value;
      }
    }
    return 'general';
  }

  extractUPSCExamType(title) {
    if (title.includes('Civil Services')) return 'civil-services';
    if (title.includes('CDS')) return 'defense';
    if (title.includes('CAPF')) return 'paramilitary';
    if (title.includes('Engineering Services')) return 'engineering';
    return 'government';
  }

  extractDates(text) {
    const dates = {
      applicationStart: null,
      applicationEnd: null,
      examDate: null
    };

    // Common date patterns in Indian government notifications
    const datePatterns = [
      /(\d{1,2}[-\/]\d{1,2}[-\/]\d{4})/g,
      /(\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})/gi,
      /(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/g
    ];

    const foundDates = [];
    datePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        foundDates.push(...matches.map(date => new Date(date)));
      }
    });

    // Sort dates and assign logically
    foundDates.sort((a, b) => a - b);
    
    if (foundDates.length >= 2) {
      dates.applicationStart = foundDates[0];
      dates.applicationEnd = foundDates[1];
    }
    if (foundDates.length >= 3) {
      dates.examDate = foundDates[2];
    }

    return dates;
  }

  extractEligibility(text) {
    const eligibility = {};

    // Extract education level
    if (text.includes('Graduate') || text.includes('Graduation')) {
      eligibility.education_level = 'graduate';
    } else if (text.includes('12th') || text.includes('Higher Secondary')) {
      eligibility.education_level = '12th';
    } else if (text.includes('10th') || text.includes('Matriculation')) {
      eligibility.education_level = '10th';
    }

    // Extract age criteria
    const agePattern = /age.*?(\d{2}).*?(\d{2})/i;
    const ageMatch = text.match(agePattern);
    if (ageMatch) {
      eligibility.age_min = parseInt(ageMatch[1]);
      eligibility.age_max = parseInt(ageMatch[2]);
    }

    return eligibility;
  }

  extractTags(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    const tagMap = {
      'engineering': ['jee', 'gate', 'engineering', 'technical'],
      'medical': ['neet', 'aiims', 'medical', 'mbbs', 'dental'],
      'management': ['cat', 'mat', 'xat', 'management', 'mba'],
      'law': ['clat', 'law', 'legal', 'llb'],
      'research': ['ugc net', 'phd', 'research', 'fellowship'],
      'government': ['upsc', 'ssc', 'railway', 'banking', 'psu'],
      'scholarship': ['scholarship', 'financial aid', 'stipend', 'grant'],
      'admission': ['admission', 'counseling', 'seat allotment']
    };

    const tags = [];
    Object.entries(tagMap).forEach(([category, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        tags.push(category);
      }
    });

    return tags;
  }

  determineStatus(dates) {
    const now = new Date();
    
    if (dates.applicationStart && now < dates.applicationStart) {
      return 'upcoming';
    } else if (dates.applicationEnd && now <= dates.applicationEnd) {
      return 'active';
    } else if (dates.examDate && now < dates.examDate) {
      return 'closed';
    } else {
      return 'completed';
    }
  }

  determinePriority(title, dates) {
    const now = new Date();
    
    // High priority for deadlines within 7 days
    if (dates.applicationEnd) {
      const daysToDeadline = Math.ceil((dates.applicationEnd - now) / (1000 * 60 * 60 * 24));
      if (daysToDeadline <= 7 && daysToDeadline > 0) {
        return 'urgent';
      } else if (daysToDeadline <= 30) {
        return 'high';
      }
    }

    // High priority for major exams
    const majorExams = ['JEE', 'NEET', 'UPSC', 'GATE', 'CAT'];
    if (majorExams.some(exam => title.includes(exam))) {
      return 'high';
    }

    return 'medium';
  }

  calculateQualityScore(title, description, dates) {
    let score = 0;
    
    // Title quality (30%)
    if (title && title.length > 10) score += 3;
    
    // Description quality (30%)
    if (description && description.length > 50) score += 3;
    
    // Date completeness (40%)
    if (dates.applicationStart) score += 1.5;
    if (dates.applicationEnd) score += 1.5;
    if (dates.examDate) score += 1;
    
    return Math.min(score, 10);
  }

  // Utility methods
  generateId(source, title, date) {
    const hashInput = `${source}-${title}-${date.toISOString()}`;
    return Buffer.from(hashInput).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  cleanTitle(title) {
    return title.replace(/<[^>]*>/g, '').trim();
  }

  cleanDescription(description) {
    return description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  extractPDFLink(text) {
    const pdfPattern = /(https?:\/\/[^\s]+\.pdf)/i;
    const match = text.match(pdfPattern);
    return match ? match[1] : null;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Main aggregation method
  async aggregateAllSources() {
    const allAnnouncements = [];
    const errors = [];

    for (const [sourceKey, config] of this.sources) {
      try {
        console.log(`Processing source: ${config.name}`);
        
        const rawData = await this.fetchData(sourceKey);
        const normalizedData = await config.parser(rawData);
        
        allAnnouncements.push(...normalizedData);
        console.log(`✓ ${config.name}: ${normalizedData.length} announcements processed`);
        
      } catch (error) {
        console.error(`✗ ${config.name}: ${error.message}`);
        errors.push({
          source: sourceKey,
          error: error.message,
          timestamp: new Date()
        });
      }
    }

    return {
      announcements: allAnnouncements,
      errors,
      summary: {
        total_sources: this.sources.size,
        successful_sources: this.sources.size - errors.length,
        total_announcements: allAnnouncements.length,
        last_updated: new Date()
      }
    };
  }

  // Schedule automatic updates
  scheduleUpdates() {
    // Run every 6 hours
    cron.schedule('0 */6 * * *', async () => {
      console.log('Starting scheduled data aggregation...');
      try {
        const result = await this.aggregateAllSources();
        console.log(`Scheduled update completed: ${result.summary.total_announcements} announcements`);
        
        // Here you would typically save to database
        // await this.saveToDatabase(result.announcements);
        
      } catch (error) {
        console.error('Scheduled update failed:', error);
      }
    });
  }

  // Manual trigger for immediate update
  async triggerUpdate() {
    return await this.aggregateAllSources();
  }

  // Get error log
  getErrorLog() {
    return this.errorLog;
  }

  // Get source status
  getSourceStatus() {
    const status = [];
    for (const [key, config] of this.sources) {
      status.push({
        source: key,
        name: config.name,
        last_fetch: this.lastFetch.get(key),
        update_frequency: config.updateFrequency,
        credibility_score: config.credibilityScore
      });
    }
    return status;
  }
}

module.exports = DataAggregator;