import { LoginAction } from "../actions";
import { AppState } from "../state";

export default function LoginReducer(state: AppState, action: LoginAction): AppState {

    if (action.type === "loginInProgress") {
        return {
            ...state,
            loginInProgress: true,
            loginErrorMessage: null,
        }

    } else if (action.type === "loginError") {
        return {
            ...state,
            loginInProgress: false,
            loggedInAs: null,
            loginErrorMessage: action.meta.message
        }
    
    } else if (action.type === "loginSuccess") {
        return {
            ...state,
            loginInProgress: false,
            loggedInAs: {
                accessToken: {
                    token: action.meta.accessToken,
                    expiry: action.meta.accessTokenExpiry,
                },
                refreshToken: {
                    token: action.meta.refreshToken,
                    expiry: action.meta.refreshTokenExpiry,
                },
                user: action.meta.user,
            },
            loginErrorMessage: null,
        }
    
    } else {
        throw new Error("Unknown login action type: " + (action as any).type);
    }
}