import { db } from '../src/backend/config/database.js';
import { RSS_SOURCES, AUTHORS } from '../src/backend/config/constants.js';

async function seedSources() {
  console.log('Seeding RSS sources...');

  try {
    // Seed RSS sources
    for (const [category, sources] of Object.entries(RSS_SOURCES)) {
      for (const source of sources) {
        await db.query(
          `INSERT INTO sources (name, url, category, priority, is_active)
           VALUES ($1, $2, $3, $4, true)
           ON CONFLICT (url) DO UPDATE SET
             name = EXCLUDED.name,
             priority = EXCLUDED.priority`,
          [source.name, source.url, category, source.priority]
        );
        console.log(`  Added: ${source.name} (${category})`);
      }
    }

    // Seed authors
    console.log('\nSeeding authors...');
    for (const author of AUTHORS) {
      await db.query(
        `INSERT INTO authors (id, name, bio, role)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           bio = EXCLUDED.bio,
           role = EXCLUDED.role`,
        [author.id, author.name, author.bio, author.role]
      );
      console.log(`  Added: ${author.name}`);
    }

    // Get counts
    const sourcesCount = await db.query('SELECT COUNT(*) FROM sources');
    const authorsCount = await db.query('SELECT COUNT(*) FROM authors');

    console.log(`\nSeeding completed!`);
    console.log(`Total sources: ${sourcesCount.rows[0].count}`);
    console.log(`Total authors: ${authorsCount.rows[0].count}`);

  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await db.end();
  }
}

seedSources();
