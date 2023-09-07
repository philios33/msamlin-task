import { createContext, useContext } from "react";
import { IAuthClient } from "../clients/authClient";

const AuthClientContext = createContext<null | IAuthClient>(null);

export default AuthClientContext;

export function useAuthClient() {
    return useContext(AuthClientContext);
}