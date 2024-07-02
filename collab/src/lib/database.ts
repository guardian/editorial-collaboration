import type { Json } from '../types/json';
import { SecretsManager } from './aws';

type DatabaseConfig = {
  host: string;
  port: string;
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
}

class Database {
  private getPrivateConfig = async (stage: string): Promise<DatabaseConfig> => {
    const SecretId = `/${stage}/flexible/editorial-collaboration/db`;
    return await SecretsManager.getInstance().getSecretValue(SecretId).then(res => parseDatabaseConfig(res));
  }
}

const database = new Database();

export { database };