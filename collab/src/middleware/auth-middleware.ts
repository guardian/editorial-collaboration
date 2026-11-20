import type {NextFunction, Request, Response} from "express";
import {getVerifiedUser} from "../panDomainAuth";

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
        const maybeAuthenticatedUser = await getVerifiedUser(maybeCookieHeader);
        if (maybeAuthenticatedUser !== null) {
            res.locals["authenticatedUser"] = maybeAuthenticatedUser;
            res.locals["userEmail"] = maybeAuthenticatedUser.email;
            return next();
        } else {
            return res.status(403).send();
        }
    }
);