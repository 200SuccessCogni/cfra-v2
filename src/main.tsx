import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import "./index.css";
import { AppContextProvidor } from "./store/app.context.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <AppContextProvidor>
            <App />
        </AppContextProvidor>
    </React.StrictMode>
);
