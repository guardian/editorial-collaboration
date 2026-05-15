import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export default async function globalSetup() {
  const containerName = 'collab-e2e-testing-db';

  // Check if container is already running
  try {
    const running = execSync(`docker inspect -f '{{.State.Running}}' ${containerName}`, {
      encoding: 'utf8',
      stdio: 'pipe',
    }).trim();

    if (running === 'true') {
      console.log('Test DB container already running, reusing it.');
      return;
    }
  } catch {
    console.log('Starting test DB container...');
    execSync(
      `docker run --rm -d \
      --name ${containerName} \
      -e POSTGRES_USER=${process.env['db.username']} \
      -e POSTGRES_PASSWORD=${process.env['db.password']} \
      -e POSTGRES_DB=${process.env['db.database']} \
      -p 6433:5432 \
      postgres:16.3-alpine`,
      { stdio: 'inherit' }
    );
  }

  // Wait for postgres to be ready
  const maxRetries = 20;
  for (let i = 0; i < maxRetries; i++) {
    try {
      execSync(`docker exec ${containerName} pg_isready`, { stdio: 'pipe' });
      break;
    } catch {
      if (i === maxRetries - 1) throw new Error('Timed out waiting for test DB');
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log('Test DB is ready, running migrations...');

  execSync('npm run database-migration', {
    stdio: 'inherit',
    env: {
      ...process.env,
      'db.port': '6433',
    }});
}
