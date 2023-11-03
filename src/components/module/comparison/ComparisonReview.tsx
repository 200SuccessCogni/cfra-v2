import { GET } from "../../../services/api.service";
import { Grid, Typography, Box } from "@mui/material";
import { useState } from "react";
import { Avatar, Rating } from "@mui/material";

const reviewData = {
    _id: "64a6e11e7539ebd134ba1a67",
    userId: "649bf0f508c96b1fae7f215f",
    resortId: "649da34e953f4d5cdeaff1bb",
    resortName: "Resort 1",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    title: "Good resort to stay in",
    desc: "The foyer and public places are splendid but the rooms are a little tired nowadays. The service is excellent. The food choices are better than most of the other hotels we stayed in but still mainly North Indian. Fresh fruit was available in the room but basic. In a country where fresh fruit is in abundance I would have liked some exotic fruit in the restaurant. The pool area had ample sunbeds.",
    cusName: "John Doe",
    cusCity: "New York",
    cusState: "New York",
    cusCountry: "US",
    source: "google",
    rating: 4,
    upVote: 5,
    isSeen: false,
    isActioned: false,
    replyMessage: "",
    sentimentScore: 0.2,
    sentimentMagnitude: 2.2,
    category: "positive",
    date: "2023-06-08T00:00:00",
    __v: 0,
    createdAt: "2023-07-06T15:43:27.308Z",
    updatedAt: "2023-07-06T15:43:27.308Z",
};

function ComparisonReview() {
    const [review, setReview] = useState(reviewData);

    return (
        <Grid item md={9}>
            <Box sx={{ flex: 0.6 }} className="review__review">
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignContent="center"
                >
                    <Rating name="read-only" value={review.rating} readOnly />

                    <Typography
                        variant="caption"
                        component="p"
                        sx={{ color: "#777", px: 1, lineHeight: 2 }}
                    >
                        {review.date}
                    </Typography>
                </Box>
                <Typography variant="body2" fontWeight="500" gutterBottom>
                    {review.title}
                </Typography>
                <Typography
                    variant="caption"
                    component="p"
                    sx={{ color: "#777", lineHeight: "140%" }}
                >
                    {review.desc}
                </Typography>
            </Box>
        </Grid>
    );
}

export default ComparisonReview;
