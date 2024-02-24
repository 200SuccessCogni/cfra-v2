import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import {
    Dialog,
    FormGroup,
    FormControlLabel,
    Checkbox,
    InputLabel,
    Box,
    OutlinedInput,
    InputAdornment,
    DialogActions,
    DialogContent,
    DialogTitle,
    Switch,
    IconButton,
    FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import _debounce from "lodash/debounce";
import { camelCaseToTitleCase } from "../../services/shared.service";

interface IRecModal {
    show: boolean;
    closeHandler: () => void;
    entities: any[];
    onSelect: (data: any[]) => void;
}

function InsightFilterModal(props: IRecModal) {
    const [list, setList] = useState(props.entities);
    const [filterTxt, setFilterTxt] = useState("");

    useEffect(() => {
        console.log({ bjfbj: props.entities });
        setList(props.entities);
    }, [props.entities]);

    const closeHandler = () => {
        props.onSelect(list);
        props.closeHandler();
    };

    const onCheckBoxClick = (i: number) => {
        const newList = [...list];
        newList[i].checked = !newList[i].checked;
        setList(newList);
    };

    const onToggle = () => {
        const newList = [...list];
        newList.map((e) => (e.checked = !e.checked));
        setList(newList);
    };

    const handleFilterChange = (value: string) => {
        setFilterTxt(value);
        const newList = [...props.entities].filter((e) =>
            e.label.toLowerCase().includes(value)
        );
        setList(newList);
    };

    const clearFilter = () => {
        setFilterTxt("");
        setList(props.entities);
    };

    return (
        <Dialog
            open={props.show}
            onClose={() => props.closeHandler}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={"sm"}
            fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                {"Choose your insight(s)"}
            </DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <FormControl
                        sx={{ m: 1, width: "25ch" }}
                        variant="outlined"
                    >
                        <InputLabel htmlFor="outlined-adornment-password">
                            Search
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type="text"
                            value={filterTxt}
                            onChange={(ev: any) =>
                                handleFilterChange(ev.target.value)
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    {filterTxt && (
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={clearFilter}
                                            edge="end"
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            }
                            label="Search insight entities..."
                        />
                    </FormControl>

                    <FormControlLabel
                        control={<Switch defaultChecked />}
                        onChange={onToggle}
                        label="Toggle all"
                    />
                </Box>
                <FormGroup>
                    {list.map((e: any, i: number) => (
                        <FormControlLabel
                            key={i}
                            control={
                                <Checkbox
                                    onChange={() => onCheckBoxClick(i)}
                                    defaultChecked
                                    checked={e?.checked}
                                />
                            }
                            label={camelCaseToTitleCase(e?.label)}
                        />
                    ))}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button color="black" variant="outlined" onClick={closeHandler}>
                    Close
                </Button>
                <Button
                    onClick={closeHandler}
                    color="black"
                    variant="contained"
                    autoFocus
                >
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default InsightFilterModal;
