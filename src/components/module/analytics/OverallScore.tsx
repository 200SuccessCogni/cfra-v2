import React from "react";
import { Box, Typography } from "@mui/material";

import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

import { OverallScoreType } from "../types/analytics";
import { camelCaseToTitleCase } from "../../../services/shared.service";
import LinearProgressWithLabel from "../../../components/core/linearProgressWithLabel";
import { alpha, useTheme } from "@mui/material/styles";

import AppPrompt from "../../app/AppPrompt";

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

function OverallScore(props: OverallScoreType) {
    const [expanded, setExpanded] = React.useState<number>(0);
    const theme = useTheme();

    const handleChange = (index: number) => setExpanded(index);
    const onSearch = (data: any) => {
        console.log(data);
    };

    return (
        <>
            {props.scores &&
                props.scores.map(
                    (
                        e: { label: string; value: number; summary: string },
                        i: number
                    ) => (
                        <Accordion
                            key={e.label}
                            expanded={expanded === i}
                            onChange={() => handleChange(i)}
                        >
                            <AccordionSummary
                                color={
                                    e.value < 0
                                        ? theme.palette.error.light
                                        : e.value > 5
                                        ? theme.palette.success.light
                                        : theme.palette.primary.light
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
                                        borderRadius: 2,
                                        width: "100%",
                                    }}
                                >
                                    <Box flexBasis="30%">
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {camelCaseToTitleCase(e.label)}
                                        </Typography>
                                    </Box>
                                    <LinearProgressWithLabel count={e.value} />
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    gutterBottom
                                >
                                    Summary
                                </Typography>
                                <Typography
                                    sx={{ display: "inline-block" }}
                                    variant="caption"
                                    color="text"
                                    lineHeight={1.2}
                                    fontWeight={500}
                                >
                                    {e.summary}
                                </Typography>
                                {/* <AppPrompt onClick={onSearch} />  */}
                            </AccordionDetails>
                        </Accordion>
                    )
                )}
        </>
    );
}

export default OverallScore;
