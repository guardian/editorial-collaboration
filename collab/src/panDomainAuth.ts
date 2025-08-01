import { fromIni, fromNodeProviderChain } from "@aws-sdk/credential-providers";
import type {
    AuthenticationResult} from "@guardian/pan-domain-node";
import {
    guardianValidation,
    PanDomainAuthentication
} from "@guardian/pan-domain-node";
import {AWS_REGION, DOMAIN, LOCAL_PROFILE, STAGE} from "./constants";

export const pandaSettingsBucketName = "pan-domain-auth-settings";
export const pandaPublicConfigFilename = `${DOMAIN}.settings.public`;

export const pandaCookieName = "gutoolsAuth-assym";
const panda = new PanDomainAuthentication(
    pandaCookieName,
    AWS_REGION,
    pandaSettingsBucketName,
    pandaPublicConfigFilename,
    guardianValidation,
    STAGE==='LOCAL' ? fromIni({ profile: LOCAL_PROFILE }):  fromNodeProviderChain(),
);

export const getVerifiedUserEmail = async (
    cookieHeader: string
): Promise<null | string> => {
    const  result :AuthenticationResult  = await panda.verify(cookieHeader);
    return result.success ? result.user.email : null;
};