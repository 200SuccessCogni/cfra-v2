import { ReactElement, Suspense, lazy } from "react";
import { MDXProvider } from "@mdx-js/react";

import "./App.css";
import AuthLayout from "./components/layout/AuthLayout";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthGuard } from "./components/module/auth/AuthGuard";

// Blogs
import TripadvisorIntegrate from "../blogs/how-to-get-tripadvisor-partner-api.mdx";
import Blog from "./components/module/blogs";
import AppAlertModal from "./components/app/AppAlertModal";
import useApp from "./store/app.context";

// Lazy loading
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Integration = lazy(() => import("./pages/Integration"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Compare = lazy(() => import("./pages/Compare"));
const Settings = lazy(() => import("./pages/Settings"));

function layoutWrapper(component: ReactElement) {
    return <AuthLayout>{component}</AuthLayout>;
}

function withAuthInterceptor(component: ReactElement, isAuthenticated = true) {
    if (!isAuthenticated) return component;
    return <AuthGuard>{layoutWrapper(component)}</AuthGuard>;
}

function App() {
    const { alert, setAlert } = useApp();

    return (
        <>
            <Router>
                <Suspense fallback={layoutWrapper(<p>Loading...</p>)}>
                    <Routes>
                        <Route
                            path="/"
                            element={withAuthInterceptor(<Dashboard />)}
                        />
                        <Route
                            path="/dashboard"
                            element={withAuthInterceptor(<Dashboard />)}
                        />
                        <Route
                            path="/reviews"
                            element={withAuthInterceptor(<Reviews />)}
                        />
                        <Route
                            path="/analytics"
                            element={withAuthInterceptor(<Analytics />)}
                        />
                        <Route
                            path="/compare"
                            element={withAuthInterceptor(<Compare />)}
                        />
                        <Route
                            path="/integration"
                            element={withAuthInterceptor(<Integration />)}
                        />
                        <Route
                            path="/settings"
                            element={withAuthInterceptor(<Settings />)}
                        />
                        <Route
                            path="/onboarding"
                            element={withAuthInterceptor(<Onboarding />, false)}
                        />
                        <Route
                            path="/signin"
                            element={withAuthInterceptor(<Login />, false)}
                        />
                        <Route
                            path="/signup"
                            element={withAuthInterceptor(<Signup />, false)}
                        />
                        {/* Blogs route */}
                        <Route
                            path="/blogs/how-to-get-tripadvisor-partner-api"
                            element={
                                <Blog>
                                    <TripadvisorIntegrate />
                                </Blog>
                            }
                        />
                    </Routes>
                </Suspense>
            </Router>
            <AppAlertModal
                title={alert.title}
                show={alert.show}
                message={alert.message}
                handleClose={() =>
                    setAlert({ show: false, message: "", title: "" })
                }
            />
        </>
    );
}

export default App;
