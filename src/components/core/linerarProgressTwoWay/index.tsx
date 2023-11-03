import { Box, LinearProgress } from "@mui/material";

function LinerarProgressTwoWay({ value }: { value: number }) {
    return (
        <Box sx={{ display: "flex", width: "100%", "& > *": { width: "50%" } }}>
            <LinearProgress
                variant="determinate"
                color="error"
                value={value < 0 ? Math.abs(value) : 0}
                sx={{ transform: "rotate(-180deg)" }}
            />
            <LinearProgress
                variant="determinate"
                color="primary"
                value={value > 0 ? value : 0}
            />
        </Box>
    );
}

export default LinerarProgressTwoWay;
