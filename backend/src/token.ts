
import jwt from 'jsonwebtoken';

const accessTokenExpiry = 30; // 30 seconds only

const sharedSymmetricKey = "1234";
const issuerValue = "msamlinTask";
const audienceValue = "msamlinTask";

export function signAccessToken(userId: string) {

    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + accessTokenExpiry);

    const token = jwt.sign({
        sub: userId, // Subject claim is the user id
    }, sharedSymmetricKey, {
        algorithm: "HS256",
        issuer: issuerValue,
        audience: audienceValue,
        expiresIn: accessTokenExpiry,
    });
    
    return {
        accessToken: token,
        accessTokenExpiry: expiryDate,
    }
}

export function verifyAccessToken(token: string) {
    const decoded = jwt.verify(token, sharedSymmetricKey, {
        algorithms: ["HS256"],
        issuer: issuerValue,
        audience: audienceValue,
    });
    if (typeof decoded === "string") {
        throw new Error("jwt.verify returned a string");
    }
    return decoded;
}
