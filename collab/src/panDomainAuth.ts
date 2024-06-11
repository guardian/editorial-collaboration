import {
    AuthenticationStatus,
    guardianValidation,
    PanDomainAuthentication
} from "@guardian/pan-domain-node";
import {AWS_REGION} from "./constants";
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

const panda = new PanDomainAuthentication(
    pandaCookieName,
    AWS_REGION,
    pandaSettingsBucketName,
    pandaPublicConfigFilename,
    guardianValidation
);

export const verify = async (
    cookieHeader: string
): Promise<boolean> => {
    const { status } = await panda.verify(cookieHeader);
    return status === AuthenticationStatus.AUTHORISED;
};