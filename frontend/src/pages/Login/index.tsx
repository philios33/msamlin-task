import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

import { LoginError, LoginInProgress, LoginSuccess } from '../../actions';
import { AppState } from '../../state';
import { useAuthClient } from '../../contexts/authClient';
import { useNavigate } from 'react-router-dom';


export default function Login() {
    const loginErrorMessage = useSelector((state: AppState) => {
        return state.loginErrorMessage;
    });
    const loginInProgress = useSelector((state: AppState) => {
        return state.loginInProgress;
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authClient = useAuthClient();

    const emailInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);

    const [abortController, setAbortController] = useState(new AbortController());
    
    const loginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (authClient === null) {
            return;
        }
        
        dispatch<LoginInProgress>({
            type: "loginInProgress",
            meta: {}
        });

        const email = emailInput.current?.value || "";
        const password = passwordInput.current?.value || "";

        try {
            const result = await authClient.userLogin(email, password, "recaptcha123", abortController.signal);

            dispatch<LoginSuccess>({
                type: "loginSuccess",
                meta: {
                    accessToken: result.accessToken,
                    accessTokenExpiry: result.accessTokenExpiry,
                    refreshToken: result.refreshToken,
                    refreshTokenExpiry: result.refreshTokenExpiry,
                    user: result.user,
                }
            });

            navigate("/secure");

        } catch(e) {
            dispatch<LoginError>({
                type: "loginError",
                meta: {
                    message: (e as Error).message
                }
            });
        }
    }

    useEffect(() => {
        console.log("Login component mounted");
        return () => {
            console.log("Login component UNmounted");
            abortController.abort();
        }
    }, []);

    return <div className={styles.Root}>
        <h1>Login</h1>

        <form onSubmit={(e) => loginSubmit(e)} >
            <div>
                <label htmlFor="email">Email:</label>
                <input id="email" ref={emailInput} name="email" />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input id="password" ref={passwordInput} name="password" type="password" />
            </div>
            <div>
                {loginInProgress && (
                    <p>SPINNER GOES HERE (in progress)</p>
                )}
                {loginErrorMessage !== null && (
                    <p>ErrorMessage: {loginErrorMessage}</p>
                )}
                <input disabled={loginInProgress} type="submit" value="Login" />
            </div>
        </form>
    </div>
}