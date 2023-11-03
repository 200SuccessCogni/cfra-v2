import useApp from "../../../store/app.context";
import { useEffect, ReactElement, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export function AuthGuard({
    children,
}: {
    children: ReactElement | ReactNode;
}) {
    const { setUser } = useApp();
    const navigate = useNavigate();
    useEffect(() => {
        const isIntroCompleted = localStorage.getItem("introDone");
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (user) {
            setUser(JSON.parse(user));
        }

        if (!isIntroCompleted && token) {
            navigate("/onboarding");
        }
        if (!token) {
            navigate("/signin");
        }
    }, []);

    /* otherwise don't return anything, will do a redirect from useEffect */
    return <>{children}</>;
}
