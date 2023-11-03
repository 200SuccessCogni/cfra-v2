import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import ComparisonReview from "./ComparisonReview";

const card = (
    <React.Fragment>
        <CardContent>
            <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
            >
                Travel & Leisure
            </Typography>
            <Box
                display="flex"
                justifyContent="space-between"
                alignContent="center"
                sx={{ p: "1rem" }}
                borderBottom="1px solid #aaa"
                className="review"
                position="relative"
            >
                <Typography variant="h5" component="div">
                    Club Wyndham Bonnet Greek
                </Typography>
                <Avatar
                    variant="rounded"
                    src="https://www.rci.com/static/Resorts/Assets/3603E02L.jpg"
                >
                    Hotel
                </Avatar>
            </Box>

            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Top User Review
            </Typography>
            <Typography variant="body2">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ margin: 1 }}>
                        <Avatar src="https://api.multiavatar.com/kathrin.svg" />
                    </Box>
                    <Box sx={{ width: "100%" }}>
                        <Typography>Ted</Typography>
                    </Box>
                </Box>
            </Typography>
            <ComparisonReview />
        </CardContent>
    </React.Fragment>
);

export default function ComparisonCard() {
    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">{card}</Card>
        </Box>
    );
}
