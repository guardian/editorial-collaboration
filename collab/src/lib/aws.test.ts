import {
  GetSecretValueCommand,
  SecretsManagerClient
} from '@aws-sdk/client-secrets-manager';
import type { AwsError } from 'aws-sdk-client-mock';
import { mockClient} from 'aws-sdk-client-mock';
import { SecretsManager } from './aws';

describe('SecretsManager', () => {
  const AWSSecretsManagerClientMock = mockClient(SecretsManagerClient);

  it('should return an instance of SecretsManager', () => {
    expect(SecretsManager.getInstance()).toBeInstanceOf(SecretsManager);
  });

  it('should reject when SecretString is not JSON', async () => {
    AWSSecretsManagerClientMock.on(GetSecretValueCommand).resolves({ SecretString: 'notJson'});
    await expect(SecretsManager.getInstance().getSecretValue('SecretId')).rejects.toContain('SyntaxError');
  });

  it('should reject when SecretString is absent', async () => {
    AWSSecretsManagerClientMock.on(GetSecretValueCommand).resolves({});
    await expect(SecretsManager.getInstance().getSecretValue('SecretId')).rejects.toContain('SyntaxError');
  });

  it('should reject when aws client throws an Error', async () => {
    const error: AwsError = {
      Code: 'ERR_UNHANDLED_REJECTION',
      message: 'The security token included in the request is expired',
      name: 'ExpiredTokenException',
    };
    AWSSecretsManagerClientMock.on(GetSecretValueCommand).rejects(error);
    await expect(SecretsManager.getInstance().getSecretValue('SecretId')).rejects.toContain('ExpiredTokenException');
  });

  it('should resolve to a Json object when SecretString is valid JSON', async () => {
    AWSSecretsManagerClientMock.on(GetSecretValueCommand).resolves({ SecretString: '{ "hey": "ho" }'});
    await expect(SecretsManager.getInstance().getSecretValue('SecretId')).resolves.toEqual({ hey: 'ho' });
  });
})