type Token = {
    token: string,
    expiry: string,
}

type User = {
    id: string
    email: string
    name: string
}

export type AppState = {
    loggedInAs: null | {
        user: User
        accessToken: Token
        refreshToken: Token
    }

    loginInProgress: boolean
    loginErrorMessage: null | string
    
    signupInProgress: boolean
    signupErrorMessage: null | string

    loadResourceInProgress: boolean
    loadResourceErrorMessage: null | string
    loadResourceData: null | string
}

export const defaultState: AppState = {
    loggedInAs: null,

    loginInProgress: false,
    loginErrorMessage: null,

    signupInProgress: false,
    signupErrorMessage: null,

    loadResourceInProgress: false,
    loadResourceErrorMessage: null,
    loadResourceData: null,
}