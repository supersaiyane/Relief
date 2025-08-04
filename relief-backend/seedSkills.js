// backend/seedSkillsWithMapping.js

const fs    = require('fs');
const path  = require('path');
const { parse } = require('csv-parse/sync');

const initDb = require('./initDb');
const db     = require('./config/db');

async function seedSkills() {
  // 1) Ensure tables exist
  initDb();

  db.serialize(() => {
    // 2) Clear existing skills
    db.run('DELETE FROM skill;', err => {
      if (err) console.error('Error clearing skill table:', err.message);
      else     console.log('✅ Cleared skill table');
    });

    // 3) Load & parse your CSV
    const csvPath = path.resolve(__dirname, 'skills.csv');
    const raw     = fs.readFileSync(csvPath, 'utf8');
    // parse with headers
    const records = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    // extract and dedupe skill names
    const skillNames = Array.from(
      new Set(records.map(r => r.Skill))
    );

    // 4) Insert each into skill(name)
    const stmt = db.prepare(`INSERT OR IGNORE INTO skill (name) VALUES (?);`);
    skillNames.forEach(name => {
      stmt.run(name, err => {
        if (err) console.error(`Insert error for "${name}":`, err.message);
      });
    });

    stmt.finalize(err => {
      if (err) console.error('Finalize error:', err.message);
      else {
        // 5) Query back the mapping
        db.all(
          'SELECT skill_id, name FROM skill ORDER BY skill_id;',
          (err, rows) => {
            if (err) {
              console.error('Error querying skills:', err.message);
            } else {
              console.log('\n📋 Skill_ID → Name mapping:');
              rows.forEach(r => {
                console.log(`${r.skill_id} → ${r.name}`);
              });
            }
            db.close();
          }
        );
      }
    });
  });
}

seedSkills();
