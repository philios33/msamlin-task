
import { Provider } from "react-redux";
import { createRoot } from 'react-dom/client';
import { createStore } from "./store";

import App from "./app";

const element = document.getElementById("root");
if (element === null) {
    alert("Missing root element, cannot bootstrap");
} else {
    const root = createRoot(element);
    const store = createStore();
    root.render(<Provider store={store}>
        <App />
    </Provider>, );
}