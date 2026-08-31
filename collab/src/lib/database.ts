import type { Sql } from 'postgres';
import postgres from 'postgres';
import { STAGE } from '../constants';
import type { Json } from '../types/json';
import type { StepModel } from '../types/step';
import { SecretsManager } from './aws';

type DatabaseConfig = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: 'require';
}

const isDatabaseConfig = (json: Json): json is DatabaseConfig => {
  return (
    typeof json === "object" &&
    json != null &&
    "host" in json && typeof json["host"] === 'string' &&
    "port" in json && typeof json["port"] === 'string' &&
    "database" in json && typeof json["database"] === 'string' &&
    "username" in json && typeof json["username"] === 'string' &&
    "password" in json && typeof json["password"] === 'string'
  );
};

const parseDatabaseConfig = (json: Json): DatabaseConfig => {
  if (isDatabaseConfig(json)) {
    return json;
  } else {
    throw Error('Could not parse database config');
  }
};

class Database {
  private sql: Sql | undefined;

  private config = async (): Promise<DatabaseConfig> => {
    if (STAGE === 'LOCAL') {
      return {
        host: process.env['db.host'] ?? '',
        port: parseInt(process.env['db.port'] ?? ''),
        database: process.env['db.database'] ?? '',
        username: process.env['db.username'] ?? '',
        password: process.env['db.password'] ?? '',
      }
    } else {
      // TODO: parameterise this value with stack and appName
      const SecretId = `/${STAGE}/flexible/editorial-collaboration/db`;
      return await SecretsManager.getInstance().getSecretValue(SecretId).then(res => {
        return {
          ...parseDatabaseConfig(res),
          ssl: 'require'
        }
      });
    }
  };

  private connect = async (): Promise<Sql> => {
    if (this.sql === undefined) {
      return await this.config()
        .then((config: DatabaseConfig) => {
          this.sql = postgres(config);
          return this.sql;
        });
    } else {
      return this.sql;
    }
  };

  public saveSteps = async (id: string, steps: StepModel[]) => {
    const timestamp: number = Date.now();
    const values = steps.map((step) => {
      return { id, timestamp, content: step };
    });
    await this.connect()
      .then((sql: Sql) => sql`INSERT INTO step ${sql(values)}`)
      .catch((err) => console.error(err)); // TODO: logging/alerting
  };

  public listDocumentIds = async (): Promise<string[]> => {
    const sql = await this.connect();
    const rows = (await sql`SELECT DISTINCT id FROM step`) as Array<{ id: string }>;
    return rows.map((row) => row.id);
  };

  public getStepsForDocument = async (id: string) => {
    const sql = await this.connect();
    const rows = (await sql`SELECT * FROM step WHERE id=${id} ORDER BY timestamp`) as Array<{
      id: string;
      timestamp: string;
      content: StepModel;
    }>;

    return rows
      .map((row) => ({
        timestamp: new Date(row.timestamp),
        step: row.content,
      }));
  };
}

const database = new Database();

export { database };