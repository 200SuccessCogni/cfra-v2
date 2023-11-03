import {
    Box,
    Typography,
    Button,
    Switch,
    TextField,
    Avatar,
    Link,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { tags } from "../../../constants/taglines.constant";

interface IFeatureCard {
    title: string;
    subtitle: string;
    src: string;
}

const label = { inputProps: { "aria-label": "Third party review enable" } };

function FeatureCard(props: IFeatureCard) {
    const [enabled, setEnabled] = useState(false);

    return (
        <Box
            borderRadius={2}
            p={1.5}
            mb={1}
            border="1px solid"
            position="relative"
            sx={{ width: { xs: "100%", md: "70%" } }}
        >
            <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
                <Avatar src={props.src} alt={props.title} variant="rounded">
                    {props.src}
                </Avatar>
                <Box pl={2}>
                    <Typography variant="body2" fontWeight="bold">
                        {props.title}
                    </Typography>
                    <Typography
                        variant="caption"
                        gutterBottom
                        sx={{
                            lineHeight: "120%",
                            display: "inline-block",
                        }}
                    >
                        {props.subtitle}
                    </Typography>
                </Box>
                <Switch
                    checked={props.title === "Demo" ? true : enabled}
                    onChange={() => setEnabled(!enabled)}
                    {...label}
                />
            </Box>

            {!!enabled && props.title != "Demo" && (
                <>
                    <Box mt={2}>
                        <TextField
                            label="Partner Key"
                            size="small"
                            InputProps={{
                                placeholder: "Enter partner API key",
                            }}
                            fullWidth
                        />
                    </Box>
                    <Link
                        target="_blank"
                        rel="noopener"
                        underline="hover"
                        href="/blogs/how-to-get-tripadvisor-partner-api"
                    >
                        <Typography variant="caption">
                            See how to get it
                        </Typography>
                    </Link>
                </>
            )}
        </Box>
    );
}

function Integrate(props: any) {
    const [tag, setTag] = useState(tags[0]);
    const navigate = useNavigate();

    function goToHome() {
        localStorage.setItem("introDone", "true");
        navigate("/");
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTag(tags[Math.floor(Math.random() * 6)]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box display="flex" height="100%">
            <Box
                className="bg-secondary"
                py={3}
                px={6}
                sx={{
                    flexBasis: { xs: "100%", md: "60%" },
                    maxWidth: { xs: "100%", md: "50%" },
                    overflowY: "auto",
                    backgroundColor: "white",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
                    <Typography variant="caption" gutterBottom>
                        Step 3 of 3
                    </Typography>
                </Box>
                <Typography variant="h6" fontWeight={400}>
                    One time Integrate
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                    Integrate third party reviews
                </Typography>
                <Box my={4}>
                    <FeatureCard
                        src=""
                        title="Demo"
                        subtitle="Integrate demo API to get all reviews and take action accrodingly."
                    />
                    <FeatureCard
                        src="./tripadvisor.png"
                        title="Tripadvisor"
                        subtitle="Integrate Tripadvisor to get all reviews and take action accrodingly."
                    />
                    <FeatureCard
                        src="./booking.png"
                        title="Booking.com"
                        subtitle="Integrate Booking.com to get all reviews and take action accrodingly."
                    />
                    <FeatureCard
                        src="./google.png"
                        title="Google"
                        subtitle="Integrate Google to get all reviews and take action accrodingly."
                    />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant="outlined"
                        color="black"
                        onClick={() => props.setStep(2)}
                        sx={{
                            boxShadow: "none",
                            width: "100px",
                            marginLeft: "60%",
                        }}
                    >
                        Prev
                    </Button>
                    <Button
                        variant="contained"
                        color="black"
                        onClick={goToHome}
                        sx={{
                            boxShadow: "none",
                            width: "100px",
                            marginLeft: "20px",
                        }}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    flexBasis: "40%",
                    maxWidth: "50%",
                    display: { xs: "none", md: "block" },
                }}
            >
                <Box
                    sx={{
                        mt: "10%",
                        ml: "11%",
                    }}
                >
                    <img
                        src="/review.png"
                        alt="review page"
                        style={{
                            border: "10px solid",
                            borderRadius: "15px",
                            height: "450px",
                        }}
                    />
                </Box>

                <Box>
                    <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        className="fade-in"
                    >
                        {tag}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default Integrate;
