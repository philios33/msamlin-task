// The Auth client makes RESTful API requests to the Auth server
import axios from 'axios';

export interface IAuthClient {
    userSignup(name: string, email: string, password: string, recaptchaToken: string, abortSignal: AbortSignal) : Promise<UserLoginResult>;
    userLogin(email: string, password: string, recaptchaToken: string, abortSignal: AbortSignal) : Promise<UserLoginResult>;
    useRefreshToken(refreshToken: string) : Promise<UserLoginResult>;
}

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

export class AuthClient implements IAuthClient {
    private authEndpoint: string;

    constructor(authEndpoint: string) {

        this.authEndpoint = authEndpoint;
        
        console.log("Constructed Auth Client: " + this.authEndpoint);
    }

    async userLogin(email: string, password: string, recaptchaToken: string, abortSignal: AbortSignal) {
        const url = this.authEndpoint + "/login";
        const result = await axios<UserLoginResult | ErrorResult>({
            url,
            method: "POST",
            data: JSON.stringify({
                email,
                password,
                recaptchaToken,
            }),
            headers: {
                'content-type': 'application/json',
            },
            timeout: 10 * 1000,
            validateStatus: () => true,
            signal: abortSignal,
        });
        if (result.status === 200) {
            return result.data as UserLoginResult;
        } else if (result.status === 500) {
            console.error("500 from user login");
            console.error(result.data);
            throw new Error("Error: " + (result.data as ErrorResult).errorMessage);
        } else {
            throw new Error("Unexpected status: " + result.status);
        }
    }

    async userSignup(name: string, email: string, password: string, recaptchaToken: string, abortSignal: AbortSignal) {
        const url = this.authEndpoint + "/signup";
        const result = await axios<UserLoginResult | ErrorResult>({
            url,
            method: "POST",
            data: JSON.stringify({
                name,
                email,
                password,
                recaptchaToken,
            }),
            headers: {
                'content-type': 'application/json',
            },
            timeout: 10 * 1000,
            validateStatus: () => true,
            signal: abortSignal,
        });
        if (result.status === 200) {
            return result.data as UserLoginResult;
        } else if (result.status === 500) {
            console.error("500 from user signup");
            console.error(result.data);
            throw new Error("Error: " + (result.data as ErrorResult).errorMessage);
        } else {
            throw new Error("Unexpected status: " + result.status);
        }
    }

    async useRefreshToken(refreshToken: string) {
        const url = this.authEndpoint + "/refresh";
        const result = await axios<UserLoginResult | ErrorResult>({
            url,
            method: "POST",
            data: JSON.stringify({
                refreshToken
            }),
            headers: {
                'content-type': 'application/json',
            },
            timeout: 10 * 1000,
            validateStatus: () => true,
            // signal: abortSignal,
        });
        if (result.status === 200) {
            return result.data as UserLoginResult;
        } else if (result.status === 500) {
            console.error("500 from user signup");
            console.error(result.data);
            throw new Error("Error: " + (result.data as ErrorResult).errorMessage);
        } else {
            throw new Error("Unexpected status: " + result.status);
        }
    }
}