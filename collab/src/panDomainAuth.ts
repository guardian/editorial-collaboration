import {
    AuthenticationStatus,
    guardianValidation,
    PanDomainAuthentication
} from "@guardian/pan-domain-node";
import { AWS_REGION, STAGE } from "./constants";
import type { Stage } from "./types/stage";

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

export const getVerifiedUserEmail = async (
    cookieHeader: string
): Promise<null | string> => {
    const { status, user } = await panda.verify(cookieHeader);
    return status === AuthenticationStatus.AUTHORISED && user !== undefined ? user.email : null;
};