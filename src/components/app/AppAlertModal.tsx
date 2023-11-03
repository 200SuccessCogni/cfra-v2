import * as React from "react";
import {
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
} from "@mui/material";
import { AppAlertModalType } from "../types/appAlertModal";

export default function AppAlertModal(props: AppAlertModalType) {
    return (
        <>
            <Dialog
                open={props.show}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm"
                fullWidth
            >
                <Box sx={{ px: 5, py: 3 }}>
                    <Typography variant="h4" fontWeight={600} align="center">
                        {props.title || "An Error Occoured!"}
                    </Typography>
                    <DialogContent>
                        <Typography
                            variant="h6"
                            fontWeight={500}
                            align="center"
                        >
                            {props?.message}
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center" }}>
                        <Button
                            variant="contained"
                            onClick={props.handleClose}
                            disableElevation
                        >
                            Ok
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
}
