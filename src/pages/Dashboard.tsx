import {
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    Chip,
    Tooltip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import PieChart from "../components/charts/PieChart";
import ReviewItem from "../components/module/review/ReviewItem";
import { ICountCard } from "@/interfaces/dashboard.interface";
import { useNavigate } from "react-router-dom";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import useApp from "../store/app.context";
import { useCallback, useEffect, useState } from "react";
import { GET } from "../services/api.service";
import dayjs from "dayjs";
import AIChip from "../components/core/chip/AIChip";
import { IReviewItem } from "@/interfaces/review.interface";
import { camelCaseToTitleCase, randomColor } from "../services/shared.service";

function StatCard(props: ICountCard) {
    return (
        <Paper
            elevation={0}
            sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "0.5rem 1rem",
                minHeight: "130px",
                backgroundColor: props.backgroundColor,
                color: props.color,
                textALign: "left",
            }}
            // className="box-shadow"
        >
            <Typography variant="h2" align="left" color="primary">
                {props.count}
            </Typography>
            <Typography
                variant="body2"
                sx={{ lineHeight: 1, color: "text.secondary", pr: "30%" }}
            >
                {props.label}
            </Typography>
        </Paper>
    );
}

type InsightType = {
    name: string;
    count: number;
    score: number;
};

type InsightSourceType = {
    labels: string[];
    datasets: {
        backgroundColor: string[];
        data: number[];
    }[];
};

function Dashboard() {
    const {
        setLoader,
        selectedLocation,
        loader,
        setALLReviews,
        allReviews,
        user,
    } = useApp();
    const navigate = useNavigate();
    const [posReview, setPosReview] = useState(0);
    const [negReview, setNegReview] = useState(0);
    const [neuReview, setNeuReview] = useState(0);
    const [mixReview, setMixReview] = useState(0);
    const [positiveInsights, setPositiveInsights] = useState<InsightType[]>([]);
    const [negativeInsights, setNegativeInsights] = useState<InsightType[]>([]);
    const theme = useTheme();
    const [insightSources, setInsightSources] =
        useState<InsightSourceType | null>(null);

    useEffect(() => {
        console.log({ selectedLocation });
        if (
            user &&
            user?.business &&
            user?.business?.businessId &&
            selectedLocation
        ) {
            getInsightsAndAnalytics(
                user?.business?.businessId,
                selectedLocation.id
            );
            getAllReviews(user?.business?.businessId, selectedLocation.id);
        }
    }, [user, selectedLocation]);

    const getAllReviews = useCallback(
        async (businessId: string, locationId: string) => {
            setLoader(true);
            try {
                const res = await GET(
                    `/review/getall?businessId=${businessId}&locationId=${locationId}`
                );
                if (res && res.status === 200) {
                    const allReviews: IReviewItem[] = res.data.data.map(
                        (e: any) => ({
                            ...e,
                            id: e._id,
                        })
                    );
                    setALLReviews(allReviews);
                }
            } catch (err) {
                console.log(err);
            }

            setLoader(false);
        },
        []
    );
    const getInsightsAndAnalytics = async (
        businessId = "65227a4fd7a294d9ee6f18a6",
        locationId = "65227ab4d7a294d9ee6f18db"
    ) => {
        setLoader(true);
        try {
            const res = await GET(
                `/review/getinsightAnalytics?businessId=${businessId}&locationId=${locationId}`
            );
            if (res && res.status === 200) {
                if (res.data.insights && res.data.insights.length) {
                    const insightsData = res.data.insights.map((e: any) => ({
                        name: e?._id,
                        score: e?.avgScore * 10,
                        count: e?.count,
                    }));
                    const posIns = insightsData.filter(
                        (e: InsightType) => e.score > 0
                    );
                    const negIns = insightsData.filter(
                        (e: InsightType) => e.score <= 0
                    );
                    setPositiveInsights(
                        posIns.length < 10 ? posIns : posIns.slice(0, 10)
                    );
                    setNegativeInsights(
                        negIns.length < 10 ? negIns : negIns.slice(0, 10)
                    );
                }

                if (res.data.categories && res.data.categories.length) {
                    res.data.categories.map((e: any) => {
                        switch (e._id) {
                            case "negative":
                                setNegReview(e.count);
                                break;
                            case "positive":
                                setPosReview(e.count);
                                break;
                            case "neutral":
                                setNeuReview(e.count);
                                break;
                            default:
                                setMixReview(e.count);
                                break;
                        }
                    });
                }

                if (res.data.sources) {
                    const chartData: InsightSourceType = {
                        labels: [],
                        datasets: [],
                    };

                    for (const prop in res.data.sources) {
                        chartData.labels.push(
                            camelCaseToTitleCase(res.data.sources[prop]._id)
                        );
                        chartData.datasets.push({
                            backgroundColor: [randomColor()],
                            data: [res.data.sources[prop]?.count],
                        });
                    }

                    setInsightSources(chartData);
                }
            }
        } catch (err) {
            console.log(err);
        }

        setLoader(false);
    };

    /*const userData = {
        labels: [
            "Google",
            "Booking.com",
            "GoIbibo",
            "TripAdvisor",
            "MakeMyTrip",
        ],
        datasets: [
            {
                backgroundColor: [
                    "#51EAEA",
                    "#FCDDB0",
                    "#FF9D76",
                    "#FB3569",
                    "#82CD47",
                ],
                data: [1, 3, 1, 1, 1],
            },
        ],
    };*/
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
                display: false,
            },
            title: {
                display: true,
                // text: "Review Sources",
            },
            tooltip: {
                enabled: true,
                position: "nearest",
            },
            chartAreaBorder: {
                borderColor: "red",
                borderWidth: 2,
                borderDash: [5, 5],
                borderDashOffset: 2,
            },
        },
    };
    return (
        <>
            <Typography variant="h5" fontWeight={500}>
                Dashboard
            </Typography>
            <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item xs={12} md={7.5}>
                    <Grid container spacing={3}>
                        <Grid item xs={6} md={3}>
                            <StatCard
                                count={neuReview}
                                label="Neutral Reviews"
                                backgroundColor="rgb(178 226 254 / 50%)"
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <StatCard
                                count={posReview}
                                label="Positive Reviews"
                                backgroundColor="rgb(178 254 206 / 50%)"
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <StatCard
                                count={negReview}
                                label="Negative Reviews"
                                backgroundColor="rgb(254 178 178 / 46%)"
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <StatCard count={mixReview} label="Mixed Reviews" />
                        </Grid>
                    </Grid>
                    <Box
                        // className="box-shadow"
                        sx={{
                            p: 2,
                            my: 3,
                            bgcolor: "#fff",
                            borderRadius: "1rem",
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignContent="center"
                        >
                            <Typography variant="h6">Latest Reviews</Typography>
                            <Button onClick={() => navigate("/reviews")}>
                                See All
                            </Button>
                        </Box>
                        {!!allReviews.length &&
                            allReviews
                                .slice(0, 5)
                                .map((r: any) => (
                                    <ReviewItem
                                        key={r.id}
                                        {...r}
                                        date={r.date.split("T")[0]}
                                        listView="false"
                                    />
                                ))}
                        {allReviews && !allReviews.length && !loader && (
                            <Typography variant="body2">
                                No records found
                            </Typography>
                        )}
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={4.5}
                    sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        flexDirection: "column",
                    }}
                >
                    <Box
                        // className="box-shadow"
                        sx={{
                            bgcolor: "#fff",
                            borderRadius: "10px",
                            width: "100%",
                            p: 2,
                            mb: 3,
                        }}
                    >
                        <Box mb={2}>
                            <Typography variant="h6" fontWeight={500}>
                                Review Source
                            </Typography>
                            <Typography
                                variant="caption"
                                color="black"
                                fontWeight={400}
                            >
                                {
                                    "* Each slice defines source of the review(s)."
                                }
                            </Typography>
                        </Box>
                        <Box px={10}>
                            {insightSources && (
                                <PieChart
                                    chartData={insightSources}
                                    options={options}
                                />
                            )}
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            bgcolor: "#fff",
                            borderRadius: "10px",
                            width: "100%",
                            p: 2,
                            mb: 2,
                        }}
                        // className="box-shadow"
                    >
                        <Box mb={2}>
                            <Typography
                                variant="h6"
                                color="black"
                                fontWeight={500}
                            >
                                Insights
                            </Typography>
                            <Typography
                                variant="caption"
                                color="black"
                                fontWeight={400}
                            >
                                * Count defines how many times customer
                                mentioned.
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                borderRadius: "1rem",
                                backgroundColor: alpha(
                                    theme.palette.primary.light,
                                    0.1
                                ),
                                p: 2,
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="primary.main"
                                gutterBottom
                                fontWeight={600}
                            >
                                Positive insights
                            </Typography>
                            {positiveInsights.map((e: InsightType) => (
                                <Tooltip
                                    title={`${camelCaseToTitleCase(
                                        e.name
                                    )} appears ${e.count} times.`}
                                    key={e.name}
                                >
                                    <Chip
                                        size="small"
                                        icon={<ThumbUpOutlinedIcon />}
                                        label={
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                            >
                                                <small>
                                                    <strong>
                                                        {camelCaseToTitleCase(
                                                            e.name
                                                        )}
                                                    </strong>
                                                </small>
                                                <Box
                                                    sx={{
                                                        borderRadius: "50%",
                                                        width: "20px",
                                                        height: "20px",
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                        alignItems: "center",
                                                        ml: 0.5,
                                                        backgroundColor:
                                                            "success.light",
                                                        color: "#fff",
                                                    }}
                                                >
                                                    {e.count}
                                                </Box>
                                            </Box>
                                        }
                                        variant="outlined"
                                        // color="success"
                                        sx={{
                                            m: 0.5,
                                            px: 0.5,
                                        }}
                                    />
                                </Tooltip>
                            ))}
                            {positiveInsights.length === 10 && (
                                <Chip
                                    size="small"
                                    label="See more"
                                    variant="outlined"
                                    onClick={() => navigate("/analytics")}
                                />
                            )}
                        </Box>
                        <Box
                            sx={{
                                borderRadius: "1rem",
                                backgroundColor: alpha(
                                    theme.palette.warning.light,
                                    0.2
                                ),
                                p: 2,
                                mt: 2,
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="warning.main"
                                gutterBottom
                                fontWeight={600}
                            >
                                Negative insights
                            </Typography>
                            {negativeInsights.map((e: InsightType) => (
                                <Tooltip
                                    title={`${camelCaseToTitleCase(
                                        e.name
                                    )} appears ${e.count} times.`}
                                    key={e.name}
                                >
                                    <Chip
                                        key={e.name}
                                        size="small"
                                        icon={<ThumbDownOffAltOutlinedIcon />}
                                        label={
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                            >
                                                <small>
                                                    <strong>
                                                        {camelCaseToTitleCase(
                                                            e.name
                                                        )}
                                                    </strong>
                                                </small>
                                                <Box
                                                    sx={{
                                                        borderRadius: "50%",
                                                        width: "20px",
                                                        height: "20px",
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                        alignItems: "center",
                                                        ml: 0.5,
                                                        backgroundColor:
                                                            "warning.light",
                                                        // color: "#fff",
                                                    }}
                                                >
                                                    {e.count}
                                                </Box>
                                            </Box>
                                        }
                                        variant="outlined"
                                        // color="error"
                                        sx={{
                                            m: 0.5,
                                            px: 0.5,
                                        }}
                                    />
                                </Tooltip>
                            ))}
                            {negativeInsights.length === 10 && (
                                <Chip
                                    size="small"
                                    label="See more"
                                    variant="outlined"
                                    onClick={() => navigate("/analytics")}
                                />
                            )}
                        </Box>
                    </Box>
                    {/* <Box
                        sx={{
                            bgcolor: "secondary.light",
                            borderRadius: "10px",
                            width: "100%",
                            p: 2,
                        }}
                        // className="box-shadow"
                    >
                        <Typography variant="h6" gutterBottom fontWeight={500}>
                            Recommended actions
                        </Typography>
                        <Typography variant="body2">
                            5 unread reviews
                        </Typography>
                        <Typography variant="body2">
                            10 no replied reviews
                        </Typography>
                    </Box> */}
                </Grid>
            </Grid>
        </>
    );
}

export default Dashboard;
