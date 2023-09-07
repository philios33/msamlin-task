import { Request, Response } from "express"
import { verifyAccessToken } from "./token";
import { JwtPayload } from "jsonwebtoken";

export type RequestWithAuth = Request & {
    auth?: JwtPayload
}

export function validateJWT() {
    return (req: Request, res: Response, next: Function) => {
        try {
            if (req.headers.authorization) {
                const authHeader = req.headers.authorization;
                if (authHeader.startsWith("Bearer ")) {
                    const bearerToken = authHeader.substring(7);
                    const decoded = verifyAccessToken(bearerToken);
                    (req as RequestWithAuth).auth = decoded;
                    next();
                } else {
                    throw new Error("Missing bearer token in authorization header");
                }
            } else {
                throw new Error("Missing authorization header");
            }
        } catch(e) {
            res.status(401);
            next(e);
        }
    }
}