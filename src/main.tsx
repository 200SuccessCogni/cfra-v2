import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App.tsx";
import "./index.css";
import theme from "./styles/theme.ts";
import { AppContextProvidor } from "./store/app.context.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    // <React.StrictMode>
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContextProvidor>
            <App />
        </AppContextProvidor>
    </ThemeProvider>
    // </React.StrictMode>
);
