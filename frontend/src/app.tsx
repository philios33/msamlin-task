import { useEffect, useState } from "react";
import { AuthClient, IAuthClient } from "./clients/authClient";
import { IResourceClient, ResourceClient } from "./clients/resourceClient";
import AuthClientContext from "./contexts/authClient";
import ResourceClientContext from "./contexts/resourceClient";
import Menu from "./components/Menu";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Secure from "./pages/Secure";
import Home from "./pages/Home";

import './app.scss';

type Props = {
    backendHost?: string
}
export default function App(props: Props) {

    const [authClient, setAuthClient] = useState<null | IAuthClient>(null);
    const [resourceClient, setResourceClient] = useState<null | IResourceClient>(null);

    useEffect(() => {
        const backendPrefix = props.backendHost || "https://localhost:8443";
        setAuthClient(new AuthClient(backendPrefix + "/auth"));
        setResourceClient(new ResourceClient(backendPrefix + "/resource"));
    }, []);

    return (
        <div>
            <AuthClientContext.Provider value={authClient}>
                <ResourceClientContext.Provider value={resourceClient}>
                    <BrowserRouter basename="/">
                        <Menu />
                        <Routes>
                            <Route path="/login" Component={Login} />
                            <Route path="/signup" Component={Signup} />
                            <Route path="/secure" Component={Secure} />
                            <Route path="/" Component={Home} />
                        </Routes>
                    </BrowserRouter>
                </ResourceClientContext.Provider>
            </AuthClientContext.Provider>
        </div>
    );
};