import { Request, Response } from "express";
import { validateJWT } from "./jwtMiddleware";
import { signAccessToken } from "./token";
import { TokenExpiredError } from "jsonwebtoken";

const middleware = validateJWT();

describe('Middleware tests', () => {
    test('Allow access with good token', () => {
        const goodToken = signAccessToken("123").accessToken;

        const req = {
            headers: {
                authorization: "Bearer " + goodToken,
            }
        } as Request;
        
        const res = {
            status: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();
        
        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect((req as any).auth.sub).toEqual("123");
    });

    test('Deny access with expired token', () => {
        
        const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJpYXQiOjE2OTQxMTcxMTksImV4cCI6MTY5NDExNzE0OSwiYXVkIjoibXNhbWxpblRhc2siLCJpc3MiOiJtc2FtbGluVGFzayJ9.HIkqrb_9lYhU6kmRh6p8c7hWwifSsOwdhwnqlXgOWMc";

        const req = {
            headers: {
                authorization: "Bearer " + expiredToken,
            }
        } as Request;
        
        const res = {
            status: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();
        
        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(new TokenExpiredError("jwt expired", new Date()));
        expect((req as any).auth).toBeUndefined();
        expect(res.status).toHaveBeenCalledWith(401);
    });

    test('Deny access with non bearer token', () => {
        
        const req = {
            headers: {
                authorization: "Something weird",
            }
        } as Request;
        
        const res = {
            status: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();
        
        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(new Error("Missing bearer token in authorization header"));
        expect((req as any).auth).toBeUndefined();
        expect(res.status).toHaveBeenCalledWith(401);
    });

    test('Deny access with no auth header', () => {
        
        const req = {
            headers: {
            }
        } as Request;
        
        const res = {
            status: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();
        
        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(new Error("Missing authorization header"));
        expect((req as any).auth).toBeUndefined();
        expect(res.status).toHaveBeenCalledWith(401);
    });
});