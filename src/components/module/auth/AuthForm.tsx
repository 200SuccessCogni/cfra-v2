import { useState } from "react";
import { Box, TextField, Button, Alert, CircularProgress } from "@mui/material";
import { validateEmail } from "../../../services/shared.service";

interface IAuthForm {
    isLogin?: boolean;
    loading?: boolean;
    onSubmit: (email: string, password: string) => void;
}

function AuthForm(props: IAuthForm) {
    const [email, setEmail] = useState("admin@mcdonalds.com");
    const [password, setPassword] = useState("Admin@123");
    const [errMsg, setErrMsg] = useState("");

    const onSubmitHandler = () => {
        if (!email || !password) {
            setErrMsg("Email and Password are required.");
            return;
        } else if (email && !validateEmail(email)) {
            setErrMsg("Please enter valid email address.");
            return;
        }

        setErrMsg("");
        props.onSubmit(email, password);
    };

    return (
        <Box display="flex" justifyContent="center">
            <form>
                <TextField
                    fullWidth
                    label="Email"
                    id="email"
                    variant="filled"
                    size="small"
                    value={email}
                    InputProps={{
                        placeholder: "Enter your email",
                        name: "email",
                    }}
                    sx={{ mb: 2 }}
                    onChange={(ev) => setEmail(ev.target.value)}
                />
                <TextField
                    fullWidth
                    label="Password"
                    id="passord"
                    variant="filled"
                    size="small"
                    InputProps={{
                        placeholder: "Enter your password",
                        name: "password",
                        type: "password",
                    }}
                    sx={{ mb: 2 }}
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                />

                <Box display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        onClick={onSubmitHandler}
                        color="primary"
                        sx={{ boxShadow: "none" }}
                        disabled={props?.loading || false}
                    >
                        {props.isLogin ? "Sign In" : "Sign Up"} {"  "}
                        {props?.loading && (
                            <CircularProgress
                                color="primary"
                                size="small"
                                sx={{ height: "20px", width: "20px", ml: 1.5 }}
                            />
                        )}
                    </Button>
                </Box>

                <Box sx={{ my: 2, visibility: errMsg ? "none" : "hidden" }}>
                    <Alert variant="outlined" severity="error">
                        {errMsg}
                    </Alert>
                </Box>
            </form>
        </Box>
    );
}

export default AuthForm;
