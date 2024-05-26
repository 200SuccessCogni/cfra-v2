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
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Divider from "@mui/material/Divider";
import AnalyticsChart from "../components/module/analytics/AnalyticsChart";

function StatCard(props: ICountCard) {
    return (
        <Paper
            elevation={0}
            sx={{
                position: "relative",
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
            <Typography variant="h2" align="left" sx={{ marginTop: 3 }}>
                {props.count}
            </Typography>
            <Typography
                variant="body2"
                sx={{ lineHeight: 1.1, color: "text.secondary", pr: "30%" }}
            >
                {props.label}
            </Typography>
            {!!props.percentage && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        position: "absolute",
                        top: "10px",
                        right: "15px",
                    }}
                >
                    {!props.isImproving && (
                        <TrendingDownIcon sx={{ color: props.color }} />
                    )}
                    {props.isImproving && (
                        <TrendingUpIcon sx={{ color: props.color }} />
                    )}
                    <Typography
                        variant="caption"
                        sx={{ lineHeight: 1, color: props.color, pl: 0.51 }}
                    >
                        {props.percentage || 2}%
                    </Typography>
                </Box>
            )}
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
        selectedProduct,
        loader,
        setALLReviews,
        allReviews,
        user,
    } = useApp();
    const navigate = useNavigate();
    const [posReview, setPosReview] = useState({ count: 0, percentage: 0 });
    const [negReview, setNegReview] = useState({ count: 0, percentage: 0 });
    const [neuReview, setNeuReview] = useState({ count: 0, percentage: 0 });
    const [mixReview, setMixReview] = useState({ count: 0, percentage: 0 });
    const [praise, setPraise] = useState({ count: 0, percentage: 0 });
    const [Complain, setComplain] = useState({ count: 0, percentage: 0 });
    const [consFeed, setConsFeed] = useState({ count: 0, percentage: 0 });
    const [experience, setExperience] = useState({ count: 0, percentage: 0 });
    const [positiveInsights, setPositiveInsights] = useState<InsightType[]>([]);
    const [negativeInsights, setNegativeInsights] = useState<InsightType[]>([]);
    const [reviewTimeSeries, setReviewTimeSeries] = useState<any>(null);

    const theme = useTheme();
    const [insightSources, setInsightSources] =
        useState<InsightSourceType | null>(null);

    useEffect(() => {
        if (
            user &&
            user?.business &&
            user.business?.businessId &&
            selectedLocation
        ) {
            getInsightsAndAnalytics(
                user?.business?.businessId,
                selectedLocation.id,
                selectedProduct?.id || null
            );
            getAllReviews(
                user?.business?.businessId,
                selectedLocation.id,
                selectedProduct?.id || null
            );
        }
    }, [user, selectedLocation, selectedProduct]);

    const getAllReviews = useCallback(
        async (businessId: string, locationId: string, productId: string) => {
            setLoader(true);
            try {
                const res = await GET(
                    `/review/getall?businessId=${businessId}&locationId=${locationId}&productId=${productId}`
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

    const resetAllCount = () => {
        setPosReview({ count: 0, percentage: 0 });
        setNegReview({ count: 0, percentage: 0 });
        setNeuReview({ count: 0, percentage: 0 });
        setMixReview({ count: 0, percentage: 0 });
        setPraise({ count: 0, percentage: 0 });
        setComplain({ count: 0, percentage: 0 });
        setConsFeed({ count: 0, percentage: 0 });
        setExperience({ count: 0, percentage: 0 });
    };

    const resetAllThemes = () => {
        setPraise({ count: 0, percentage: 0 });
        setComplain({ count: 0, percentage: 0 });
        setConsFeed({ count: 0, percentage: 0 });
        setExperience({ count: 0, percentage: 0 });
    };

    const getInsightsAndAnalytics = async (
        businessId = "65227a4fd7a294d9ee6f18a6",
        locationId = "65227ab4d7a294d9ee6f18db",
        productId: string
    ) => {
        setLoader(true);
        const url = `/review/getCategories?businessId=${businessId}&locationId=${locationId}&productId=${productId}`;
        // const url = `/review/getinsightAnalytics?businessId=${businessId}&locationId=${locationId}`;
        try {
            const res = await GET(url);
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
                    resetAllCount();

                    res.data.categories.map(
                        ({
                            count,
                            percentage,
                            _id,
                        }: {
                            count: number;
                            percentage: number;
                            _id: string;
                        }) => {
                            switch (_id) {
                                case "negative":
                                    setNegReview({ count, percentage });
                                    break;
                                case "positive":
                                    setPosReview({ count, percentage });
                                    break;
                                case "neutral":
                                    setNeuReview({ count, percentage });
                                    break;
                                default:
                                    setMixReview({ count, percentage });
                                    break;
                            }
                        }
                    );
                }

                if (res.data.themes && res.data.themes.length) {
                    resetAllThemes();

                    res.data.themes.map(
                        ({
                            count,
                            percentage,
                            _id,
                        }: {
                            count: number;
                            percentage: number;
                            _id: string;
                        }) => {
                            switch (_id) {
                                case "Praise":
                                    setPraise({ count, percentage });
                                    break;
                                case "Complain":
                                    setComplain({ count, percentage });
                                    break;
                                case "Constructive":
                                    setConsFeed({ count, percentage });
                                    break;
                                default:
                                    setExperience({ count, percentage });
                                    break;
                            }
                        }
                    );
                }

                if (
                    res.data.reviewTimeSeries &&
                    res.data.reviewTimeSeries.length
                ) {
                    const data = res.data.reviewTimeSeries.map((e: any) => ({
                        entityName: "Review",
                        date: dayjs(e.date.split("T")),
                        score: Math.floor(e.sentimentScore * 10),
                    }));

                    const dynamicColor = theme.palette.primary.main;
                    const chartData = {
                        type: "Fooo",
                        data: {
                            labels: data.map((n: any) =>
                                dayjs(n.date).format("MMM, YYYY")
                            ),
                            datasets: [
                                {
                                    tension: 0.4,
                                    borderColor: dynamicColor,
                                    fill: "start",
                                    backgroundColor: ({
                                        chart,
                                    }: {
                                        chart: any;
                                    }) => {
                                        const bgGrd =
                                            chart.ctx.createLinearGradient(
                                                0,
                                                0,
                                                0,
                                                theme.breakpoints.up("lg")
                                                    ? 200
                                                    : 120
                                            );
                                        // More config for your gradient
                                        bgGrd.addColorStop(0, dynamicColor);
                                        bgGrd.addColorStop(1, "white");
                                        return bgGrd;
                                    },
                                    // backgroundColor: randomColor(),
                                    data: data.map((l: any) => l.score),
                                },
                            ],
                        },
                    };

                    setReviewTimeSeries(chartData);
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
        maintainAspectRatio: false,
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
                    <Typography variant="body1">Sentiments</Typography>
                    <Grid container spacing={3} mb={2}>
                        <Grid item xs={6} md={3}>
                            <StatCard
                                count={neuReview.count}
                                label="Neutral Reviews"
                                backgroundColor="rgb(178 226 254 / 50%)"
                                color="#00301fb3"
                                isImproving={true}
                                percentage={neuReview.percentage}
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <StatCard
                                count={posReview.count}
                                label="Positive Reviews"
                                backgroundColor="rgb(178 254 206 / 50%)"
                                color="#00301fb3"
                                isImproving={true}
                                percentage={posReview.percentage}
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <StatCard
                                count={negReview.count}
                                label="Negative Reviews"
                                backgroundColor="rgb(254 178 178 / 46%)"
                                color="#9d1414"
                                isImproving={false}
                                percentage={negReview.percentage}
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <StatCard
                                count={mixReview.count}
                                label="Mixed Reviews"
                                color="#00301fb3"
                                isImproving={true}
                                percentage={mixReview.percentage}
                            />
                        </Grid>
                    </Grid>
                    {/* <Divider mt={2}/> */}
                    {/* Themes */}
                    <Typography variant="body1" mt={2}>
                        Review Themes
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={6} md={3}>
                            <StatCard
                                count={praise.count}
                                label="Praise"
                                backgroundColor="rgb(152, 251, 152)"
                                color="#00301fb3"
                                isImproving={true}
                                percentage={praise.percentage}
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <StatCard
                                count={Complain.count}
                                label="Complain"
                                backgroundColor="rgb(254 178 178 / 46%)"
                                color="#9d1414"
                                isImproving={true}
                                percentage={Complain.percentage}
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <StatCard
                                count={consFeed.count}
                                label="Constructive"
                                backgroundColor="rgb(240,230,140)"
                                color="#fcc200"
                                isImproving={false}
                                percentage={consFeed.percentage}
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <StatCard
                                count={experience.count}
                                label="Experience"
                                backgroundColor="rgb(100, 149, 237)"
                                color="#00301fb3"
                                isImproving={true}
                                percentage={experience.percentage}
                            />
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            p: 2,
                            my: 3,
                            bgcolor: "#fff",
                            borderRadius: "1rem",
                        }}
                    >
                        {!!reviewTimeSeries && (
                            <AnalyticsChart
                                label={"Review time series"}
                                data={reviewTimeSeries.data}
                            />
                        )}
                        <Box textAlign="right">
                            <Typography
                                variant="caption"
                                color="text.primary"
                                gutterBottom
                                align="right"
                            >
                                * Score defines how one amenity or entity is
                                performing.
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    flexWrap: "wrap",
                                    width: "100%",
                                    "& > * ": {
                                        ml: 1,
                                    },
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    gutterBottom
                                    // color="error"
                                >
                                    ** -10 to -1 Low performer.{" "}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    gutterBottom
                                    // color="warning"
                                >
                                    ** 0 to 4 Satisfactory.{" "}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    // sx={{ color: "blue" }}
                                    gutterBottom
                                >
                                    ** 5 to 7 Good.{" "}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    // color="success"
                                    gutterBottom
                                >
                                    {" "}
                                    ** 8 above - Very good.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
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
                                .map((r: any, i: number) => (
                                    <ReviewItem
                                        key={i}
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
                                    theme.palette.success.light,
                                    0.1
                                ),
                                p: 2,
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="success.dark"
                                gutterBottom
                                fontWeight={600}
                            >
                                Positive insights
                            </Typography>
                            {positiveInsights.map(
                                (e: InsightType, i: number) => (
                                    <Tooltip
                                        title={`${camelCaseToTitleCase(
                                            e.name
                                        )} appears ${e.count} times.`}
                                        key={i}
                                    >
                                        <Chip
                                            size="small"
                                            // icon={<ThumbUpOutlinedIcon />}
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
                                                            alignItems:
                                                                "center",
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
                                )
                            )}
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
                            {negativeInsights.map(
                                (e: InsightType, i: number) => (
                                    <Tooltip
                                        title={`${camelCaseToTitleCase(
                                            e.name
                                        )} appears ${e.count} times.`}
                                        key={i}
                                    >
                                        <Chip
                                            key={e.name}
                                            size="small"
                                            // icon={<ThumbDownOffAltOutlinedIcon />}
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
                                                            alignItems:
                                                                "center",
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
                                )
                            )}
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
