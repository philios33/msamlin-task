import mysql from 'mysql2/promise';
import { checkPassword, hashPassword } from './password';
import { v4 as uuid } from 'uuid';

const dbName = "msamlin";

export type DBUser = {
    id: string
    email: string
    name: string
    passwordHash: string
    createdAt: Date
}

export type DBRefreshToken = {
    id: string
    sessionId: string
    userId: string
    invalidated: boolean
    sessionExpiry: Date
}

export type UserAndRefreshToken = {
    refreshToken: string,
    refreshTokenExpiry: Date,
    user: DBUser,
}

function returnFirstRowFound<T>(result: any) {
    if (result[0] instanceof Array) {
        const results = result[0];
        if (results.length > 0) {
            return results[0] as T;
        } else {
            return null;
        }
    } else {
        console.error(result);
        throw new Error("Unexpected mysql response");
    }
}

export default class Database {

    config: mysql.ConnectionOptions;
    connection: mysql.Connection | null;

    constructor(config: mysql.ConnectionOptions) {
        this.config = config;
        this.connection = null;
    }

    async connect() {
        this.connection = await mysql.createConnection(this.config);
        await this.connection.query("CREATE DATABASE IF NOT EXISTS " + dbName);
        await this.connection.query("USE " + dbName);
        await this.createTables();
    }

    private getConnection() {
        if (this.connection === null) {
            throw new Error("Not connected to the database");
        }
        return this.connection;
    }

    private async createTables() {
        await this.getConnection().execute(`
        CREATE TABLE IF NOT EXISTS users (
            id varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            name varchar(255) NOT NULL, 
            passwordHash varchar(100) NOT NULL,
            createdAt TIMESTAMP NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY (email)
        );`);

        await this.getConnection().execute(`
        CREATE TABLE IF NOT EXISTS refreshToken (
            id varchar(255) NOT NULL,
            sessionId varchar(255) NOT NULL,
            userId varchar(255) NOT NULL,
            invalidated BOOLEAN NOT NULL,
            sessionExpiry TIMESTAMP NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (userId)
                REFERENCES users(id)
                ON DELETE CASCADE,
            INDEX (sessionId)
        );`);
    }

    async createNewUser(name: string, email: string, password: string) {
        if (email.length < 3) {
            throw new Error("Email too short");
        }
        if (email.length > 255) {
            throw new Error("Email too long");
        }
        if (name.length < 1) {
            throw new Error("Name too short");
        }
        if (name.length > 255) {
            throw new Error("Name too long");
        }
        if (password.length < 9) {
            throw new Error("Password too short");
        }

        const passwordHash = hashPassword(password)
        const id = uuid();

        await this.getConnection().query(`INSERT INTO users (id, email, name, passwordHash, createdAt) values (?, ?, ?, ?, NOW());`, [id, email, name, passwordHash]);

        return id;
    }

    async loginUser(email: string, password: string) {
        const invalidCredentialsMessage = "Invalid email or password";
        const user = await this.getUserByEmail(email);
        if (user !== null) {
            const passwordMatch = checkPassword(password, user.passwordHash);
            if (passwordMatch) {
                return user;
            } else {
                throw new Error(invalidCredentialsMessage);
            }
        } else {
            // Note: This avoids timing attacks
            const dummyHash = "";
            checkPassword(password, dummyHash);
            throw new Error(invalidCredentialsMessage);
        }
    }

    async getUserByEmail(email: string) : Promise<DBUser | null> {
        const user = await this.getConnection().query(`SELECT * FROM users WHERE email = ?;`, [email]);
        return returnFirstRowFound<DBUser>(user);
    }
    async getUserById(id: string) : Promise<DBUser | null> {
        const user = await this.getConnection().query(`SELECT * FROM users WHERE id = ?;`, [id]);
        return returnFirstRowFound<DBUser>(user);
    }

    async getRefreshTokenById(token: string) : Promise<DBRefreshToken | null> {
        const refreshToken = await this.getConnection().query(`SELECT * FROM refreshToken WHERE id = ?;`, [token]);
        return returnFirstRowFound<DBRefreshToken>(refreshToken);
    }

    async startRefreshSession(userId: string) : Promise<UserAndRefreshToken> {
        const user = await this.getUserById(userId); // Ensures user exists
        if (user === null) {
            throw new Error("Unknown user id: " + userId);
        }
        const refreshToken = uuid();
        const sessionId = uuid();

        const refreshTokenExpiry = new Date();
        refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 1); // Add 1 day

        await this.getConnection().query(`INSERT INTO refreshToken (id, sessionId, userId, invalidated, sessionExpiry) values (?, ?, ?, FALSE, ?);`, [refreshToken, sessionId, userId, refreshTokenExpiry]);

        return {
            refreshToken,
            refreshTokenExpiry,
            user,
        }
    }

    private async invalidateRefreshTokensForSession(sessionId: string) {
        await this.getConnection().query(`UPDATE refreshToken SET invalidated=TRUE WHERE sessionId = ?;`, [sessionId]);
    }

    async useRefreshToken(refreshTokenId: string) : Promise<UserAndRefreshToken> {
        const refreshTokenRow = await this.getRefreshTokenById(refreshTokenId);
        if (refreshTokenRow === null) {
            throw new Error("Not found refresh token id: " + refreshTokenId);
        }

        const sessionId = refreshTokenRow.sessionId;

        // Refresh token was found
        const userId = refreshTokenRow.userId;
        const user = await this.getUserById(userId);

        // Invalidate all refresh tokens for this session
        await this.invalidateRefreshTokensForSession(sessionId);

        if (user === null) {
            // Should never happen since we have referential integrity enabled in MYSQL
            throw new Error("User no longer exists, session ended");
        }

        if (refreshTokenRow.invalidated) {
            // Replay attack detected, this refresh token has already been used and so has been rotated
            // We do not create a new refresh token and the session is effectively ended
            throw new Error("This token is already rotated, session ended");
        }

        const now = new Date();
        if (refreshTokenRow.sessionExpiry < now) {
            // The expiry of the session has been reached
            // We do not create a new refresh token and the session is effectively ended
            throw new Error("This session cannot be extended further, session ended");
        }

        // Create a new refresh token for this session
        const newRefreshToken = uuid();
        const refreshExpiry = refreshTokenRow.sessionExpiry;
        
        await this.getConnection().query(`INSERT INTO refreshToken (id, sessionId, userId, invalidated, sessionExpiry) values (?, ?, ?, FALSE, ?);`, [newRefreshToken, sessionId, userId, refreshExpiry]);

        return {
            refreshToken: newRefreshToken,
            refreshTokenExpiry: refreshExpiry,
            user,
        }
    }

}
