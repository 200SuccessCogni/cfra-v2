import { useState } from "react";
import { Box, Typography, Link } from "@mui/material";
import AuthForm from "../components/module/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { POST } from "../services/api.service";
import useApp from "../store/app.context";

function Signup() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useApp();

    const signupHandler = async (email: string, password: string) => {
        setLoading(true);

        // try {
        //     const res = await POST("/auth/signup", { email, password });
        //     if (res && res.status && res.status === 200) {
        //         navigate("/signin");
        //     }
        // } catch (err) {
        //     console.log(err);
        // }

        setTimeout(() => {
            setLoading(false);
            navigate("/signin");
        }, 3000);
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                height: "100vh",
                width: "100vw",
                background: "rgb(178, 226, 254)",
            }}
        >
            <Box
                sx={{
                    background: "#eee",
                    margin: "2rem",
                    borderRadius: "1rem",
                    maxWidth: "30%",
                    p: 5,
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                }}
            >
                <Box mb={3}>
                    <Typography
                        variant="body2"
                        fontWeight="bold"
                        lineHeight={0.9}
                    >
                        CFRA
                    </Typography>
                    <Typography variant="caption" gutterBottom>
                        Customer Feedback and Review Analysis
                    </Typography>
                </Box>
                <Box my="auto">
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Register
                    </Typography>
                    <AuthForm
                        isLogin={false}
                        loading={loading}
                        onSubmit={signupHandler}
                    />
                </Box>

                <Typography
                    variant="body2"
                    align="center"
                    gutterBottom
                    sx={{ my: 3 }}
                >
                    Alreday registered.{" "}
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                            navigate("/signin");
                        }}
                    >
                        Sign in
                    </Link>{" "}
                    here.
                </Typography>
            </Box>
        </Box>
    );
}

export default Signup;
