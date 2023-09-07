
import express, { Response } from 'express';
import path from 'path';
import compression from 'compression';
import cors from 'cors';

import Database from './database';
import { RequestWithAuth, validateJWT } from './jwtMiddleware';
import { signAccessToken } from './token';

const pathToFrontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');

type UserLoginResult = {
    accessToken: string,
    accessTokenExpiry: string,
    refreshToken: string,
    refreshTokenExpiry: string,
    user: {
        id: string,
        email: string,
        name: string,
    }
}
type ErrorResult = {
    errorMessage: string
}



const sleep = (ms: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(null);
        }, ms);
    });
}

export default function getExpressApp(db: Database) {
    const app = express();

    app.use(cors());
    app.use(compression());
    app.use(express.json());

    app.get("/resource/secret", validateJWT(), async (req: RequestWithAuth, res: Response<{data:string}>) => {
        await sleep(3000); // For testing abort controller

        console.log("Used id loaded secret", req.auth?.sub);
        res.send({
            data: "This is a big secret that I only tell special authenticated people",
        });
    });

    app.post("/auth/login", async (req, res: Response<UserLoginResult | ErrorResult>) => {
        try {
            await sleep(3000); // For testing abort controller

            const data = req.body;
            console.log("DATA", data);
            // TODO Validate body is correct format

            // TODO Verify recaptcha challenge response

            // TODO Validate password constraints

            const email = data.email;
            const password = data.password;

            const user = await db.loginUser(email, password);

            const refreshToken = await db.startRefreshSession(user.id);
            const accessToken = signAccessToken(user.id);
            res.send({
                accessToken: accessToken.accessToken,
                accessTokenExpiry: accessToken.accessTokenExpiry.toISOString(),

                refreshToken: refreshToken.refreshToken,
                refreshTokenExpiry: refreshToken.refreshTokenExpiry.toISOString(),

                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                }
            });
        } catch(e) {
            console.log(e);
            res.status(500);
            res.send({
                errorMessage: (e as Error).message,
            });
        }
    });

    app.post("/auth/signup", async (req, res: Response<UserLoginResult | ErrorResult>) => {
        try {
            await sleep(3000); // For testing abort controller

            const data = req.body;
            // TODO Validate body is correct format

            // TODO Verify recaptcha challenge response

            // TODO Validate password constraints

            // TODO Validate name and email formats and length

            const name = data.name;
            const email = data.email;
            const password = data.password;

            const userId = await db.createNewUser(name, email, password);

            const refreshToken = await db.startRefreshSession(userId);
            const accessToken = signAccessToken(userId);

            res.send({
                accessToken: accessToken.accessToken,
                accessTokenExpiry: accessToken.accessTokenExpiry.toISOString(),

                refreshToken: refreshToken.refreshToken,
                refreshTokenExpiry: refreshToken.refreshTokenExpiry.toISOString(),

                user: {
                    id: userId,
                    email: email,
                    name: name,
                }
            });
        } catch(e) {
            console.log(e);
            res.status(500);
            res.send({
                errorMessage: (e as Error).message,
            });
        }
    });


    app.post("/auth/refresh", async (req, res: Response<UserLoginResult | ErrorResult>) => {
        try {
            const data = req.body;
            // TODO Validate body is correct format

            const incomingRefreshToken = data.refreshToken;
            
            const refreshToken = await db.useRefreshToken(incomingRefreshToken); // This rotates the refresh token
            const accessToken = signAccessToken(refreshToken.user.id);

            console.log("Used id refreshed their token", refreshToken.user.id);
            res.send({
                accessToken: accessToken.accessToken,
                accessTokenExpiry: accessToken.accessTokenExpiry.toISOString(),

                refreshToken: refreshToken.refreshToken,
                refreshTokenExpiry: refreshToken.refreshTokenExpiry.toISOString(),

                user: {
                    id: refreshToken.user.id,
                    email: refreshToken.user.email,
                    name: refreshToken.user.name,
                }
            });
        } catch(e) {
            console.log(e);
            res.status(500);
            res.send({
                errorMessage: (e as Error).message,
            });
        }
    });

    // Serve all built frontend resources by hosting the dist dir statically
    app.use("/", express.static(pathToFrontendDist, {
        maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day cache
    }));

    app.use("*", (req, res) => {
        res.sendFile('index.html', { root: pathToFrontendDist } );
    });

    return app;
}