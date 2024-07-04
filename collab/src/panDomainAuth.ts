import {
    AuthenticationStatus,
    guardianValidation,
    PanDomainAuthentication
} from "@guardian/pan-domain-node";
import { AWS_REGION, DOMAIN } from "./constants";

export const pandaSettingsBucketName = "pan-domain-auth-settings";
export const pandaPublicConfigFilename = `${DOMAIN}.settings.public`;

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