import { NavLink, useNavigate } from "react-router-dom";

import styles from './styles.module.scss';
import { AppState } from "../../state";
import { useDispatch, useSelector } from "react-redux";
import { LogoutAction } from "../../actions";

export default function Menu() {

    const isLoggedIn = useSelector((state: AppState) => {
        return state.loggedInAs !== null;
    });
    const loggedInEmail = useSelector((state: AppState) => {
        return state.loggedInAs?.user.email || "";
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        dispatch<LogoutAction>({
            type: "logout",
            meta: {}
        });

        navigate("/login");
    }

    return <header className={styles.Root}>
        <ul>
            <li>
                <NavLink to="/">Home</NavLink>   
            </li>
            {!isLoggedIn && (
                <>
                    <li>
                        <NavLink to="/login">Login</NavLink>   
                    </li>
                    <li>
                        <NavLink to="/signup">Signup</NavLink>
                    </li>
                </>
            )}
            
            {isLoggedIn && (
                <>
                    <li>
                        <NavLink to="/secure">Secure</NavLink>
                    </li>
                    <li>
                        <p className={styles.loggedInAs}>Logged in as: {loggedInEmail}</p>
                        <button onClick={(e) => logout(e)}>Logout</button>
                    </li>
                </>
            )}
            
        </ul>
    </header>
}