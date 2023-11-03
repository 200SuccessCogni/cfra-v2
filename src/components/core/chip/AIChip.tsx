import { Chip, Typography } from "@mui/material";

function AIChip() {
    return (
        <Chip
            label={<Typography variant="caption">AI</Typography>}
            sx={{
                background:
                    "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
                backgroundSize: "400% 400%",
                animation: "aigradient 5s ease infinite",
                padding: "0.3rem 0.5rem",
                height: "20px",
                mx: 1,
            }}
        ></Chip>
    );
}

export default AIChip;
