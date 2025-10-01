/**
 * Script to insert fresh 2025 sample data into the database
 */

const Database = require('./database.js');
const { sampleAnnouncements } = require('./sample-data.js');

async function insertFreshData() {
  const db = new Database();
  
  console.log('🚀 Starting fresh data insertion...');
  
  try {
    // Transform sample data to match database structure
    const transformedAnnouncements = sampleAnnouncements.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      subcategory: item.subcategory,
      source: {
        name: item.source.name,
        url: item.source.url,
        type: item.source.type,
        credibility_score: item.source.credibility_score
      },
      dates: {
        published: item.dates.published,
        application_start: item.dates.application_start,
        application_end: item.dates.application_end,
        exam_date: item.dates.exam_date,
        result_date: item.dates.result_date,
        last_updated: new Date()
      },
      geography: {
        country: item.geography.country,
        states: item.geography.states,
        regions: item.geography.regions || [],
        scope: item.geography.scope
      },
      eligibility: item.eligibility || {},
      financial: item.financial || {},
      links: item.links || {},
      status: item.status,
      priority: item.priority,
      tags: item.tags || [],
      metadata: {
        ...item.metadata,
        last_scraped: new Date(),
        view_count: Math.floor(Math.random() * 50000) + 10000, // Fresh random view counts
        bookmark_count: Math.floor(Math.random() * 5000) + 1000
      }
    }));

    console.log(`📊 Prepared ${transformedAnnouncements.length} announcements for insertion`);

    // Insert all announcements
    const result = await db.insertAnnouncements(transformedAnnouncements);
    
    console.log(`✅ Successfully inserted ${result.results.length} announcements`);
    if (result.errors.length > 0) {
      console.log(`⚠️ ${result.errors.length} errors occurred:`);
      result.errors.forEach(error => {
        console.log(`  - ${error.announcement_id}: ${error.error}`);
      });
    }

    // Verify the data
    const allAnnouncements = await db.searchAnnouncements({ limit: 10 });
    console.log(`🔍 Verification: Found ${allAnnouncements.length} announcements in database`);
    
    if (allAnnouncements.length > 0) {
      console.log('📋 Sample announcements:');
      allAnnouncements.forEach(ann => {
        console.log(`  - ${ann.title} (${ann.date_published.substring(0, 10)})`);
      });
    }

  } catch (error) {
    console.error('❌ Error inserting fresh data:', error);
  } finally {
    db.close();
    console.log('🔒 Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  insertFreshData().then(() => {
    console.log('🎉 Fresh data insertion completed!');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

module.exports = { insertFreshData };