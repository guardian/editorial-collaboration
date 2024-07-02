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
    const SecretId = `/${STAGE}/flexible/editorial-collaboration/db`;
    return await SecretsManager.getInstance().getSecretValue(SecretId).then(res => parseDatabaseConfig(res));
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
}

const database = new Database();

export { database };