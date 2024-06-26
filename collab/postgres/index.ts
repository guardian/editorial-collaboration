import fs from 'fs';
import path from 'path';
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
  for (const file of fs.readdirSync(directory)
    .filter(f => f.endsWith(fileExtension))
    .sort()) {
      await sql.file(`${directory}/${file}`).catch(err => handleError(err));
  }
};

const handleError = (err: unknown) => {
  if ((err as PostgresError).code === tableAlreadyExistsErrCode) {
    return; // ignore 'table already exists' errors
  } else {
    console.error(`${errorMessage}: ${String(err)}`);
    process.exit(1);
  }
}

migrate()
  .then(() => {
    console.info(successMessage);
    process.exit(0);
  })
  .catch((errors) => {
    console.error(`${errorMessage}: ${errors}`);
    process.exit(1);
});
