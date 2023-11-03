import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Link } from "@mui/material";
import AuthForm from "../components/module/auth/AuthForm";
import { POST } from "../services/api.service";
import useApp from "../store/app.context";
import { Iuser } from "../interfaces/user.interface";

function Login() {
    const { setUser, setAlert } = useApp();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loginHandler = async (email: string, password: string) => {
        setLoading(true);

        try {
            const res = await POST("/auth/signin", { email, password });

            if (res && res.status && res.status === 200) {
                if (res.data.data && res.data.msg === "Success") {
                    localStorage.setItem("token", res.data.data.token);
                    const data = res.data.data?.user;
                    const user: Iuser = {
                        id: data?._id,
                        fullname: data?.name,
                        email: data?.email,
                        phoneNo: data?.mobile,
                        business: {
                            businessId: data.businessId?._id,
                            businessName: data.businessId?.name,
                            address: data.businessId?.address,
                            businessUrl: data.businessId?.webUrl,
                            domain: data.businessId?.domain,
                            country: data.businessId?.originCountry,
                        },
                        pmLevel: data?.permissionLevel,
                    };
                    setUser(user);
                    localStorage.setItem("user", JSON.stringify(user));

                    if (localStorage.getItem("introDone")) {
                        navigate("/");
                    } else {
                        navigate("/onboarding");
                    }
                } else {
                    setAlert({
                        title: "Alert",
                        show: true,
                        message: res.data.msg,
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
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
                    margin: { xs: 0, md: "2rem" },
                    borderRadius: { xs: 0, md: "1rem" },
                    maxWidth: { xs: "100%", md: "30%" },
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
                        Welcome
                    </Typography>
                    <AuthForm
                        isLogin={true}
                        loading={loading}
                        onSubmit={loginHandler}
                    />
                </Box>

                <Typography
                    variant="body2"
                    align="center"
                    gutterBottom
                    sx={{ my: 3 }}
                >
                    Not register yet.{" "}
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                            navigate("/signup");
                        }}
                    >
                        Sign up
                    </Link>{" "}
                    here.
                </Typography>
            </Box>
        </Box>
    );
}

export default Login;
