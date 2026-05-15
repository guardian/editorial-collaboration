import { execSync } from 'child_process';

export default async function globalTeardown() {
  execSync('docker stop collab-e2e-testing-db', { stdio: 'inherit' });
}
