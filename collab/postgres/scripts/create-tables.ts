import fs from 'fs';
import path from 'path';
import type { PendingQuery } from 'postgres';
import postgres from 'postgres';

// these details must match those in ../../docker-compose.yml
const sql = postgres({
  host                 : 'localhost',
  port                 : 6432,
  database             : 'collaboration',
  username             : 'ec',
  password             : 'ec',
});

const directory = path.join(__dirname, '..');
const fileExtension = '.sql';

const migrate = async () => {
  const processes: Array<PendingQuery<readonly never[]>> = [];
  fs.readdirSync(directory)
    .filter(file => file.endsWith(fileExtension))
    .forEach(file => {
      processes.push(sql.file(`${directory}/${file}`))
  })
  await Promise.all(processes);
}

migrate().then(() => {
  console.log('Database migration complete');
  process.exit(0);
}).catch((err) => {
  console.error(`Error running database migration: ${err}`);
  process.exit(1);
});









