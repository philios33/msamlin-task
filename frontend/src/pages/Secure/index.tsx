import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../state';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthClient } from '../../contexts/authClient';
import { LoadResourceError, LoadResourceInProgress, LoadResourceSuccess, LoginSuccess } from '../../actions';
import { useResourceClient } from '../../contexts/resourceClient';
import styles from './styles.module.scss';

export default function Secure() {

    const navigate = useNavigate();
    const loggedInAs = useSelector((state: AppState) => {
        return state.loggedInAs;
    });

    const loadResourceInProgress = useSelector((state: AppState) => state.loadResourceInProgress);
    const loadResourceErrorMessage = useSelector((state: AppState) => state.loadResourceErrorMessage);
    const loadResourceData = useSelector((state: AppState) => state.loadResourceData);

    const dispatch = useDispatch();
    const authClient = useAuthClient();
    const resourceClient = useResourceClient();

    useEffect(() => {
        if (loggedInAs === null) {
            navigate("/login");
        }
    }, []);

    const refreshAccessToken = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (authClient === null) {
            return;
        }

        if (loggedInAs !== null) {
            try {

                const result = await authClient.useRefreshToken(loggedInAs.refreshToken.token);

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
            } catch(e) {
                console.error(e);
            }
        }        
    }

    const [abortController, setAbortController] = useState(new AbortController());

    const loadProtectedResource = async (e: any) => {
        e.preventDefault();

        if (loggedInAs === null) {
            return;
        }

        if (resourceClient === null) {
            return;
        }

        dispatch<LoadResourceInProgress>({
            type: "loadResourceInProgress",
            meta: {}
        });

        try {
            const result = await resourceClient.loadResource(loggedInAs.accessToken.token, abortController.signal);

            dispatch<LoadResourceSuccess>({
                type: "loadResourceSuccess",
                meta: {
                    data: result.data
                }
            });

        } catch(e) {
            dispatch<LoadResourceError>({
                type: "loadResourceError",
                meta: {
                    message: (e as Error).message
                }
            });
        }
    }

    useEffect(() => {
        console.log("Secure Page component mounted");
        return () => {
            console.log("Secure Page component UNmounted");
            abortController.abort();
        }
    }, []);

    if (loggedInAs === null) {
        return <div>Please <Link to="/login">login</Link></div>
    }


    return <div className={styles.Root}>
        <h1>Secure section</h1>
        
        <p>You are logged in as {loggedInAs.user.name}</p>
        <p>Access Token: {loggedInAs.accessToken.token}</p>
        <p>Access Token Expiry: {loggedInAs.accessToken.expiry}</p>
        <p>Refresh Token: {loggedInAs.refreshToken.token}</p>
        <p>Refresh Token Expiry: {loggedInAs.refreshToken.expiry}</p>

        <h2>Load protected resource</h2>

        {loadResourceErrorMessage && (
            <div className={styles.errorMessage}>{loadResourceErrorMessage}</div>
        )}

        {loadResourceInProgress ? (
            <div>SPINNER</div>
        ) : (
            <p>Click <a href="#" onClick={(e) => loadProtectedResource(e)}>here</a> to attempt to load a protected resource using your current access token</p>
        )}
        <div className={styles.protectedContent}>{loadResourceData}</div>

        <h2>Refresh access token</h2>
        
        <button onClick={(e) => refreshAccessToken(e)}>Refresh access token</button>
    </div>
}