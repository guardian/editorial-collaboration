import type { GetSecretValueCommandOutput } from '@aws-sdk/client-secrets-manager';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { AWS_REGION, LOCAL_PROFILE } from '../constants';
import type { Json } from '../types/json';

class SecretsManager {
  private static instance: SecretsManager | undefined;
  private client: SecretsManagerClient;

  private constructor() {
    this.client = new SecretsManagerClient({
      region: AWS_REGION,
      credentials: fromNodeProviderChain({
        profile: LOCAL_PROFILE,
      })
    });
  }

  static getInstance = () => {
    if (this.instance !== undefined) {
      return this.instance;
    }
    this.instance = new SecretsManager();
    return this.instance;
  }

  public getSecretValue = async (SecretId: string): Promise<Json> => {
    try {
      const command: GetSecretValueCommand = new GetSecretValueCommand({ SecretId });
      return await this.client.send(command).then((res: GetSecretValueCommandOutput) => JSON.parse(res.SecretString ?? '') as Json);
    } catch (err: unknown) {
      const getErrorMessage = () => {
        if (typeof err === "string") {
          return err
        } else if (err instanceof Error) {
          return `${err.name}: ${err.message}`
        } else {
          return String(err);
        }
      }
      return Promise.reject(getErrorMessage());
    }
  }

}

export { SecretsManager };