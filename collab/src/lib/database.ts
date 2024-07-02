import { SecretsManager } from "./aws";

class Database {
  private getPrivateConfig = async (stage: string) => {
    const SecretId = `/${stage}/flexible/editorial-collaboration/db`;
    return await SecretsManager.getInstance().getSecretValue(SecretId);
  }
}

const database = new Database();

export { database };