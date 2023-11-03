import { useCallback } from "react";
import ReviewItem from "../components/module/review/ReviewItem";
import { GET } from "../services/api.service";
import { Grid, Typography, Box } from "@mui/material";
import { useRef, useEffect, useState } from "react";
import useApp from "../store/app.context";
import ReviewForm from "../components/module/review/ReviewForm";
import { IReviewItem } from "../interfaces/review.interface";
import dayjs from "dayjs";
import ReplyModal from "../components/modals/ReplyModal";
import useMediaQuery from "@mui/material/useMediaQuery";
import RecommendModal from "../components/modals/RecommendModal";
import DateRangeRounded from "@mui/icons-material/DateRangeRounded";
import Pagination from "@mui/material/Pagination";

function Reviews() {
    const {
        setLoader,
        loader,
        allReviews,
        setALLReviews,
        user,
        selectedLocation,
    } = useApp();
    const [reviews, setReviews] = useState<IReviewItem[] | null>(null);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);

    const [paginationCount, setPaginationCount] = useState(1);
    const [filterReviews, setFilterReviews] = useState<IReviewItem[] | null>(
        null
    );
    const [selectedReview, setSelectedReview] = useState<IReviewItem | null>(
        null
    );
    const [showRecModal, setShowRecModal] = useState(false);
    const recommendedTxt = useRef("");
    // const isSmallDevice = useMediaQuery("(max-width: 0px)");

    useEffect(() => {
        setReviews(allReviews.slice(count, limit));
        setPaginationCount(
            allReviews.length > 10 ? Math.round(allReviews.length / 10) : 1
        );
    }, [allReviews]);

    useEffect(() => {
        console.log({ selectedLocation });
        if (
            user &&
            user?.business &&
            user.business?.businessId &&
            selectedLocation
        ) {
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

    const onPaginate = (pageNumber: number) => {
        const newLimit = pageNumber * 10;
        const newCount = newLimit - 10;
        setLimit(newLimit);
        setCount(newCount);
        setReviews(allReviews.slice(newCount, newLimit));
    };

    const onRecommend = (data: any) => {
        recommendedTxt.current = data.desc;
        setShowRecModal(true);
    };

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
            <Typography variant="h5" fontWeight={500}>
                Reviews
            </Typography>
            <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item xs={12} md={9}>
                    <Box
                        sx={{
                            bgcolor: "#fff",
                            borderRadius: "10px",
                            p: 3,
                        }}
                    >
                        <Typography
                            variant="body1"
                            gutterBottom
                            fontWeight={500}
                        >
                            List of all reviews
                        </Typography>
                        {reviews &&
                            !!reviews.length &&
                            !isFiltered &&
                            reviews.map((r: any) => (
                                <ReviewItem
                                    key={r.id}
                                    date={dayjs(r.date).format("DD/MM/YYYY")}
                                    onReply={(data) => setSelectedReview(data)}
                                    onRecommend={(data) => onRecommend(data)}
                                    listView={false}
                                    {...r}
                                />
                            ))}
                        {filterReviews &&
                            !!filterReviews.length &&
                            !!isFiltered &&
                            filterReviews.map((r: any) => (
                                <ReviewItem
                                    key={r.id}
                                    date={dayjs(r.date).format("DD/MM/YYYY")}
                                    onReply={(data) => setSelectedReview(data)}
                                    onRecommend={(data) => onRecommend(data)}
                                    listView={false}
                                    {...r}
                                />
                            ))}

                        {reviews && !reviews.length && !loader && (
                            <Typography variant="h6">
                                No records found
                            </Typography>
                        )}

                        {reviews && !!reviews.length && (
                            <Box
                                sx={{
                                    my: 2,
                                    px: 2,
                                    ml: "auto",
                                    width: "100%",
                                    "& .MuiPagination-ul": {
                                        justifyContent: "flex-end",
                                    },
                                }}
                            >
                                <Pagination
                                    count={paginationCount}
                                    variant="outlined"
                                    shape="rounded"
                                    onChange={(e, p) => onPaginate(p)}
                                />
                            </Box>
                        )}
                    </Box>
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
                            bgcolor: "#fff",
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

            {selectedReview && (
                <ReplyModal
                    title={selectedReview.title}
                    description={selectedReview.desc}
                    show={!!selectedReview}
                    closeHandler={() => setSelectedReview(null)}
                    rating={selectedReview.rating}
                />
            )}

            <RecommendModal
                reviewText={recommendedTxt.current}
                show={showRecModal}
                closeHandler={() => setShowRecModal(false)}
            />
        </>
    );
}

export default Reviews;
