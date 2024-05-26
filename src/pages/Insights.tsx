import { Fragment, useEffect, useState } from "react";
import LineChart from "../components/charts/LineChart";
import ReviewForm from "../components/module/review/ReviewForm";
import useApp from "../store/app.context";
import { GET, POST } from "../services/api.service";
import { alpha, useTheme } from "@mui/material/styles";
import {
    Box,
    Grid,
    Typography,
    Container,
    Fab,
    Tooltip,
    Chip,
    Button,
    Popover,
} from "@mui/material";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { camelCaseToTitleCase, randomColor } from "../services/shared.service";
import OverviewCard from "../components/module/analytics/OverviewCard";
import OverallScore from "../components/module/analytics/OverallScore";
import AnalyticsChart from "../components/module/analytics/AnalyticsChart";
import dayjs from "dayjs";
import AppPrompt from "../components/app/AppPrompt";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import PlaceIcon from "@mui/icons-material/Place";
import InsightFilterModal from "../components/modals/InsightFilterModal";
import ChatBot from "../components/module/chat";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import axios from "axios";

const initChartDataSet = [
    {
        label: "Bathroom",
        data: [2, 4, 2, 4, 2, 3, 2],
        borderColor: "rgb(255, 99, 132)",
        tension: 0.4,
        pointHoverBorderWidth: 1,
    },
    {
        label: "Bedroom",
        data: [4, 4, 2, 4, 2, 3, 3],
        borderColor: "rgb(53, 162, 235)",
        tension: 0.4,
        pointHoverBorderWidth: 1,
    },
    {
        label: "Housekeeping",
        data: [2, 1, 2, 3, 2.5, 3, 2],
        borderColor: "#095F59",
        tension: 0.4,
        pointHoverBorderWidth: 1,
    },
    {
        label: "Restaurant",
        data: [3, 4, 3, 4, 2, 1, 2],
        borderColor: "#FFD681",
        tension: 0.4,
        pointHoverBorderWidth: 1,
    },
    {
        label: "Bedroom",
        data: [4, 4, 2, 4, 2, 3, 3],
        borderColor: "rgb(53, 162, 235)",
        tension: 0.4,
        pointHoverBorderWidth: 1,
    },
    {
        label: "Housekeeping",
        data: [2, 1, 2, 3, 2.5, 3, 2],
        borderColor: "#095F59",
        tension: 0.4,
        pointHoverBorderWidth: 1,
    },
    {
        label: "Restaurant",
        data: [3, 4, 3, 4, 2, 1, 2],
        borderColor: "#FFD681",
        tension: 0.4,
        pointHoverBorderWidth: 1,
    },
];

type PerfAmentType = {
    _id: string;
    value: string | number;
};

type InsightType = {
    label: string;
    count: number;
    score: number;
    value: number;
    checked?: boolean;
    summary: string;
    descArr: string[];
};

function Insights() {
    const theme = useTheme();
    const [insights, setInsights] = useState<InsightType[]>([]);
    const [selectedInsights, setSelectedInsights] = useState<InsightType[]>([]);
    const { setLoader, user, selectedLocation, selectedProduct } = useApp();
    const [chartsData, setChartsData] = useState<any[]>();
    const [appliedDateSet, setAppliedDateSet] = useState(initChartDataSet);
    const [showFullPrompt, setShowFullPrompt] = useState(false);
    const [lowPerfAment, setLowPerfAment] = useState<PerfAmentType | null>(
        null
    );
    const [highPerfAment, setHighPerfAment] = useState<PerfAmentType | null>(
        null
    );
    const [positiveInsights, setPositiveInsights] = useState<InsightType[]>([]);
    const [negativeInsights, setNegativeInsights] = useState<InsightType[]>([]);
    const [showFilter, setShowFilter] = useState(false);
    const [isFilterApplied, setIsAppliedFilter] = useState(false);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const openChatBot = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const closeChatBot = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (
            user &&
            user?.business &&
            user?.business?.businessId &&
            selectedLocation
        ) {
            // reset
            setIsAppliedFilter(false);
            resetInights();
            setChartsData([]);

            getInsightsAndAnalytics(
                user?.business?.businessId,
                selectedLocation.id,
                selectedProduct?.id || null
            );
            // loadLocalInsightJSON(selectedLocation.id);
        }
    }, [user, selectedLocation, selectedProduct]);

    useEffect(() => {
        categoriesInsights(insights);
    }, [insights]);

    const resetInights = () => {
        setInsights([]);
        setPositiveInsights([]);
        setNegativeInsights([]);
    };

    const handleDelete = (index: number) => {
        setAppliedDateSet(
            appliedDateSet.filter(
                (e) => e.label !== appliedDateSet[index].label
            )
        );
    };

    const categoriesInsights = (insightsData: InsightType[]) => {
        let posIn = insightsData.filter((e: InsightType) => e.score > 0);
        if (posIn.length)
            posIn = posIn.sort((a, b) => (a.count < b.count ? 1 : -1));
        let negIn = insightsData.filter((e: InsightType) => e.score <= 0);
        if (negIn.length)
            negIn = negIn.sort((a, b) => (a.count < b.count ? 1 : -1));
        setPositiveInsights(posIn);
        setNegativeInsights(negIn);
    };

    const onFilterApply = (data: any) => {
        // console
    };

    const getInsightSumm = async (insight: string, descArr: string[]) => {
        try {
            const res = await POST("/review/getInsightSummaries", {
                insight,
                desc: descArr,
            });
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * Get stored insight data from local JSON
     * @param locId
     */
    const loadLocalInsightJSON = (locId: number) => {
        setLoader(true);
        const url = `/insights/loc${locId}.json`;
        console.log({ url });
        axios
            .get(url)
            .then((res) => {
                if (res) {
                    const insightsRes = res.data.insights;
                    const insights = buildInsightData(insightsRes);

                    if (
                        res.data.analytics &&
                        res.data.analytics.length &&
                        insights.length
                    ) {
                        const chartData = buildAnalyticsData(
                            insights,
                            res.data.analytics
                        );
                        setChartsData(
                            chartData.filter((e) => e.data.labels.length > 1)
                        );
                    }
                }

                setLoader(false);
            })
            .catch((err) => {
                console.log(err);
                setLoader(false);
            });
    };

    const getInsightsAndAnalytics = async (
        businessId: string,
        locationId: string,
        productId: string
    ) => {
        setLoader(true);
        const url = `/review/getInsightAnalytics?businessId=${businessId}&locationId=${locationId}&productId=${productId}`;
        // const url = `/review/getSummarizedInsightAnalytics?businessId=${businessId}&locationId=${locationId}`;
        try {
            const res = await GET(url);
            if (res && res.status === 200) {
                const insightsRes = res.data.insights;
                const insights = buildInsightData(insightsRes);

                if (
                    res.data.analytics &&
                    res.data.analytics.length &&
                    insights.length
                ) {
                    const chartData = buildAnalyticsData(
                        insights,
                        res.data.analytics
                    );
                    setChartsData(
                        chartData.filter((e) => e.data.labels.length > 1)
                    );
                }
            }

            setLoader(false);
        } catch (err) {
            console.log(err);
            setLoader(false);
        }
    };

    const buildInsightData = (insightData: any) => {
        let insights;
        if (insightData && insightData.length) {
            insights = insightData.map((e: any) => ({
                ...e,
                label: e._id,
                score: e.avgScore,
                count: e?.count,
                checked: true,
                value:
                    e.avgScore > 1
                        ? Math.floor(e.avgScore)
                        : Math.floor(e.avgScore * 10),
            }));
            // store in state
            setInsights(insights);

            // categories insights
            categoriesInsights(insights);

            /*setLowPerfAment(
                insights
                    .filter((e: any) => e.score < 0)
                    .reduce((a: any, b: any) => {
                        return a.value < b.value ? a : b;
                    })
            );

            setHighPerfAment(
                insights
                    .filter((e: any) => e.score > 0)
                    .reduce((a: any, b: any) => {
                        return a.value > b.value ? a : b;
                    })
            );*/
        }

        return insights;
    };

    const buildAnalyticsData = (insights: any, analyticsResData: any) => {
        const data = analyticsResData.map((e: any) => ({
            entityName: e.entityScores.entityName,
            date: dayjs(e.entityScores.date.split("T")),
            score: Math.floor(e.entityScores.sentimentScore * 10),
        }));

        const analyticsData: any[] = [];

        insights.forEach((e: any) => {
            analyticsData.push({
                type: e?.label,
                data: data.filter((d: any) => d.entityName === e?.label),
            });
        });

        const newData = analyticsData.map((a) => {
            const sortedData = a.data.sort((a: any, b: any) =>
                dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1
            );
            const data =
                sortedData.length < 6
                    ? sortedData
                    : sortedData.slice(
                          sortedData.length - 6,
                          sortedData.length
                      );
            return {
                type: a.type,
                data: data,
            };
        });

        const chartData = newData.map((e: any) => {
            const dynamicColor = theme.palette.primary.main;
            return {
                type: e.type,
                data: {
                    labels: e.data.map((n: any) =>
                        dayjs(n.date).format("MMM, YYYY")
                    ),
                    datasets: [
                        {
                            tension: 0.4,
                            borderColor: dynamicColor,
                            fill: "start",
                            backgroundColor: ({ chart }: { chart: any }) => {
                                const bgGrd = chart.ctx.createLinearGradient(
                                    0,
                                    0,
                                    0,
                                    theme.breakpoints.up("lg") ? 200 : 120
                                );
                                // More config for your gradient
                                bgGrd.addColorStop(0, dynamicColor);
                                bgGrd.addColorStop(1, "white");
                                return bgGrd;
                            },
                            // backgroundColor: randomColor(),
                            data: e.data.map((l: any) => l.score),
                        },
                    ],
                },
            };
        });

        return chartData;
    };

    const onPromptSearch = (query: string) => {
        console.log({ query });
    };

    return (
        <>
            <Typography variant="h5" fontWeight={500}>
                Insights & Analytics
            </Typography>
            <Grid container spacing={3} sx={{ mt: 0, height: "auto" }}>
                <Grid item xs={12} md={9}>
                    {/* <Container
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: "1rem",
                            px: 2,
                            pb: 3,
                            pt: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                variant="h6"
                                color="text.primary"
                                gutterBottom
                            >
                                Overview
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.primary"
                                gutterBottom
                            >
                                * Score defines how one amenity or entity is
                                performing.
                            </Typography>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <OverviewCard
                                    bgColor="secondary.light"
                                    // icon={<TrendingUpIcon />}
                                    // iconBgColor="#fff"

                                    count={
                                        (highPerfAment &&
                                            highPerfAment?.value) ||
                                        ""
                                    }
                                    contentText={
                                        (highPerfAment &&
                                            camelCaseToTitleCase(
                                                highPerfAment?._id
                                            )) ||
                                        ""
                                    }
                                    headerTitle="Top Performing Amenity / Entity"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <OverviewCard
                                    bgColor="secondary.light"
                                    contentText={
                                        (lowPerfAment &&
                                            camelCaseToTitleCase(
                                                lowPerfAment?._id
                                            )) ||
                                        ""
                                    }
                                    headerTitle="Low Performing Amenity / Entity"
                                    count={
                                        (lowPerfAment && lowPerfAment?.value) ||
                                        ""
                                    }
                                    // icon={<TrendingDownIcon />}
                                    // iconBgColor="#fff"
                                    // iconColor="text.contrastText"
                                />
                            </Grid>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    width: "100%",
                                    mt: 1.5,
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
                                    ** -10-0 Low performer.{" "}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    gutterBottom
                                    // color="warning"
                                >
                                    ** 0-4 Satisfactory.{" "}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    // sx={{ color: "blue" }}
                                    gutterBottom
                                >
                                    ** 5-7 Good.{" "}
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
                        </Grid>
                    </Container> */}
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            mb: 3,
                            p: 2,
                            borderRadius: "1rem",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    fontWeight={500}
                                    lineHeight={1}
                                >
                                    All insights
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "#777",
                                        mb: 2,
                                        display: "block",
                                    }}
                                    gutterBottom
                                    lineHeight={1.1}
                                    fontWeight={400}
                                >
                                    Insights are auto generated. Please choose
                                    insights relevant to your business.
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "#777",
                                        mb: 2,
                                        display: "block",
                                    }}
                                    gutterBottom
                                    lineHeight={1.1}
                                    fontWeight={400}
                                ></Typography>
                            </Box>
                            {/* <Box display="flex" alignItems="center">
                                <PlaceIcon />{" "}
                                <Typography
                                    variant="body2"
                                    gutterBottom
                                    lineHeight={1}
                                    sx={{ ml: 1 }}
                                    fontWeight={400}
                                >
                                    {selectedLocation &&
                                        selectedLocation?.locationName}
                                </Typography>
                            </Box> */}
                            <Button
                                variant="text"
                                onClick={() => setShowFilter(true)}
                            >
                                Filter
                            </Button>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        borderRadius: "1rem",
                                        backgroundColor: alpha(
                                            theme.palette.success.light,
                                            0.1
                                        ),
                                        py: 2,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="success.dark"
                                        gutterBottom
                                        fontWeight={600}
                                        sx={{ px: 2 }}
                                    >
                                        Positive insights
                                    </Typography>
                                    <Box
                                        sx={{
                                            overflowY: "auto",
                                            maxHeight: "60vh",
                                            px: 2,
                                        }}
                                    >
                                        {positiveInsights.map(
                                            (e: InsightType) => (
                                                <Fragment key={e.label}>
                                                    <Tooltip
                                                        title={`${camelCaseToTitleCase(
                                                            e.label
                                                        )} appears ${
                                                            e.count
                                                        } times.`}
                                                    >
                                                        <Chip
                                                            key={e.label}
                                                            size="small"
                                                            // icon={
                                                            //     <ThumbUpOutlinedIcon />
                                                            // }
                                                            label={
                                                                <Box
                                                                    display="flex"
                                                                    alignItems="center"
                                                                >
                                                                    <small>
                                                                        <strong>
                                                                            {camelCaseToTitleCase(
                                                                                e.label
                                                                            )}
                                                                        </strong>
                                                                    </small>
                                                                    <Box
                                                                        sx={{
                                                                            borderRadius:
                                                                                "50%",
                                                                            width: "20px",
                                                                            height: "20px",
                                                                            display:
                                                                                "flex",
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
                                                                        {
                                                                            e.count
                                                                        }
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
                                                </Fragment>
                                            )
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        borderRadius: "1rem",
                                        backgroundColor: alpha(
                                            theme.palette.warning.light,
                                            0.2
                                        ),
                                        py: 2,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="warning.main"
                                        gutterBottom
                                        fontWeight={600}
                                        sx={{ px: 2 }}
                                    >
                                        Negative insights
                                    </Typography>
                                    <Box
                                        sx={{
                                            overflowY: "auto",
                                            maxHeight: "60vh",
                                            px: 2,
                                        }}
                                    >
                                        {negativeInsights.map(
                                            (e: InsightType) => (
                                                <Fragment key={e.label}>
                                                    <Tooltip
                                                        title={`${camelCaseToTitleCase(
                                                            e.label
                                                        )} appears ${
                                                            e.count
                                                        } times.`}
                                                    >
                                                        <Chip
                                                            key={e.label}
                                                            size="small"
                                                            // icon={
                                                            //     <ThumbDownOffAltOutlinedIcon />
                                                            // }
                                                            label={
                                                                <Box
                                                                    display="flex"
                                                                    alignItems="center"
                                                                >
                                                                    <small>
                                                                        <strong>
                                                                            {camelCaseToTitleCase(
                                                                                e.label
                                                                            )}
                                                                        </strong>
                                                                    </small>
                                                                    <Box
                                                                        sx={{
                                                                            borderRadius:
                                                                                "50%",
                                                                            width: "20px",
                                                                            height: "20px",
                                                                            display:
                                                                                "flex",
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
                                                                        {
                                                                            e.count
                                                                        }
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
                                                </Fragment>
                                            )
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        <Typography
                            variant="caption"
                            color="black"
                            fontWeight={400}
                            align="right"
                        >
                            * Count defines how many times customer mentioned.
                        </Typography>
                    </Box>

                    {isFilterApplied && (
                        <Box
                            sx={{
                                backgroundColor: "#fff",
                                my: 3,
                                p: 2,
                                borderRadius: "1rem",
                            }}
                        >
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="flex-start"
                            >
                                <Box>
                                    <Typography
                                        variant="body1"
                                        gutterBottom
                                        fontWeight={500}
                                        lineHeight={1}
                                    >
                                        Overall Score
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom
                                        fontWeight={400}
                                        sx={{ mb: 2 }}
                                    >
                                        {selectedLocation &&
                                            selectedLocation?.locationName}
                                    </Typography>
                                </Box>
                                <Box textAlign="right" width="60%">
                                    <Typography
                                        variant="caption"
                                        color="text.primary"
                                        gutterBottom
                                        align="right"
                                    >
                                        * Score defines how one amenity or
                                        entity is performing.
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
                            <OverallScore scores={selectedInsights} />
                        </Box>
                    )}
                    {/* <Box
                        sx={{
                            borderRadius: "1rem",
                            backgroundColor: "secondary.light",
                            p: 2,
                            my: 4,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                variant="body1"
                                gutterBottom
                                fontWeight={500}
                                // sx={{ mb: 2 }}
                            >
                                General Amenity Activity
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexBasis: "40%",
                                }}
                            >
                                <Link underline="hover">
                                    <small>Last year</small>
                                </Link>
                                <Link underline="hover">
                                    <small>Last 6 month</small>
                                </Link>
                                <Link underline="hover">
                                    <small>Last month</small>
                                </Link>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Box>
                                {appliedDateSet.map((e, i) => (
                                    <Chip
                                        label={e.label}
                                        variant="outlined"
                                        key={i}
                                        sx={{
                                            color: "text.primary",
                                            m: 0.5,
                                            backgroundColor: e.borderColor,
                                        }}
                                        onDelete={() => handleDelete(i)}
                                        size="small"
                                    />
                                ))}
                                <Chip
                                    label="Customize"
                                    color="primary"
                                    sx={{
                                        m: 0.5,
                                        bgColor: "black",
                                        color: "text.contrastText",
                                    }}
                                    size="small"
                                />
                            </Box>
                            <Button
                                color="black"
                                variant="contained"
                                size="small"
                                sx={{
                                    boxShadow: "none",
                                    ml: "auto",
                                    mt: 1,
                                }}
                            >
                                {" "}
                                Report
                            </Button>
                        </Box>
                        <AnalyticsChart dataSet={appliedDateSet} />
                    </Box> */}
                    {!![].length && (
                        <Box
                            sx={{
                                backgroundColor: "#fff",
                                borderRadius: "1rem",
                                my: 3,
                                p: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    fontWeight={500}
                                    sx={{ mb: 2 }}
                                >
                                    In details analysis
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        width: "100%",
                                        "& > * ": {
                                            ml: 1,
                                        },
                                        flexBasis: "60%",
                                        flexWrap: "wrap",
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
                            <Grid container spacing={3} sx={{ mt: 0 }}>
                                {!!chartsData &&
                                    !!chartsData.length &&
                                    chartsData.map((e: any, i: number) => (
                                        <Grid item xs={12} md={6} key={i}>
                                            <AnalyticsChart
                                                label={e.type}
                                                data={e.data}
                                            />
                                        </Grid>
                                    ))}
                            </Grid>
                        </Box>
                    )}
                    {showFullPrompt && (
                        <Box
                            sx={{
                                position: "sticky",
                                bottom: 0,
                                right: 0,
                                backgroundColor: "#fff",
                                borderRadius: "1rem",
                                width: "100%",
                                p: 1,
                                pr: 4,
                                boxShadow: "2px 3px 10px #eee",
                                border: "1px solid #eee",
                            }}
                        >
                            <AppPrompt
                                label="Type your insight prompt"
                                onClick={onPromptSearch}
                            />
                        </Box>
                    )}
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
                    <Box sx={{ position: "relative", width: "100%" }}>
                        <Box
                            sx={{
                                backgroundColor: "#fff",
                                borderRadius: "10px",
                                p: 3,
                                width: "100%",
                                position: "sticky",
                                top: 0,
                                right: 0,
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
                    </Box>
                </Grid>
            </Grid>

            <Popover
                id={anchorEl ? "simple-popover" : undefined}
                open={!!anchorEl}
                anchorEl={anchorEl}
                // onClose={closeChatBot}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <ChatBot closeHandler={closeChatBot} />
            </Popover>

            <Box
                sx={{
                    position: "fixed",
                    bottom: "1.5rem",
                    right: "2.5rem",
                }}
            >
                {/* {!showFullPrompt && ( */}
                <Box display="flex" justifyContent="flex-end">
                    <Tooltip title="Get more insights">
                        <Fab
                            variant="extended"
                            color="primary"
                            onClick={openChatBot}
                        >
                            <ChatRoundedIcon />
                        </Fab>
                    </Tooltip>
                </Box>
                {/* )} */}
            </Box>
            <InsightFilterModal
                show={showFilter}
                entities={insights && insights}
                onSelect={(data: any) => {
                    setSelectedInsights(
                        data.filter((e: InsightType) => e.checked)
                    );
                    setIsAppliedFilter(true);
                }}
                closeHandler={() => setShowFilter(false)}
            />
        </>
    );
}

export default Insights;

/*const AnalyticsChart = ({ dataSet }: { dataSet: any[] }) => {
    const [chartData, setChartData] = useState({
        labels: ["26/06", "27/06", "28/06", "29/06", "30/06", "01/07", "02/07"],
        datasets: dataSet,
    });

    useEffect(() => {
        setChartData({
            labels: [
                "26/06",
                "27/06",
                "28/06",
                "29/06",
                "30/06",
                "01/07",
                "02/07",
            ],
            datasets: dataSet,
        });
    }, [dataSet]);

    const options = {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                ticks: {
                    display: false,
                },
            },
        },
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

    return <LineChart chartData={chartData} options={options} />;
};*/
