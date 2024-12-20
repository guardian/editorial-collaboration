import type { Row, Sql } from 'postgres';
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

const isDocument = (row?: Row | null): row is { document: Json } => {
  return (
    typeof row === "object" &&
    row != null &&
    "document" in row
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
    const values = steps.map(step => { return { id, timestamp, content: step }})
    await this.connect()
      .then((sql: Sql) => sql`INSERT INTO step ${ sql(values) }`)
      .catch(err => console.error(err)) // TODO: logging/alerting
  };

  public saveDocument = async (id: string, document: Json) => {
    const timestamp: number = Date.now();
    const values = { id, timestamp, document }
    const existingDoc = await this.connect()
      .then((sql: Sql) => sql`SELECT document FROM document WHERE id=${id}`)
      .catch(err => console.error(err)); // TODO: logging/alerting;

    if (existingDoc == null || existingDoc.length === 0) {
      await this.connect()
        .then((sql: Sql) => sql`INSERT INTO document ${ sql(values) }`)
        .catch(err => console.error(err)) // TODO: logging/alerting
    }
  };

  public getSteps = async (id: string) =>
    await this.connect()
      .then((sql: Sql) => sql`SELECT timestamp, content FROM step WHERE id=${id}`)
      .catch(err => console.error(err)) // TODO: logging/alerting

  public getDocument = async (id: string) =>
    await this.connect()
      .then((sql: Sql) => sql`SELECT document FROM document WHERE id=${id}`)
      .then(result => {
        if (result.length > 0 && isDocument(result[0])) {
          return result[0].document;
        } return null;
      }).catch(err => console.error(err)) // TODO: logging/alerting
}

const database = new Database();

export { database };