import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Link } from "@mui/material";

import AuthForm from "../components/module/auth/AuthForm";

import { POST } from "../services/api.service";
import useApp from "../store/app.context";

import { Iuser } from "../interfaces/user.interface";
import { CompanyNameTypes } from "../interfaces/app.interface";
import getConfig from "../config/index";

function Login() {
    const { setUser, setAlert, setConfig, config } = useApp();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Change company here
    const comnayName: CompanyNameTypes = CompanyNameTypes.pji;
    const defaultEmail = `admin@${comnayName}.com`;
    const defaultPassword = 'Admin@123';

    useEffect(() => {
        setConfig(getConfig(comnayName))
    }, []);

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
                            country: data.businessId?.originCountry
                        },
                        pmLevel: data?.permissionLevel,
                    };
                    setUser(user); 
                    setConfig(getConfig(user.email.split('@')[1].split('.')[0] as CompanyNameTypes));                                                             
                    localStorage.setItem("user", JSON.stringify(user));
                    sessionStorage.setItem("company", user.email.split('@')[1].split('.')[0].toLocaleLowerCase())

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
                // background: "rgb(178, 226, 254)",
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        background: `linear-gradient(180deg, rgba(255,255,0,0) 15%, rgba(0,0,0,0.6) 71%), url(${config.brandImg})`,
                        transition: "all 0.3s ease-in",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        p: 3,
                    }}
                >
                    <Typography
                        variant="h5"
                        align="left"
                        fontWeight="normal"
                        sx={{ color: "#fff", lineHeight: 1.1 }}
                    >
                        {config.brandTitle}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        background: "#eee",
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
                            Sentiment 360
                        </Typography>
                        <Typography variant="caption" gutterBottom>
                            Customer Feedback and Review Analysis
                        </Typography>
                    </Box>
                    <Box my="auto">
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            align="center"
                        >
                            Welcome
                        </Typography>
                        <Typography
                            variant="body1"
                            gutterBottom
                            align="center"
                            sx={{ mb: 2 }}
                        >
                            Please login to get access application.
                        </Typography>
                        <AuthForm
                            isLogin={true}
                            loading={loading}
                            onSubmit={loginHandler}
                            emailValue={defaultEmail}
                            passwordValue={defaultPassword}
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
                            color="secondary"
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
        </Box>
    );
}

export default Login;
