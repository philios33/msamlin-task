import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../state';
import { useNavigate } from 'react-router-dom';
import { useAuthClient } from '../../contexts/authClient';
import { SignupError, SignupInProgress, SignupSuccess } from '../../actions';


export default function Signup() {

    const signupErrorMessage = useSelector((state: AppState) => {
        return state.signupErrorMessage;
    });
    const signupInProgress = useSelector((state: AppState) => {
        return state.signupInProgress;
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authClient = useAuthClient();

    const nameInput = useRef<HTMLInputElement>(null);
    const emailInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);

    const [abortController, setAbortController] = useState(new AbortController());

    const signupSubmit = async(e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (authClient === null) {
            return;
        }
        
        dispatch<SignupInProgress>({
            type: "signupInProgress",
            meta: {}
        });


        const name = nameInput.current?.value || "";
        const email = emailInput.current?.value || "";
        const password = passwordInput.current?.value || "";

        try {
            const result = await authClient.userSignup(name, email, password, "recaptcha123", abortController.signal);

            dispatch<SignupSuccess>({
                type: "signupSuccess",
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
            dispatch<SignupError>({
                type: "signupError",
                meta: {
                    message: (e as Error).message
                }
            });
        }
    }

    useEffect(() => {
        console.log("Sign up component mounted");
        return () => {
            console.log("Sign up component UNmounted");
            abortController.abort();
        }
    }, []);

    return <div className={styles.Root}>
        <h1>Signup</h1>

        <form>
            <div>
                <label>Name:</label>
                <input ref={nameInput} />
            </div>
            <div>
                <label>Email:</label>
                <input ref={emailInput} />
            </div>
            <div>
                <label>Password:</label>
                <input ref={passwordInput} type="password"/>
            </div>
            <div>
                {signupInProgress && (
                    <p>SPINNER GOES HERE (in progress)</p>
                )}
                {signupErrorMessage !== null && (
                    <p>ErrorMessage: {signupErrorMessage}</p>
                )}
                <input disabled={signupInProgress} type="submit" onSubmit={(e) => signupSubmit(e)} value="Sign up" />
            </div>
        </form>
    </div>
}