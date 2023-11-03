import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { AnalyticsOverviewCard } from "../types/analytics";

function OverviewCard(props: AnalyticsOverviewCard) {
    return (
        <Box
            sx={{
                backgroundColor: props.bgColor,
                borderRadius: "1rem",
                p: 2,
            }}
        >
            <Typography variant="caption" color="text.primary">
                {props.headerTitle}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {!props.contentText && (
                    <Skeleton variant="rounded" width={210} height={60} />
                )}
                {!!props.contentText && (
                    <Typography
                        variant="h4"
                        color="text.primary"
                        fontWeight={500}
                    >
                        {props.contentText}
                    </Typography>
                )}
                {props.icon && (
                    <Box
                        sx={{
                            backgroundColor: props.iconBgColor,
                            p: 1,
                            borderRadius: 2,
                            color: props.iconColor || "text.primary",
                        }}
                    >
                        {props.icon}
                    </Box>
                )}
                {props.count && (
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                        }}
                    >
                        <Typography
                            variant="h4"
                            color="text.primary"
                            fontWeight={500}
                        >
                            {props.count}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default OverviewCard;
