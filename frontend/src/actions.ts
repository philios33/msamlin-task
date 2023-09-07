
export type GenericAction<T, M> = { type: T, meta: M }

// Login actions

export type LoginInProgress = GenericAction<"loginInProgress", {}>;
export type LoginError = GenericAction<"loginError", {message: string}>;
export type LoginSuccess = GenericAction<"loginSuccess", {
    accessToken: string
    accessTokenExpiry: string
    refreshToken: string
    refreshTokenExpiry: string
    user: {
        id: string
        email: string
        name: string
    }
}>;

export type LoginAction = LoginInProgress | LoginError | LoginSuccess;

// Signup actions

export type SignupInProgress = GenericAction<"signupInProgress", {}>;
export type SignupError = GenericAction<"signupError", {message: string}>;
export type SignupSuccess = GenericAction<"signupSuccess", {
    accessToken: string
    accessTokenExpiry: string
    refreshToken: string
    refreshTokenExpiry: string
    user: {
        id: string
        email: string
        name: string
    }
}>;

export type SignupAction = SignupInProgress | SignupError | SignupSuccess;


export type LogoutAction = GenericAction<"logout", {}>;


export type LoadResourceInProgress = GenericAction<"loadResourceInProgress", {}>;
export type LoadResourceError = GenericAction<"loadResourceError", {message: string}>;
export type LoadResourceSuccess = GenericAction<"loadResourceSuccess", {
    data: string
}>;

export type LoadResourceAction = LoadResourceInProgress | LoadResourceError | LoadResourceSuccess;

export type Action = LoginAction | SignupAction | LogoutAction | LoadResourceAction;