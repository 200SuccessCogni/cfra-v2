import { useEffect, useState } from "react";
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

function Analytics() {
    const theme = useTheme();
    const [insights, setInsights] = useState<InsightType[]>([]);
    const { setLoader, user, selectedLocation } = useApp();
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
    const [showFiler, setShowFilter] = useState(false);
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
                selectedLocation.id
            );
            // loadLocalInsightJSON(selectedLocation.id);
        }
    }, [user, selectedLocation]);

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
        locationId: string
    ) => {
        setLoader(true);
        const url = `/review/getInsightAnalytics?businessId=${businessId}&locationId=${locationId}`; // not live
        // const url = `/review/getSummarizedInsightAnalytics?businessId=${businessId}&locationId=${locationId}`; // live
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
                Analytics
            </Typography>
            <Grid container spacing={3} sx={{ mt: 0, height: "auto" }}>
                <Grid item xs={12} md={9}>
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
                            <OverallScore
                                scores={insights.filter((e) => e.checked)}
                            />
                        </Box>
                    )}

                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: "1rem",
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
        </>
    );
}

export default Analytics;
