import { Box, Typography, Button, AvatarGroup, Avatar } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React, { useEffect, useState } from "react";
import { tags } from "../../../constants/taglines.constant";

interface IFeatureCard {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}

function FeatureCard(props: IFeatureCard) {
    return (
        <Box
            borderRadius={2}
            p={1.5}
            mb={1}
            border="1px solid"
            width="70%"
            position="relative"
            sx={{ backgroundColor: "white" }}
        >
            <Typography
                variant="body1"
                fontWeight="bold"
                gutterBottom
                // color="text.contrastText"
            >
                {props.title}
            </Typography>
            <Typography
                variant="caption"
                gutterBottom
                // color="text.contrastText"
                sx={{
                    lineHeight: "120%",
                    display: "inline-block",
                    mb: 2,
                }}
            >
                {props.subtitle}
            </Typography>
            <AddCircleOutlineIcon
                sx={{
                    position: "absolute",
                    right: "5px",
                    top: "5px",
                }}
            />
            {props.children}
        </Box>
    );
}

function Intro1(props: any) {
    const [tag, setTag] = useState(tags[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTag(tags[Math.floor(Math.random() * 6)]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box display="flex" height="100%">
            <Box
                py={3}
                px={6}
                sx={{
                    flexBasis: "60%",
                    maxWidth: "50%",
                    backgroundColor: "white",
                    overflowY: "auto",
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
                        Step 1 of 3
                    </Typography>
                </Box>
                <Typography variant="h4" fontWeight={400}>
                    Welcome
                </Typography>
                <Typography
                    variant="h2"
                    fontWeight="bold"
                    sx={{ lineHeight: "90%", mb: 6 }}
                >
                    The voice of the customer is our compass.
                </Typography>
                <Box>
                    <FeatureCard
                        title="Central dashboard"
                        subtitle="Get the accurate evaluation of your property through
                        CFRA. You can precisely identify which service are
                        being affeected, get recommended actions and get
                        lastest review from diffrent third party sites."
                    ></FeatureCard>
                    <FeatureCard
                        title="Seamless integrate"
                        subtitle="Easily integrate third-party booking site review
                        data and get full insights of it and do needfull
                        action."
                    >
                        <AvatarGroup max={7}>
                            <Avatar alt="Tripadvisor" src="/tripadvisor.png" />
                            <Avatar alt="Google" src="/google.png" />
                            <Avatar alt="Booking" src="/booking.png" />
                            <Avatar alt="Goibio" src="/goibibo.png" />
                            <Avatar alt="Makemytrip" src="/makemytrip.png" />
                            <Avatar alt="Facebook" src="/facebook.png" />
                            <Avatar alt="Makemytrip" src="/makemytrip.png" />
                            <Avatar alt="Facebook" src="/facebook.png" />
                        </AvatarGroup>
                    </FeatureCard>
                    {/* <FeatureCard
                        title="Full Insight"
                        subtitle="Get the full insight of which of your service is
                            affected and take actions accordingly."
                    /> */}
                </Box>
                <Button
                    variant="contained"
                    color="black"
                    onClick={() => props.setStep(2)}
                    sx={{
                        boxShadow: "none",
                        width: "100px",
                        marginLeft: "80%",
                    }}
                >
                    Next
                </Button>
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
                        ml: "10%",
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

export default Intro1;
