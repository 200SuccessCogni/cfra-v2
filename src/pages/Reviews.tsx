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
        selectedProduct,
    } = useApp();
    const [reviews, setReviews] = useState<IReviewItem[] | null>(null);

    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);
    const [paginationCount, setPaginationCount] = useState(1);

    const [selectedReview, setSelectedReview] = useState<IReviewItem | null>(
        null
    );
    const [showRecModal, setShowRecModal] = useState(false);
    const recommendedTxt = useRef("");
    // const isSmallDevice = useMediaQuery("(max-width: 0px)");

    useEffect(() => {
        if (
            user &&
            user?.business &&
            user.business?.businessId &&
            selectedLocation
        ) {
            getAllReviews(
                user?.business?.businessId,
                selectedLocation.id,
                selectedProduct?.id || null
            );
        }
    }, [user, selectedLocation, selectedProduct]);

    const paginateCountHandler = (reviews: any[]) => {
        setPaginationCount(
            reviews.length > 10 ? Math.round(reviews.length / 10) : 1
        );
    };

    /**
     * Get the list of all reviews
     */
    const getAllReviews = useCallback(
        async (
            businessId: string,
            locationId: string,
            productId: string,
            rating?: number,
            source?: string[],
            categories?: string[]
        ) => {
            setLoader(true);
            const baseURL = `/review/getall?businessId=${businessId}&locationId=${locationId}&productId=${productId}`;
            // const url = baseURL;
            // if (source || categories || rating) {
            //     const sourceList =
            //         (source &&
            //             source.length &&
            //             source.reduce((a, c) => `${a}, ${c}`)) ||
            //         "";
            //     const categoryList =
            //         (categories &&
            //             categories.length &&
            //             categories.reduce((a, c) => `${a}, ${c}`)) ||
            //         "";
            //     url =
            //         url +
            //         `&rating=${rating}&category=${categoryList}`;
            // }
            try {
                const res = await GET(baseURL);
                if (res && res.status === 200) {
                    const allReviews: IReviewItem[] = res.data.data.map(
                        (e: any) => ({
                            ...e,
                            id: e._id,
                        })
                    );
                    setReviews(allReviews);
                    setALLReviews(allReviews);
                    paginateCountHandler(allReviews);
                }
            } catch (err) {
                console.log(err);
            }
            setLoader(false);
        },
        []
    );

    /**
     * Get the paginated review list
     * @param pageNumber
     */
    const onPaginate = (pageNumber: number) => {
        const newLimit = pageNumber * 10;
        const newCount = newLimit - 10;
        setLimit(newLimit);
        setCount(newCount);
    };

    const onRecommend = (data: any) => {
        recommendedTxt.current = data.desc;
        setShowRecModal(true);
    };

    const onFilterApply = (filterData: any) => {
        console.log({ filterData });
        // Resetting filter
        if (!filterData) {
            setReviews([...allReviews]);
            return;
        }

        let buildNewReviews: IReviewItem[] = [];
        if (reviews) {
            if (
                filterData.source &&
                Array.isArray(filterData.source) &&
                filterData.source.length
            ) {
                buildNewReviews = allReviews.filter((e) => {
                    return filterData.source.some((i: any) => {
                        return i === e.source;
                    });
                });
            }

            // filter by rating
            if (filterData.rating < 5) {
                buildNewReviews = allReviews.filter((e) => {
                    if (e.rating) {
                        return e.rating <= filterData.rating;
                    } else false;
                });
            }

            if (filterData?.categories?.length) {
                buildNewReviews = allReviews.filter((e) => {
                    return filterData.categories.some((i: any) => {
                        return i === e.category;
                    });
                });
            }

            setReviews(buildNewReviews);
            paginateCountHandler(buildNewReviews);
            console.log({ buildNewReviews });
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
                            reviews
                                .slice(count, limit)
                                .map((r: any) => (
                                    <ReviewItem
                                        key={r.id}
                                        date={dayjs(r.date).format(
                                            "DD/MM/YYYY"
                                        )}
                                        onReply={(data: any) =>
                                            setSelectedReview(data)
                                        }
                                        onRecommend={(data: any) =>
                                            onRecommend(data)
                                        }
                                        listView={false}
                                        {...r}
                                    />
                                ))}
                        {/* {filterReviews &&
                            !!filterReviews.length &&
                            !!isFiltered &&
                            filterReviews.map((r: any) => (
                                <ReviewItem
                                    key={r.id}
                                    date={dayjs(r.date).format("DD/MM/YYYY")}
                                    onReply={(data: any) =>
                                        setSelectedReview(data)
                                    }
                                    onRecommend={(data: any) =>
                                        onRecommend(data)
                                    }
                                    listView={false}
                                    {...r}
                                />
                            ))} */}

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

                {/* Review filter form */}
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
                                bgcolor: "#fff",
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
                                showCategory={true}
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Modals */}
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
