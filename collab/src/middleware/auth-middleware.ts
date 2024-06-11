import type {NextFunction, Request, Response} from "express";
import {verify} from "../panDomainAuth";

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
        const isVerified = await verify(maybeCookieHeader);
        return isVerified ? next() : res.status(403).send();
    }
);