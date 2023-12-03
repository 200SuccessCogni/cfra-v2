import React, { useEffect, useState, useCallback, useRef } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

import {
    OverallScoreType,
    InsightType,
    ScoreAccordCardType,
} from "../types/analytics";
import { camelCaseToTitleCase } from "../../../services/shared.service";
import { alpha, useTheme } from "@mui/material/styles";

import LinerarProgressTwoWay from "../../core/linerarProgressTwoWay";
import { POST } from "../../../services/api.service";

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
        borderBottom: 0,
    },
    "&:before": {
        display: "none",
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
        {...props}
    />
))(({ theme, color = "#000" }) => ({
    backgroundColor:
        theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, .05)"
            : alpha(color, 0.1),
    flexDirection: "row-reverse",
    padding: "0px 15px",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
        transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
        marginLeft: theme.spacing(1),
        width: "100%",
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function ScoreAccordCard(props: ScoreAccordCardType) {
    const theme = useTheme();
    const [loader, setLoader] = useState(false);
    const [summary, setSummary] = useState("");
    const prevSelectedInsight = useRef("");

    const getInsightSumm = useCallback(async () => {
        try {
            setLoader(true);
            const res = await POST("/review/getInsightSummaries", {
                insight: props.label,
                desc: props.descArr,
            });
            console.log(res);
            if (res && res.status === 200 && res.data) {
                setSummary(res.data.data);
            }
            setLoader(false);
        } catch (err) {
            setLoader(false);
            console.log(err);
        }
    }, [props.label]);

    useEffect(() => {
        if (prevSelectedInsight.current != props.label) getInsightSumm();
        prevSelectedInsight.current = props.label;
    }, [props.label, props.expanded]);

    return (
        <Accordion
            key={props.label}
            expanded={props.expanded}
            onChange={props.onClick}
        >
            <AccordionSummary
                color={
                    props.value < 0
                        ? theme.palette.error.light
                        : props.value > 5
                        ? theme.palette.success.light
                        : theme.palette.success.light
                }
                aria-controls="panel1d-content"
                id="panel1d-header"
            >
                <Box
                    sx={{
                        px: 2,
                        py: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: 2,
                        width: "100%",
                    }}
                >
                    <Box flexBasis="30%">
                        <Typography variant="body2" fontWeight={600}>
                            {camelCaseToTitleCase(props.label)}
                        </Typography>
                    </Box>
                    <Box flexBasis="70%">
                        <LinerarProgressTwoWay value={props.value * 10} />
                    </Box>
                    <Typography sx={{ px: 2 }}>{props.value}</Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                {!!loader && <LinearProgress color="primary" />}
                <Typography variant="body2" fontWeight={500} gutterBottom>
                    Summary
                </Typography>
                <Typography
                    sx={{ display: "inline-block" }}
                    variant="caption"
                    color="text"
                    lineHeight={1.2}
                    fontWeight={500}
                >
                    {summary}
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
}

function OverallScore(props: OverallScoreType) {
    const [expanded, setExpanded] = React.useState<number>(0);

    const handleChange = (index: number) => setExpanded(index);
    const onSearch = (data: any) => {
        console.log(data);
    };

    return (
        <>
            {props.scores &&
                props.scores.map((e: InsightType, i: number) => (
                    <ScoreAccordCard
                        key={i}
                        {...e}
                        expanded={expanded === i}
                        onClick={(data: any) => handleChange(i)}
                    />
                ))}
        </>
    );
}

export default OverallScore;
