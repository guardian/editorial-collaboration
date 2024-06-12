import type {NextFunction, Request, Response} from "express";
import {getVerifiedUserEmail} from "../panDomainAuth";

export const authMiddleware = (
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const maybeCookieHeader = req.header("Cookie");
        if (maybeCookieHeader === undefined) {
            return res.status(403).send();
        }
        const maybeAuthenticatedEmail = await getVerifiedUserEmail(maybeCookieHeader);
        if (maybeAuthenticatedEmail !== null) {
            res.locals["userEmail"] = maybeAuthenticatedEmail;
            return next();
        } else {
            return res.status(403).send();
        }
    }
);