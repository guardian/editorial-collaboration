import type { Stage } from "./types/stage";

export const AWS_REGION = 'eu-west-1';

// TODO change profile to workflow when we migrate the service across accounts
export const LOCAL_PROFILE = 'composer';

const maybeStage = process.env['STAGE'];
export const STAGE: Stage = maybeStage !== undefined && ['PROD', 'CODE', 'LOCAL'].includes(maybeStage)
  ? maybeStage as Stage
  : "LOCAL";

export const DOMAIN =
  STAGE === 'PROD' ? 'gutools.co.uk' : STAGE === 'CODE' ?
    'code.dev-gutools.co.uk' : 'local.dev-gutools.co.uk';