/**
 * EduPath Unified API Schema
 * Normalized schema for education announcements
 */

// Main Announcement Schema
const AnnouncementSchema = {
  // Unique identifier
  id: {
    type: 'string',
    required: true,
    description: 'Unique identifier for the announcement'
  },
  
  // Basic Information
  title: {
    type: 'string',
    required: true,
    maxLength: 200,
    description: 'Announcement title'
  },
  
  description: {
    type: 'text',
    required: false,
    description: 'Detailed description of the announcement'
  },
  
  category: {
    type: 'enum',
    required: true,
    values: ['exam', 'admission', 'scholarship', 'notification', 'result'],
    description: 'Type of announcement'
  },
  
  subcategory: {
    type: 'string',
    required: false,
    description: 'Specific subcategory (e.g., "engineering", "medical", "government")'
  },
  
  // Source Information
  source: {
    type: 'object',
    required: true,
    properties: {
      name: { type: 'string', required: true },
      url: { type: 'string', required: true },
      type: { type: 'enum', values: ['government', 'private', 'autonomous'] },
      credibility_score: { type: 'number', min: 0, max: 10 }
    }
  },
  
  // Dates and Deadlines
  dates: {
    type: 'object',
    required: true,
    properties: {
      published: { type: 'datetime', required: true },
      application_start: { type: 'datetime', required: false },
      application_end: { type: 'datetime', required: false },
      exam_date: { type: 'datetime', required: false },
      result_date: { type: 'datetime', required: false },
      last_updated: { type: 'datetime', required: true }
    }
  },
  
  // Geographic Information
  geography: {
    type: 'object',
    required: false,
    properties: {
      country: { type: 'string', default: 'India' },
      states: { type: 'array', items: { type: 'string' } },
      regions: { type: 'array', items: { type: 'string' } },
      scope: { type: 'enum', values: ['national', 'state', 'regional', 'institutional'] }
    }
  },
  
  // Eligibility and Requirements
  eligibility: {
    type: 'object',
    required: false,
    properties: {
      education_level: { type: 'enum', values: ['10th', '12th', 'graduate', 'postgraduate', 'phd', 'any'] },
      age_min: { type: 'number' },
      age_max: { type: 'number' },
      subjects: { type: 'array', items: { type: 'string' } },
      category_restrictions: { type: 'array', items: { type: 'string' } },
      income_criteria: { type: 'object', properties: { min: 'number', max: 'number' } }
    }
  },
  
  // Financial Information (for scholarships/fees)
  financial: {
    type: 'object',
    required: false,
    properties: {
      amount: { type: 'number' },
      currency: { type: 'string', default: 'INR' },
      type: { type: 'enum', values: ['scholarship', 'fee', 'stipend', 'grant'] },
      frequency: { type: 'enum', values: ['one-time', 'monthly', 'semester', 'annual'] }
    }
  },
  
  // Links and Resources
  links: {
    type: 'object',
    required: false,
    properties: {
      official_url: { type: 'string' },
      application_url: { type: 'string' },
      syllabus_url: { type: 'string' },
      notification_pdf: { type: 'string' },
      additional_resources: { type: 'array', items: { type: 'string' } }
    }
  },
  
  // Status and Priority
  status: {
    type: 'enum',
    required: true,
    values: ['upcoming', 'active', 'closed', 'completed', 'cancelled'],
    description: 'Current status of the announcement'
  },
  
  priority: {
    type: 'enum',
    required: true,
    values: ['low', 'medium', 'high', 'urgent'],
    description: 'Priority level for display'
  },
  
  // Tags and Keywords
  tags: {
    type: 'array',
    items: { type: 'string' },
    description: 'Searchable tags for categorization'
  },
  
  // Metadata
  metadata: {
    type: 'object',
    required: false,
    properties: {
      view_count: { type: 'number', default: 0 },
      bookmark_count: { type: 'number', default: 0 },
      last_scraped: { type: 'datetime' },
      data_quality_score: { type: 'number', min: 0, max: 10 },
      automated: { type: 'boolean', default: true }
    }
  }
};

// Helper schemas for specific categories
const ExamSpecificFields = {
  exam_type: { type: 'enum', values: ['entrance', 'competitive', 'board', 'certification'] },
  conducting_body: { type: 'string' },
  exam_mode: { type: 'enum', values: ['online', 'offline', 'hybrid'] },
  language_options: { type: 'array', items: { type: 'string' } },
  total_seats: { type: 'number' },
  participating_institutes: { type: 'array', items: { type: 'string' } }
};

const ScholarshipSpecificFields = {
  scholarship_type: { type: 'enum', values: ['merit', 'need-based', 'minority', 'disability', 'sports'] },
  provider: { type: 'string' },
  renewable: { type: 'boolean' },
  selection_criteria: { type: 'text' },
  benefits: { type: 'array', items: { type: 'string' } }
};

const AdmissionSpecificFields = {
  admission_type: { type: 'enum', values: ['undergraduate', 'postgraduate', 'diploma', 'certificate'] },
  institution_type: { type: 'enum', values: ['university', 'college', 'institute', 'school'] },
  courses_offered: { type: 'array', items: { type: 'string' } },
  seat_matrix: { type: 'object' },
  counseling_dates: { type: 'array', items: { type: 'datetime' } }
};

module.exports = {
  AnnouncementSchema,
  ExamSpecificFields,
  ScholarshipSpecificFields,
  AdmissionSpecificFields
};