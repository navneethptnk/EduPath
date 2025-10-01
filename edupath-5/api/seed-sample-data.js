/**
 * Sample data insertion script for EduPath
 * This will populate the database with some initial sample data
 */

const Database = require('./database');

class SampleDataSeeder {
  constructor() {
    this.db = new Database();
  }

  async seedSampleData() {
    const sampleAnnouncements = [
      {
        id: 'nta-jee-main-2024-001',
        title: 'JEE Main 2024 Application Process Started',
        description: 'Joint Entrance Examination (JEE) Main 2024 registration has commenced. Candidates can apply online through the official NTA website. The exam will be conducted in multiple sessions.',
        category: 'exam',
        subcategory: 'engineering',
        source: {
          name: 'National Testing Agency',
          url: 'https://nta.ac.in',
          type: 'government',
          credibility_score: 10
        },
        dates: {
          published: new Date('2024-01-15'),
          application_start: new Date('2024-02-01'),
          application_end: new Date('2024-03-15'),
          exam_date: new Date('2024-04-20'),
          last_updated: new Date()
        },
        geography: {
          country: 'India',
          scope: 'national'
        },
        eligibility: {
          education_level: '12th',
          age_min: 17,
          age_max: 25
        },
        financial: {
          application_fee: 1000,
          currency: 'INR'
        },
        links: {
          official_url: 'https://jeemain.nta.nic.in',
          application_url: 'https://jeemain.nta.nic.in/apply'
        },
        status: 'active',
        priority: 'high',
        tags: ['engineering', 'jee', 'entrance-exam', 'undergraduate'],
        metadata: {
          last_scraped: new Date(),
          data_quality_score: 9,
          automated: false
        }
      },
      {
        id: 'nsp-scholarship-2024-001',
        title: 'National Merit Scholarship 2024-25',
        description: 'Applications invited for National Merit Scholarship for undergraduate and postgraduate students from economically weaker sections. Merit-based scholarship with full fee waiver.',
        category: 'scholarship',
        subcategory: 'merit-based',
        source: {
          name: 'National Scholarship Portal',
          url: 'https://scholarships.gov.in',
          type: 'government',
          credibility_score: 9
        },
        dates: {
          published: new Date('2024-01-10'),
          application_start: new Date('2024-02-01'),
          application_end: new Date('2024-04-30'),
          last_updated: new Date()
        },
        geography: {
          country: 'India',
          scope: 'national'
        },
        eligibility: {
          education_level: 'graduate',
          category_restrictions: ['General', 'OBC', 'SC', 'ST'],
          income_criteria: { max: 250000 }
        },
        financial: {
          amount: 50000,
          currency: 'INR',
          type: 'scholarship',
          frequency: 'annual'
        },
        links: {
          official_url: 'https://scholarships.gov.in',
          application_url: 'https://scholarships.gov.in/apply'
        },
        status: 'active',
        priority: 'medium',
        tags: ['scholarship', 'merit-based', 'financial-aid', 'government'],
        metadata: {
          last_scraped: new Date(),
          data_quality_score: 8,
          automated: false
        }
      },
      {
        id: 'upsc-cse-2024-001',
        title: 'UPSC Civil Services Examination 2024 Notification',
        description: 'Union Public Service Commission has released the official notification for Civil Services Examination 2024. Online applications are invited for various Group A and Group B services.',
        category: 'exam',
        subcategory: 'civil-services',
        source: {
          name: 'Union Public Service Commission',
          url: 'https://upsc.gov.in',
          type: 'government',
          credibility_score: 10
        },
        dates: {
          published: new Date('2024-01-05'),
          application_start: new Date('2024-02-10'),
          application_end: new Date('2024-03-31'),
          exam_date: new Date('2024-06-15'),
          last_updated: new Date()
        },
        geography: {
          country: 'India',
          scope: 'national'
        },
        eligibility: {
          education_level: 'graduate',
          age_min: 21,
          age_max: 32
        },
        financial: {
          application_fee: 200,
          currency: 'INR'
        },
        links: {
          official_url: 'https://upsc.gov.in',
          notification_pdf: 'https://upsc.gov.in/sites/default/files/Exam_Notice_CSE2024_Eng.pdf'
        },
        status: 'upcoming',
        priority: 'high',
        tags: ['government', 'civil-services', 'ias', 'ips', 'upsc'],
        metadata: {
          last_scraped: new Date(),
          data_quality_score: 10,
          automated: false
        }
      },
      {
        id: 'cbse-12th-result-2024-001',
        title: 'CBSE Class 12th Result 2024 Declaration Date',
        description: 'Central Board of Secondary Education (CBSE) is expected to declare Class 12th results by May 2024. Students can check their results on the official CBSE website using their roll numbers.',
        category: 'result',
        subcategory: 'class-12',
        source: {
          name: 'Central Board of Secondary Education',
          url: 'https://cbse.gov.in',
          type: 'government',
          credibility_score: 9
        },
        dates: {
          published: new Date('2024-01-20'),
          result_date: new Date('2024-05-15'),
          last_updated: new Date()
        },
        geography: {
          country: 'India',
          scope: 'national'
        },
        eligibility: {
          education_level: '12th'
        },
        links: {
          official_url: 'https://cbse.gov.in',
          result_url: 'https://results.cbse.nic.in'
        },
        status: 'upcoming',
        priority: 'medium',
        tags: ['result', 'cbse', '12th-class', 'board-exam'],
        metadata: {
          last_scraped: new Date(),
          data_quality_score: 8,
          automated: false
        }
      }
    ];

    console.log('🌱 Starting database seeding with sample data...');
    
    try {
      const result = await this.db.insertAnnouncements(sampleAnnouncements);
      console.log(`✅ Successfully seeded ${result.results.length} sample announcements`);
      
      if (result.errors.length > 0) {
        console.log(`⚠️  ${result.errors.length} errors occurred during seeding:`);
        result.errors.forEach(error => {
          console.log(`   - ${error.announcement_id}: ${error.error}`);
        });
      }

      // Display statistics
      const stats = await this.db.getStatistics();
      console.log('\n📊 Database Statistics:');
      console.log(`   Total Announcements: ${stats.total_announcements[0]?.count || 0}`);
      console.log(`   Active Applications: ${stats.active_applications[0]?.count || 0}`);
      
      return result;
    } catch (error) {
      console.error('❌ Error seeding database:', error);
      throw error;
    }
  }

  close() {
    this.db.close();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  const seeder = new SampleDataSeeder();
  seeder.seedSampleData()
    .then(() => {
      console.log('✅ Database seeding completed successfully!');
      seeder.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database seeding failed:', error);
      seeder.close();
      process.exit(1);
    });
}

module.exports = SampleDataSeeder;