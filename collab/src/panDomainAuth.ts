import type { Stage } from "./types/stage";

const maybeStage = process.env["STAGE"];
const STAGE: Stage = maybeStage !== undefined && ["PROD", "CODE", "LOCAL"].includes(maybeStage)
        ? maybeStage as Stage
        : "LOCAL";

const pandaConfigFilenameLookup: { [stage in Stage]: string } = {
    PROD: "gutools.co.uk.settings",
    CODE: "code.dev-gutools.co.uk.settings",
    LOCAL: "local.dev-gutools.co.uk.settings",
} as const;

export const pandaSettingsBucketName = "pan-domain-auth-settings";
export const pandaPublicConfigFilename = `${pandaConfigFilenameLookup[STAGE]}.public`;

export const pandaCookieName = "gutoolsAuth-assym";