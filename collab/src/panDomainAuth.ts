import type { User } from "@guardian/pan-domain-node";
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

export const getVerifiedUser = async (
    cookieHeader: string
): Promise<null | User> => {
    const { status, user } = await panda.verify(cookieHeader);
    return status === AuthenticationStatus.AUTHORISED && user !== undefined ? user : null;
};