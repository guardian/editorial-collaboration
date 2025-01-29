import type {NextFunction, Request, Response} from "express";
import { getVerifiedUser } from "../panDomainAuth";

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
        const maybeVerifiedUser = await getVerifiedUser(maybeCookieHeader);
        if (maybeVerifiedUser !== null) {
            res.locals["user"] = maybeVerifiedUser;
            return next();
        } else {
            return res.status(403).send();
        }
    }
);