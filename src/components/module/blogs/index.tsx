import { Box, Container, Typography } from "@mui/material";
import React from "react";

interface Iprops {
    children: React.ReactNode;
}

function Blog(props: Iprops) {
    return (
        <Box position="relative">
            <Box
                component="header"
                sx={{ height: "75px", width: "100%", py: 1, px: 2 }}
            >
                <Box
                    sx={{
                        display: { xs: "none", md: "flex" },
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
                    <Typography
                        variant="button"
                        color="primary"
                        sx={{
                            px: 1,
                            textTransform: "none",
                            color: "text.primary",
                            fontWeight: "600",
                            fontSize: "1.2rem",
                        }}
                    >
                        CFRA
                        <Typography
                            variant="button"
                            color="primary"
                            component="span"
                            sx={{
                                px: 1,
                                textTransform: "none",
                                color: "text.primary",
                                fontWeight: "400",
                                fontSize: "1.2rem",
                            }}
                        >
                            | Blogs
                        </Typography>
                    </Typography>
                    <Typography
                        variant="caption"
                        color="primary"
                        sx={{
                            px: 1,
                            textTransform: "none",
                            fontWeight: "400",
                            lineHeight: 1,
                        }}
                    >
                        Customer Feedback and Review Analysis
                    </Typography>
                </Box>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    height: "calc(100vh - 75px)",
                    overflowY: "auto",
                    overflowX: "hidden",
                    background: "#eef2f5",
                    position: "relative",
                }}
            >
                <Container maxWidth="md">{props.children}</Container>
            </Box>
        </Box>
    );
}

export default Blog;
