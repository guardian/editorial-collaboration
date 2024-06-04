import {AuthenticationStatus, guardianValidation, PanDomainAuthentication} from "@guardian/pan-domain-node";
import type {NextFunction, Request, RequestHandler, Response} from "express";
import {AWS_REGION} from "../constants";
import {pandaCookieName, pandaPublicConfigFilename, pandaSettingsBucketName} from "../panDomainAuth";

const panda = new PanDomainAuthentication(
    pandaCookieName,
    AWS_REGION,
    pandaSettingsBucketName,
    pandaPublicConfigFilename,
    guardianValidation
);

export const authMiddleware = (
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const maybeCookieHeader = req.header("Cookie");
        if (maybeCookieHeader === undefined) {
            return res.sendStatus(403);
        }
        const {status} = await panda.verify(maybeCookieHeader);
        return status === AuthenticationStatus.AUTHORISED ? next() : res.sendStatus(403);
    }
/*
    We cast to RequestHandler to avoid an eslint "no-misused-promises" error.
    This is not ideal, but there is a known issue with express types:
    https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
*/
) as RequestHandler;