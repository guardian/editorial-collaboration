import fs from 'fs';
import path from 'path';
import type { PendingQuery } from 'postgres';
import postgres from 'postgres';

const directory = path.join(__dirname, 'migrations');
const fileExtension = '.sql';
const tableAlreadyExistsErrCode = '42P07';
const successMessage = 'Database migration complete';
const errorMessage = 'Error running database migration';

type PostgresError = {
  code: string;
}

// these details must match those in ../../docker-compose.yml
const sql = postgres({
  host                 : 'localhost',
  port                 : 6432,
  database             : 'collaboration',
  username             : 'ec',
  password             : 'ec',
});

const migrate = async () => {
  const processes: Array<PendingQuery<readonly never[]>> = [];
  fs.readdirSync(directory)
    .filter(file => file.endsWith(fileExtension))
    .forEach(file => {
      processes.push(sql.file(`${directory}/${file}`))
  })
  return await Promise.allSettled(processes);
};

const isPostgresError = (error: unknown): error is PostgresError => {
  return typeof error === 'object' && 'code' in error!;
};

const handleResults = (results: Array<PromiseSettledResult<Awaited<PendingQuery<readonly never[]>>>>) => {
  const errors: unknown[] = [];
  results.forEach(result => {
    if (result.status === 'rejected') {
      if (isPostgresError(result.reason) && result.reason.code === tableAlreadyExistsErrCode) {
        return; // ignore 'table already exists' errors
      }
      errors.push(result.reason);
    }
  });
  if (errors.length > 0) {
    console.error(`${errorMessage}: ${String(errors)}`);
    process.exit(1);
  }
  console.info(successMessage);
  process.exit(0);
}

migrate()
  .then((results) => handleResults(results))
  .catch((errors) => {
    console.error(`${errorMessage}: ${errors}`);
    process.exit(1);
});
