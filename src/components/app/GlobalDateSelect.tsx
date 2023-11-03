import React from "react";
import { Button, Typography, Box } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DateRangePicker } from "react-date-range";
import "../../App.css";
import dayjs from "dayjs";
import useApp from "../../store/app.context";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function setInitialDateRange() {
    const dateRange = {
        startDate: dayjs(new Date(new Date().getFullYear(), 0, 1)).format(
            "MMM D, YYYY"
        ),
        endDate: dayjs(new Date()).format("MMM D, YYYY"),
    };
    return `${dateRange.startDate} - ${dateRange.endDate}`;
}

function GlobalDateSelect() {
    const [selectedDate, setSelectedDate] = React.useState(
        setInitialDateRange()
    );
    const { setSelectedDateRange } = useApp();
    const [open, setOpen] = React.useState(false);
    const [state, setState] = React.useState([
        {
            startDate: dayjs(new Date(new Date().getFullYear(), 0, 1)).toDate(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const theme = useTheme();
    const isLargeDevice = useMediaQuery("(min-width:600px)");

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const onDateSelect = (selectedDateRange: any[]) => {
        if (Array.isArray(selectedDateRange) && selectedDateRange.length) {
            const startDate = dayjs(selectedDateRange[0].startDate).format(
                "MMM D, YYYY"
            );
            const endDate = dayjs(selectedDateRange[0].endDate).format(
                "MMM D, YYYY"
            );

            setSelectedDateRange({ startDate, endDate });
            setSelectedDate(`${startDate} - ${endDate}`);
        }
        setOpen(false);
    };

    return (
        <>
            <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                // sx={{ backgroundColor: "secondary.light", borderColor: "#eee" }}
            >
                <DateRangeRoundedIcon sx={{ color: "#aaa" }} />
                <Typography
                    variant="body2"
                    sx={{
                        px: { xs: 1, md: 2 },
                        display: { xs: "none", md: "block" },
                    }}
                >
                    {selectedDate ? selectedDate : "Chose date range..."}
                </Typography>
                <Box sx={{ display: { xs: "none", md: "inline-block" } }}>
                    <kbd>⌘ + d</kbd>
                </Box>
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={"lg"}
            >
                <DialogTitle id="alert-dialog-title">
                    Choose Date Range
                </DialogTitle>
                <DialogContent>
                    <DateRangePicker
                        className="global-date-range-selector"
                        onChange={(item: any) => setState([item.selection])}
                        // showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={state}
                        direction={isLargeDevice ? "horizontal" : "vertical"}
                        rangeColors={[theme.palette.primary.main]}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="black"
                        onClick={() => setOpen(false)}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="black"
                        variant="contained"
                        onClick={() => onDateSelect(state)}
                        autoFocus
                    >
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default GlobalDateSelect;
