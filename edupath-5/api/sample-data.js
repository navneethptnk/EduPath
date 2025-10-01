/**
 * Sample data for testing the EduPath Unified API
 */

const sampleAnnouncements = [
  {
    id: 'nta_jee_main_2025',
    title: 'JEE Main 2025 - Session 1 Application',
    description: 'Joint Entrance Examination (Main) for admission to NITs, IIITs, and CFTIs. Applications are now open for Session 1.',
    category: 'exam',
    subcategory: 'engineering',
    source: {
      name: 'National Testing Agency',
      url: 'https://nta.ac.in',
      type: 'government',
      credibility_score: 10
    },
    dates: {
      published: new Date('2025-01-15T09:00:00.000Z'),
      application_start: new Date('2025-02-01T00:00:00.000Z'),
      application_end: new Date('2025-04-30T23:59:59.000Z'),
      exam_date: new Date('2025-06-15T09:30:00.000Z'),
      last_updated: new Date()
    },
    geography: {
      country: 'India',
      states: [],
      scope: 'national'
    },
    eligibility: {
      education_level: '12th',
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      age_max: 25
    },
    links: {
      official_url: 'https://jeemain.nta.nic.in',
      application_url: 'https://jeemain.nta.nic.in/apply',
      notification_pdf: 'https://jeemain.nta.nic.in/notification.pdf'
    },
    status: 'active',
    priority: 'high',
    tags: ['engineering', 'entrance', 'national', 'jee'],
    metadata: {
      view_count: 15420,
      bookmark_count: 3254,
      last_scraped: new Date(),
      data_quality_score: 9.5,
      automated: false
    }
  },
  {
    id: 'nsp_pm_scholarship_2025',
    title: 'PM Scholarship Scheme 2025-26',
    description: 'Scholarship for wards/widows of Ex-servicemen and Ex-Coast Guard personnel for pursuing professional courses.',
    category: 'scholarship',
    subcategory: 'merit',
    source: {
      name: 'National Scholarship Portal',
      url: 'https://scholarships.gov.in',
      type: 'government',
      credibility_score: 9
    },
    dates: {
      published: new Date('2025-01-10T10:00:00.000Z'),
      application_start: new Date('2025-02-15T00:00:00.000Z'),
      application_end: new Date('2025-05-31T23:59:59.000Z'),
      last_updated: new Date()
    },
    geography: {
      country: 'India',
      states: [],
      scope: 'national'
    },
    eligibility: {
      education_level: '12th',
      category_restrictions: ['ex-servicemen-wards']
    },
    financial: {
      amount: 25000,
      currency: 'INR',
      type: 'scholarship',
      frequency: 'annual'
    },
    links: {
      official_url: 'https://scholarships.gov.in/fresh/newstudent',
      application_url: 'https://scholarships.gov.in/fresh/newstudent'
    },
    status: 'active',
    priority: 'medium',
    tags: ['scholarship', 'ex-servicemen', 'national', 'pm-scheme'],
    metadata: {
      view_count: 8750,
      bookmark_count: 1890,
      last_scraped: new Date(),
      data_quality_score: 9.0,
      automated: false
    }
  },
  {
    id: 'upsc_cse_2025',
    title: 'UPSC Civil Services Examination 2025',
    description: 'Online applications are invited for Civil Services Examination, 2025 to fill posts in IAS, IFS, IPS and other services.',
    category: 'exam',
    subcategory: 'civil_services',
    source: {
      name: 'Union Public Service Commission',
      url: 'https://upsc.gov.in',
      type: 'government',
      credibility_score: 10
    },
    dates: {
      published: new Date('2025-01-20T12:00:00.000Z'),
      application_start: new Date('2025-02-14T18:00:00.000Z'),
      application_end: new Date('2025-04-05T18:00:00.000Z'),
      exam_date: new Date('2025-07-16T09:30:00.000Z'),
      last_updated: new Date()
    },
    geography: {
      country: 'India',
      states: [],
      scope: 'national'
    },
    eligibility: {
      education_level: 'graduate',
      age_min: 21,
      age_max: 32
    },
    links: {
      official_url: 'https://upsconline.nic.in',
      application_url: 'https://upsconline.nic.in/ora/VacancyNoticePub.php'
    },
    status: 'upcoming',
    priority: 'high',
    tags: ['upsc', 'civil-services', 'ias', 'ips', 'national'],
    metadata: {
      view_count: 25680,
      bookmark_count: 5420,
      last_scraped: new Date(),
      data_quality_score: 10.0,
      automated: false
    }
  },
  {
    id: 'cbse_class12_results_2025',
    title: 'CBSE Class XII Results 2025',
    description: 'Central Board of Secondary Education announces Class XII examination results for the academic year 2024-25.',
    category: 'result',
    subcategory: 'class_12',
    source: {
      name: 'Central Board of Secondary Education',
      url: 'https://cbse.gov.in',
      type: 'government',
      credibility_score: 9
    },
    dates: {
      published: new Date('2025-05-13T15:00:00.000Z'),
      last_updated: new Date()
    },
    geography: {
      country: 'India',
      states: [],
      scope: 'national'
    },
    links: {
      official_url: 'https://cbseresults.nic.in'
    },
    status: 'completed',
    priority: 'medium',
    tags: ['cbse', 'results', 'class-12', 'board-exam'],
    metadata: {
      view_count: 45230,
      bookmark_count: 2100,
      last_scraped: new Date(),
      data_quality_score: 8.5,
      automated: false
    }
  },
  {
    id: 'aicte_scholarship_pg_2025',
    title: 'AICTE PG Scholarship 2025-26',
    description: 'AICTE offers scholarships for meritorious students pursuing postgraduate technical programs.',
    category: 'scholarship',
    subcategory: 'merit',
    source: {
      name: 'All India Council for Technical Education',
      url: 'https://aicte-india.org',
      type: 'autonomous',
      credibility_score: 8
    },
    dates: {
      published: new Date('2025-01-25T11:30:00.000Z'),
      application_start: new Date('2025-03-01T00:00:00.000Z'),
      application_end: new Date('2025-06-15T23:59:59.000Z'),
      last_updated: new Date()
    },
    geography: {
      country: 'India',
      states: [],
      scope: 'national'
    },
    eligibility: {
      education_level: 'postgraduate',
      subjects: ['engineering', 'technology', 'management']
    },
    financial: {
      amount: 12400,
      currency: 'INR',
      type: 'scholarship',
      frequency: 'monthly'
    },
    links: {
      official_url: 'https://aicte-india.org/schemes'
    },
    status: 'upcoming',
    priority: 'medium',
    tags: ['aicte', 'scholarship', 'postgraduate', 'technical'],
    metadata: {
      view_count: 3420,
      bookmark_count: 890,
      last_scraped: new Date(),
      data_quality_score: 8.0,
      automated: false
    }
  }
];

// Function to insert sample data into database
async function insertSampleData(database) {
  console.log('Inserting sample data...');
  
  let inserted = 0;
  for (const announcement of sampleAnnouncements) {
    try {
      await database.insertAnnouncement(announcement);
      inserted++;
    } catch (error) {
      console.warn(`Failed to insert sample announcement ${announcement.id}:`, error.message);
    }
  }
  
  console.log(`✓ Inserted ${inserted} sample announcements`);
  return inserted;
}

module.exports = {
  sampleAnnouncements,
  insertSampleData
};