import http from 'http';
import https from 'https';

import getCertificateCredentials from './certificate';
import getExpressApp from './express';
import Database from './database';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';

const credentials = getCertificateCredentials();

const db = new Database({
    host: "localhost",
    port: 13306,
    user: "root",
    password: "my-secret-pw",
    // database: "msamlin",
});

const app = getExpressApp(db);

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const startServerOnPort = async (server: HttpServer | HttpsServer, port: number) => {
    return new Promise((resolve, reject) => {
        try {
            server.on("error", (err) => {
                reject(err);
            });
            server.listen(port, () => {
                console.log("Listening on port " + port);
                resolve(null);
            });
        } catch(e) {
            reject(e);
        }
    });
}

(async () => {
    try {
        console.log("Connecting to mysql...");
        await db.connect();
        console.log("Connected");

        await startServerOnPort(httpServer, 8081); // This is insecure but useful for tests

        await startServerOnPort(httpsServer, 8443);
        console.log("Started up backend successfully");

        // await db.createNewUser("phil@code67.com", "Philip Nicholls", "myPass123!");
        // console.log("Created user");

        //const user = await db.getUserByEmail("phil@code67.com");
        //console.log("Found user", user);

        // const user = await db.loginUser("phil@code67.com", "myPass123!");
        // console.log("Logged in user", user);

    } catch(e) {
        console.error("Startup failed");
        console.error(e);
        process.exit(1);
    }
})();
