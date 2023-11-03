import {
    Box,
    Avatar,
    Typography,
    Rating,
    IconButton,
    Chip,
    Tooltip,
} from "@mui/material";
import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import ReplyIcon from "@mui/icons-material/Reply";
import ShareIcon from "@mui/icons-material/Share";
import { IReviewItem } from "../../../interfaces/review.interface";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ReadMore from "../../core/readmore";

interface IReviewItemProps extends IReviewItem {
    listView: boolean;
    onReply: (data: any) => void;
    onRecommend: (data: any) => void;
}

const ReviewWrapper: any = styled(Box)(({ theme }) =>
    theme.unstable_sx({
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderBottom: "1px solid #aaa",
        position: "relative",
        p: 1,
    })
);

export default function ReviewItem(props: IReviewItemProps) {
    const [hasUserData, setHasUserData] = useState(false);

    useEffect(() => {
        if (props.cusName) setHasUserData(true);
        else setHasUserData(false);
    }, [props.cusName]);

    const getSentementColor = (
        type?: "evaluate" | "neutral" | "positive" | "negative"
    ): any => {
        let color = "";
        switch (type) {
            case "evaluate":
                color = "warning";
                break;
            case "neutral":
                color = "primary";
                break;
            case "positive":
                color = "success";
                break;
            case "negative":
                color = "error";
                break;
            default:
                color = "primary";
                break;
        }

        return color;
    };

    function share() {
        if (navigator.share) {
            navigator
                .share({
                    title: props.title,
                    text: props.desc,
                })
                .then(() => {
                    console.log("Thanks for sharing!");
                })
                .catch(console.error);
        } else {
            // fallback
        }
    }

    return (
        <ReviewWrapper>
            {/* Location details */}
            {(!props.listView || !hasUserData) && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        flex: 0.3,
                        // flexBasis: "27%",
                    }}
                >
                    <Avatar
                        variant="rounded"
                        src="https://www.rci.com/static/Resorts/Assets/3603E02L.jpg"
                    >
                        Hotel
                    </Avatar>
                    <Box sx={{ ml: 0.8 }}>
                        <Typography
                            variant="caption"
                            component="p"
                            fontWeight="600"
                            lineHeight={1.1}
                            gutterBottom
                        >
                            {props.locationName}
                        </Typography>
                        <Typography
                            variant="caption"
                            component="p"
                            sx={{ color: "#777", lineHeight: 1 }}
                        >
                            {props.city}, {props.country}
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* User details */}
            {hasUserData && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignContent: "center",
                        flex: 0.2,
                        // flexBasis: { xs: "100%", md: "27%" },
                        flexDirection: { xs: "row", md: "column" },
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="flex-start"
                        alignContent="center"
                    >
                        <Avatar src="https://api.multiavatar.com/kathrin.svg">
                            User
                        </Avatar>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignContent="center"
                            sx={{ ml: 0.8 }}
                        >
                            <Typography
                                variant="caption"
                                component="p"
                                fontWeight="600"
                            >
                                {props.cusName || "John Doe"}
                            </Typography>
                            <Typography
                                variant="caption"
                                component="p"
                                gutterBottom
                                sx={{ color: "#777", lineHeight: 1, mb: 2 }}
                            >
                                {props.cusCity}, {props.cusCountry}
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        size="small"
                        icon={
                            <img
                                src={
                                    (props?.source &&
                                        `/${props?.source
                                            .split(" ")
                                            .join("")}.png`) ||
                                    "https://www.google.com/images/hpp/ic_wahlberg_product_core_48.png8.png"
                                }
                                height={20}
                                width={20}
                                style={{ borderRadius: "50%" }}
                            />
                        }
                        label={
                            <small>{props?.source.toUpperCase()}</small> ||
                            "Source"
                        }
                        variant="outlined"
                        sx={{ width: "min-content" }}
                    />
                </Box>
            )}

            {/* Review Details */}
            <Box sx={{ flex: 1, pl: 2 }} className="review__review">
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignContent="center"
                >
                    {!!props.rating && (
                        <Rating
                            name="read-only"
                            value={props.rating}
                            readOnly
                        />
                    )}

                    <Typography
                        variant="caption"
                        component="p"
                        sx={{ color: "#777", px: 1, lineHeight: 2 }}
                    >
                        {props.date && props.date.split("T")[0]}
                        {/* {dayjs(props.date).format("DD/MM/YYYY")} */}
                        {/* {format(new Date(props.date), "MMM-dd-yyyy")} */}
                    </Typography>
                    <Chip
                        label={
                            <small>{props.category?.toLocaleUpperCase()}</small>
                        }
                        size="small"
                        color={getSentementColor(props.category)}
                        variant="filled"
                        sx={{ ml: "auto", mr: 0.8 }}
                    />
                    {/* <Chip
                        label={
                            <small>
                                {props.replyMessage
                                    ? "Published "
                                    : "Not Published"}
                            </small>
                        }
                        size="small"
                        color={props.replyMessage ? "success" : "error"}
                        variant="outlined"
                        sx={{ ml: "auto", mr: 0.8 }}
                    /> */}

                    {!props.listView && (
                        <>
                            <Tooltip title="Reply">
                                <IconButton
                                    size="small"
                                    onClick={() => props.onReply(props)}
                                >
                                    <ReplyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            {props.category === "negative" && (
                                <Tooltip title="Recommendation">
                                    <IconButton
                                        size="small"
                                        onClick={() => props.onRecommend(props)}
                                    >
                                        <AutoFixHighIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title="Share">
                                <IconButton size="small" onClick={share}>
                                    <ShareIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </Box>
                <Typography variant="body2" fontWeight="500" gutterBottom>
                    {props.title}
                </Typography>
                <Typography
                    variant="caption"
                    component="p"
                    sx={{ color: "#777", lineHeight: "140%", mt: 1 }}
                >
                    <ReadMore>{`${props.desc}`}</ReadMore>
                </Typography>
            </Box>
        </ReviewWrapper>
    );
}
