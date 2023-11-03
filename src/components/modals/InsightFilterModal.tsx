import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import {
    Dialog,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Box,
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { camelCaseToTitleCase } from "../../services/shared.service";

interface IRecModal {
    show: boolean;
    closeHandler: () => void;
    entities: any[];
    onSelect: (data: any[]) => void;
}

function InsightFilterModal(props: IRecModal) {
    const [list, setList] = useState(props.entities);

    useEffect(() => {
        setList(props.entities);

        console.log({ props, list });
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

    return (
        <div>
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
                            justifyContent: "flex-end",
                            width: "100%",
                        }}
                    >
                        <Button onClick={onToggle} color="black">
                            Toggle all
                        </Button>
                    </Box>
                    <FormGroup>
                        {list.map((e: any, i: number) => (
                            <FormControlLabel
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
                    <Button
                        color="black"
                        variant="outlined"
                        onClick={closeHandler}
                    >
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
        </div>
    );
}

export default InsightFilterModal;
