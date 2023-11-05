import { Typography, Box, Avatar } from "@mui/material";
import styles from "./chat.module.css";
import { camelCaseToTitleCase } from "../../../services/shared.service";
import { MessageType } from "../types/chat";

interface IChatMessage extends MessageType {
    others?: any;
    isSender: boolean
}

export default function ChatMessage(props: IChatMessage) {
    const { user, message, others, isSender } = props;

    return (
        <Box className={styles[isSender ? "my-message-container" : "another-message-container"]} {...others}>
            <Box>
                <Typography variant="caption" align="right" fontWeight={400}>
                    {camelCaseToTitleCase(user?.fullName)}
                </Typography>
                <Box className={styles[isSender ? "my-message" : "another-message"]}>
                    <Typography
                        variant="body2"
                        fontWeight={500}
                        className={styles.message}
                    >
                        {message}
                    </Typography>
                </Box>
            </Box>

            <Avatar
                sx={{
                    width: 30,
                    height: 30,
                    ml: isSender ? 0.5 : 0,
                    mr: !isSender ? 0.5 : 0,
                    mt: "1.2rem",
                }}
            >
                {camelCaseToTitleCase(user.fullName.charAt(0))}
            </Avatar>
        </Box>
    );
}
