import React, { useEffect, useState } from "react";
import {
    FormControl,
    FormControlLabel,
    FormGroup,
    Typography,
    Rating,
    Checkbox,
    Button,
    Box,
    Divider,
} from "@mui/material";
import useApp from "../../../store/app.context"



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
   
    const { config } = useApp()

    const sourceList = [...config.reviewSource.map(e => ({...e, isChecked: true}))];
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
            <Typography variant="body2" gutterBottom sx={{ color: "#666" }}>
                By Source
            </Typography>
            <Divider />
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
                        <Divider />
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
