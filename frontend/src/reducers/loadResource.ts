import { LoadResourceAction } from "../actions";
import { AppState } from "../state";

export default function LoadResourceReducer(state: AppState, action: LoadResourceAction): AppState {

    if (action.type === "loadResourceInProgress") {
        return {
            ...state,
            loadResourceInProgress: true,
            loadResourceErrorMessage: null,
            loadResourceData: null,
        }

    } else if (action.type === "loadResourceError") {
        return {
            ...state,
            loadResourceInProgress: false,
            loadResourceData: null,
            loadResourceErrorMessage: action.meta.message
        }
    
    } else if (action.type === "loadResourceSuccess") {
        return {
            ...state,
            loadResourceData: action.meta.data,
            loadResourceInProgress: false,
            loadResourceErrorMessage: null,
        }
    
    } else {
        throw new Error("Unknown load resource action type: " + (action as any).type);
    }
}