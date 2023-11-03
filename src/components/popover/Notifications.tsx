import React from "react";
import Popover from "@mui/material/Popover";
import { Typography, Box } from "@mui/material";
import { INotification } from "../../interfaces/app.interface";

function NotificationsPopover(props: INotification) {
    const id = props.open ? "simple-popover" : undefined;
    return (
        <Popover
            id={id}
            open={props.open}
            anchorEl={props.anchorEl}
            onClose={props.handleClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
        >
            <Box sx={{ p: 2, maxWidth: "350px" }}>
                <Box mb={1}>
                    <Typography variant="body2" fontWeight={500}>
                        Title 1
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ display: "inline-block", lineHeight: "1.1" }}
                    >
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Enim optio neque sequi.
                    </Typography>
                </Box>
                <Box mb={1}>
                    <Typography variant="body2" fontWeight={500}>
                        Title 2
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ display: "inline-block", lineHeight: "1.1" }}
                    >
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Enim optio neque sequi.
                    </Typography>
                </Box>
                <Box mb={1}>
                    <Typography variant="body2" fontWeight={500}>
                        Title 3
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ display: "inline-block", lineHeight: "1.1" }}
                    >
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Enim optio neque sequi.
                    </Typography>
                </Box>
            </Box>
        </Popover>
    );
}

export default NotificationsPopover;
