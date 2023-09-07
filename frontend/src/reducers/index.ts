import { Action } from "../actions";
import { AppState, defaultState } from "../state";
import LoadResourceReducer from "./loadResource";
import LoginReducer from "./login";
import SignupReducer from "./signup";

export default function(state: AppState | undefined, action: Action): AppState {
    if (typeof state === "undefined") {
        return defaultState;
    }

    if (action.type === "loginInProgress" || action.type === "loginError" || action.type === "loginSuccess") {
        return LoginReducer(state, action);
    }

    if (action.type === "signupInProgress" || action.type === "signupError" || action.type === "signupSuccess") {
        return SignupReducer(state, action);
    }

    if (action.type === "loadResourceInProgress" || action.type === "loadResourceError" || action.type === "loadResourceSuccess") {
        return LoadResourceReducer(state, action);
    }

    if (action.type === "logout") {
        return {
            ...state,
            loggedInAs: null
        }
    }

    return state;
}