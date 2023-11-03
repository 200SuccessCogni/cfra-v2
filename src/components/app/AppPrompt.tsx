import { useState } from "react";
import {
    Typography,
    OutlinedInput,
    FormControl,
    InputLabel,
    IconButton,
    InputAdornment,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { AppPromptType } from "../types/appPrompt";

function AppPrompt(props: AppPromptType) {
    const [query, setQuery] = useState("");

    const onSearch = (ev: any) => {
        props.onClick(ev.target.value);
        setQuery(ev.target.value);
    };

    return (
        <FormControl
            size="small"
            fullWidth
            sx={{
                m: 1,
                position: "sticky",
                bottom: "1rem",
                backgroundColor: "primary.light",
            }}
        >
            <InputLabel htmlFor="outlined-adornment-prompt">
                {props.label || "Send a prompt"}
            </InputLabel>
            <OutlinedInput
                id="outlined-adornment-prompt"
                size="small"
                value={query}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={onSearch}
                            //   onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            <SendRoundedIcon />
                        </IconButton>
                    </InputAdornment>
                }
                label={props.label || "Live prompt"}
            />
        </FormControl>
    );
}

export default AppPrompt;
