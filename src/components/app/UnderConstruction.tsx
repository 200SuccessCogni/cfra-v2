import { Box, Typography } from "@mui/material";
import React from "react";

function UnderConstruction() {
    return (
        <Box
            maxWidth="md"
            textAlign="center"
            mx="auto"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
        >
            <Box sx={{ flexBasis: { xs: "100%", md: "70%" } }}>
                <img src="under-construction.svg" alt="under contruction" />
            </Box>
            <Box sx={{ flexBasis: { xs: "100%", md: "30%" } }}>
                <Typography variant="h6">
                    This page is under contruction.
                </Typography>
                <Typography variant="body2">
                    We are currently working on this. 😃
                </Typography>
            </Box>
        </Box>
    );
}

export default UnderConstruction;
