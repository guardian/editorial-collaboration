import { fromIni, fromNodeProviderChain } from "@aws-sdk/credential-providers";
import {
    guardianValidation,
    PanDomainAuthentication
} from "@guardian/pan-domain-node";
import {AWS_REGION, DOMAIN, LOCAL_PROFILE, STAGE} from "./constants";

export const pandaSettingsBucketName = "pan-domain-auth-settings";
export const pandaPublicConfigFilename = `${DOMAIN}.settings.public`;

export const pandaCookieName = "gutoolsAuth-assym";
let panda: Promise<PanDomainAuthentication> | undefined;

export const getVerifiedUserEmail = async (
    cookieHeader: string
): Promise<null | string> => {
    panda ??= PanDomainAuthentication.builder({
        cookieName: pandaCookieName,
        region: AWS_REGION,
        bucket: pandaSettingsBucketName,
        keyFile: pandaPublicConfigFilename,
        validateUser: guardianValidation,
        credentialsProvider: STAGE === "LOCAL" ? fromIni({ profile: LOCAL_PROFILE }) : fromNodeProviderChain(),
    }).catch((error: unknown) => {
        panda = undefined;
        throw error;
    });
    const result = await (await panda).verify(cookieHeader);
    return result.success ? result.user.email : null;
};