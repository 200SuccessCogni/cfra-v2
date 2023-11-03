import ReviewItem from "../components/module/review/ReviewItem";
import { GET } from "../services/api.service";
import LineChart from "../components/charts/LineChart";
import { Grid, Typography, Box } from "@mui/material";
import { useState } from "react";
import useApp from "../store/app.context";
import ReviewForm from "../components/module/review/ReviewForm";
import { IReviewItem } from "../interfaces/review.interface";

import ComparisonCard from "../components/module/comparison/ComparisonCard";
import UnderConstruction from "../components/app/UnderConstruction";

function Comparison() {
    const userData2 = {
        labels: ["26/06", "27/06", "28/06", "29/06", "30/06", "01/07", "02/07"],
        datasets: [
            {
                backgroundColor: [
                    "#51EAEA",
                    "#FCDDB0",
                    "#FF9D76",
                    "#FB3569",
                    "#82CD47",
                    "#DACD47",
                    "#AACD47",
                ],
                data: [4.2, 3.7, 1.8, 5, 4.1, 2.5, 4.6],
            },
        ],
    };

    const userData3 = {
        labels: ["26/06", "27/06", "28/06", "29/06", "30/06", "01/07", "02/07"],
        datasets: [
            {
                backgroundColor: [
                    "#51EAEA",
                    "#FCDDB0",
                    "#FF9D76",
                    "#FB3569",
                    "#82CD47",
                    "#DACD47",
                    "#AACD47",
                ],
                data: [3.2, 4.7, 2.8, 4.5, 1.1, 3.5, 4.6],
            },
        ],
    };

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

    const { setLoader, loader } = useApp();
    const [reviews, setReviews] = useState<IReviewItem[] | null>(null);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    const [filterReviews, setFilterReviews] = useState<IReviewItem[] | null>(
        null
    );

    const onFilterApply = (filterData: any) => {
        console.log({ filterData });
        // Resetting filter
        if (!filterData) {
            setIsFiltered(false);
            setFilterReviews([]);
            return;
        }

        let buildNewReviews: IReviewItem[] = [];
        if (reviews) {
            if (
                filterData.source &&
                Array.isArray(filterData.source) &&
                filterData.source.length
            ) {
                buildNewReviews = reviews.filter((e) => {
                    return filterData.source.some((i: any) => {
                        return i === e.source;
                    });
                });
            }

            // filter by rating
            if (filterData.rating < 5) {
                buildNewReviews = reviews.filter((e) => {
                    if (e.rating) {
                        return e.rating <= filterData.rating;
                    } else false;
                });
            }

            if (filterData?.categories?.length) {
                buildNewReviews = reviews.filter((e) => {
                    return filterData.categories.some((i: any) => {
                        return i === e.category;
                    });
                });
            }

            setIsFiltered(true);
            setFilterReviews(buildNewReviews);
        }
    };

    return (
        <>
            <UnderConstruction />
            {/* <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item md={9}>
                    <Box sx={{ background: "#fff", borderRadius: "10px" }}>
                        <Box
                            sx={{
                                background: "#fff",
                                borderRadius: "10px",
                                width: "100%",
                                p: 2,
                                mb: 3,
                            }}
                        >
                            <Grid container spacing={3} sx={{ mt: 0 }}>
                                <Grid item xs={6}>
                                    <ComparisonCard />
                                </Grid>
                                <Grid item xs={6}>
                                    <ComparisonCard />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>

                <Grid
                    item
                    md={3}
                    sx={{
                        display: "flex",
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
                            showCategory={true}
                        />
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item md={6}>
                    <Box
                        sx={{
                            background: "#fff",
                            borderRadius: "10px",
                            width: "100%",
                            p: 2,
                            mb: 3,
                        }}
                    >
                        <Box px={10}>
                            <LineChart
                                chartData={userData2}
                                options={options}
                            />
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{ textAlign: "center" }}
                        >
                            Activities
                        </Typography>
                    </Box>
                </Grid>
                <Grid item md={6}>
                    <Box
                        sx={{
                            background: "#fff",
                            borderRadius: "10px",
                            width: "100%",
                            p: 2,
                            mb: 3,
                        }}
                    >
                        <Box px={10}>
                            <LineChart
                                chartData={userData3}
                                options={options}
                            />
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{ textAlign: "center" }}
                        >
                            Comfort
                        </Typography>
                    </Box>
                </Grid>
                <Grid item md={6}>
                    <Box
                        sx={{
                            background: "#fff",
                            borderRadius: "10px",
                            width: "100%",
                            p: 2,
                            mb: 3,
                        }}
                    >
                        <Box px={10}>
                            <LineChart
                                chartData={userData2}
                                options={options}
                            />
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{ textAlign: "center" }}
                        >
                            Activities
                        </Typography>
                    </Box>
                </Grid>
                <Grid item md={6}>
                    <Box
                        sx={{
                            background: "#fff",
                            borderRadius: "10px",
                            width: "100%",
                            p: 2,
                            mb: 3,
                        }}
                    >
                        <Box px={10}>
                            <LineChart
                                chartData={userData3}
                                options={options}
                            />
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{ textAlign: "center" }}
                        >
                            Comfort
                        </Typography>
                    </Box>
                </Grid>
            </Grid> */}
        </>
    );
}

export default Comparison;
