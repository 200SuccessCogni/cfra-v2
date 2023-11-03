import React, { useState } from "react";
import {
    FormControl,
    FormControlLabel,
    FormGroup,
    Typography,
    Rating,
    Checkbox,
    Button,
    Box,
} from "@mui/material";

const sourceList = [
    { name: "Local", isChecked: true, value: "local" },
    { name: "Google", isChecked: true, value: "google" },
    { name: "Booking.com", isChecked: true, value: "booking" },
    { name: "TripAdvisor", isChecked: true, value: "tripadvisor" },
    { name: "MakeMyTrip", isChecked: true, value: "make myt rip" },
    { name: "Trivago", isChecked: true, value: "trivago" },
    { name: "Go Ibibo", isChecked: true, value: "go ibibo" },
];

const ratingsLables = [
    { name: "Negative", isChecked: true },
    { name: "Positive", isChecked: true },
    { name: "Neutral", isChecked: true },
    { name: "Evaluate", isChecked: true },
];

interface Iprops {
    sourcesFilter: (data: any) => void;
    showCategory?: boolean;
}

function ReviewForm(props: Iprops) {
    const [rating, setRating] = useState<number | null>(5);
    const [filters, setFilters] = useState(sourceList);
    const [categories, setCategories] = useState(ratingsLables);
    const [isApplied, setIsApplied] = useState(false);

    const handleChange = (index: number, type: string) => {
        if (type === "source") {
            const buildNewList = filters.map((e, i) => {
                if (index === i) e.isChecked = !e.isChecked;
                return e;
            });

            setFilters(buildNewList);
        } else if (type === "category") {
            const buildCategory = categories.map((e, i) => {
                if (index === i) e.isChecked = !e.isChecked;
                return e;
            });
            setCategories(buildCategory);
        }
    };

    function ratingHandler(ev: React.SyntheticEvent, value: number | null) {
        setRating(value);
    }

    function appyFilterHandler() {
        const payload = {
            source: filters.filter((e) => e.isChecked).map((e) => e.value),
            rating: rating,
            categories: categories
                .filter((e) => e.isChecked)
                .map((e) => e.name.toLowerCase()),
        };

        setIsApplied(true);
        props.sourcesFilter(payload);
    }

    function resetFilter() {
        setFilters((fil) => fil.map((e) => ({ ...e, isChecked: true })));
        setCategories((fil) => fil.map((e) => ({ ...e, isChecked: true })));
        setRating(5);
        setIsApplied(false);
        props.sourcesFilter(null); // sending null to reset filter
    }

    return (
        <>
            <Typography variant="body2" sx={{ color: "#666" }}>
                By Source
            </Typography>
            <FormGroup>
                {filters.length > 0 &&
                    filters.map((item, i) => (
                        <FormControlLabel
                            key={i}
                            control={
                                <Checkbox
                                    size="small"
                                    checked={item.isChecked}
                                    sx={{
                                        color: "#444",
                                        "&.Mui-checked": {
                                            color: "#444",
                                        },
                                    }}
                                    onChange={() => handleChange(i, "source")}
                                />
                            }
                            label={
                                <Typography variant="body2">
                                    {item.name}
                                </Typography>
                            }
                        />
                    ))}
                {/* <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ mt: 1, color: "#666" }}
                >
                    By ratings
                </Typography> */}
                {/* <FormControl>
                    <Rating
                        name="read-only"
                        value={rating}
                        onChange={ratingHandler}
                    />
                </FormControl> */}
                {!!props?.showCategory && (
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                            variant="body2"
                            gutterBottom
                            sx={{ mt: 1, color: "#666" }}
                        >
                            By Category
                        </Typography>
                        {categories.length > 0 &&
                            categories.map((item, i) => (
                                <FormControlLabel
                                    key={i}
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={item.isChecked}
                                            sx={{
                                                color: "#444",
                                                "&.Mui-checked": {
                                                    color: "#444",
                                                },
                                            }}
                                            onChange={() =>
                                                handleChange(i, "category")
                                            }
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            {item.name}
                                        </Typography>
                                    }
                                />
                            ))}
                    </Box>
                )}
            </FormGroup>
            <Box display="flex" justifyContent="flex-end">
                <Button
                    variant="outlined"
                    size="small"
                    color="black"
                    sx={{ mt: 2 }}
                    disabled={!isApplied}
                    onClick={resetFilter}
                >
                    Reset
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    color="black"
                    sx={{ mt: 2, ml: 1 }}
                    onClick={appyFilterHandler}
                >
                    Apply
                </Button>
            </Box>
        </>
    );
}

export default ReviewForm;
