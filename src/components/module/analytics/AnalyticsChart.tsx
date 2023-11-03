import React from "react";
import { Box, Typography } from "@mui/material";
import LineChart from "../../../components/charts/LineChart";
import { AnalyticsChartType } from "../types/analytics";
import { camelCaseToTitleCase } from "../../../services/shared.service";

function AnalyticsChart(props: AnalyticsChartType) {
    const options = {
        responsive: true,
        // fill: true,
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                // ticks: {
                //     display: false,
                // },
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

    return (
        <Box
            sx={{
                borderRadius: "10px",
                width: "100%",
                border: "1px solid #eee",
                p: 2.5,
            }}
        >
            <Typography variant="body2" fontWeight={500} align="left">
                {camelCaseToTitleCase(props.label)}
            </Typography>
            <Typography
                variant="caption"
                fontWeight={400}
                align="left"
                gutterBottom
                color="text.secondary"
                sx={{ mb: 1 }}
            >
                Will show {camelCaseToTitleCase(props.label)} data over time
            </Typography>
            <Box>
                <LineChart
                    chartData={props.data}
                    options={{ ...props.options, ...options }}
                />
            </Box>
        </Box>
    );
}

export default AnalyticsChart;
