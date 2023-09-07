import { SignupAction } from "../actions";
import { AppState } from "../state";

export default function SignupReducer(state: AppState, action: SignupAction): AppState {

    if (action.type === "signupInProgress") {
        return {
            ...state,
            signupInProgress: true,
            signupErrorMessage: null,
        }

    } else if (action.type === "signupError") {
        return {
            ...state,
            signupInProgress: false,
            loggedInAs: null,
            signupErrorMessage: action.meta.message
        }
    
    } else if (action.type === "signupSuccess") {
        return {
            ...state,
            signupInProgress: false,
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
            signupErrorMessage: null,
        }
    
    } else {
        throw new Error("Unknown signup action type: " + (action as any).type);
    }
}