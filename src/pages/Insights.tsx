import { useEffect, useState } from "react";
import LinearProgressWithLabel from "../components/core/linearProgressWithLabel";
import ReviewForm from "../components/module/review/ReviewForm";
import { Box, Grid, Typography } from "@mui/material";
import useApp from "../store/app.context";
import { GET } from "../services/api.service";

function Insights() {
    const [insights, setInsights] = useState([]);
    const { setLoader } = useApp();
    const onFilterApply = (data: any) => {
        // console
    };

    useEffect(() => {
        getInsights();
    }, []);

    const getInsights = async (resortId = "649da3f7953f4d5cdeaff1c1") => {
        setLoader(true);
        try {
            const res = await GET(`/review/reviewStats?resortId=${resortId}`);
            if (res && res.status === 200) {
                setInsights(res.data.analytics);
            }
        } catch (err) {
            console.log(err);
        }

        setLoader(false);
    };
    return (
        <>
            <Typography variant="h5" fontWeight={500}>
                Insights
            </Typography>
            <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item xs={12} md={9}>
                    {insights &&
                        insights.map((e: any) => (
                            <Box
                                sx={{
                                    background: "#fff",
                                    p: 3,
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Grid item xs={5} md={2}>
                                    <Typography>
                                        {e._id.toUpperCase()}
                                    </Typography>
                                </Grid>
                                <LinearProgressWithLabel count={e.count} />
                            </Box>
                        ))}
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={3}
                    sx={{
                        display: { xs: "none", md: "flex" },
                        justifyContent: "center",
                        alignItems: "flex-start",
                    }}
                >
                    <Box
                        sx={{
                            background: "#fff",
                            borderRadius: "10px",
                            p: 3,
                            width: "100%",
                        }}
                    >
                        <Typography
                            variant="body1"
                            gutterBottom
                            fontWeight={500}
                        >
                            Filters
                        </Typography>
                        <ReviewForm
                            sourcesFilter={onFilterApply}
                            showCategory={false}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}

export default Insights;
