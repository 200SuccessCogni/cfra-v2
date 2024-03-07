import { useState, useEffect } from "react";
import { MessageType } from "../types/chat";
import styles from "./chat.module.css";
import {
    IconButton,
    Typography,
    Box,
    OutlinedInput,
    FormControl,
    InputLabel,
    InputAdornment,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import { camelCaseToTitleCase } from "../../../services/shared.service";
import ChatMessage from "./ChatMessage";
import useChatScroll from "../../../hooks/useChatScroll";

const ChatContainer = styled("div")({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    // background:
    //     "url('https://www.toptal.com/designers/subtlepatterns/uploads/geometric-leaves.png')",
    // backgroundPosition: "center",
    // backgroundSize: "cover",
    // backgroundRepeat: "no-repeat",
});

const ChatHeader = styled("header")({
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "1rem 1rem",
    color: "#fff",
    height: "80px",
    background: "linear-gradient(-45deg, #736d6b, #9b9a9b, #949494, #212927)",
});

export default function ChatBot({
    closeHandler,
}: {
    closeHandler: () => void;
}) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<MessageType[]>([
        {
            user: { fullName: "Bot", isSender: false },
            message:
                "Hello there! 👋 Need help to get more insights? Reach out to us right here, and we'll get back to you as soon as we can! ",
        },
    ]);
    const [websckt, setWebsckt] = useState<WebSocket | null>(null);
    const ref = useChatScroll(messages);

    useEffect(() => {
        // const url = `ws://3.14.42.49/ws/customdata`
        const url = import.meta.env.VITE_WS_URL + `/ws/kohlerchat`;
        const ws = new WebSocket(url);

        ws.onopen = () => {
            ws.send("Connect");
        };

        ws.onmessage = (e) => {
            const message: any = JSON.parse(e.data);
            setMessages((prevMessages: MessageType[]) => [
                ...prevMessages,
                {
                    user: { fullName: "bot", isSender: false },
                    message: message.message,
                },
            ]);
        };

        setWebsckt(ws);

        // Cleanup
        return () => ws.close();
    }, []);

    const sendMessage = () => {
        if (!message) return;

        // Add the user message to the messages state
        setMessages((prevMessages: MessageType[]) => [
            ...prevMessages,
            { user: { fullName: "You", isSender: true }, message: message },
        ]);

        // Send the message to the backend
        if (websckt) websckt.send(message);

        // clear the input field.
        setMessage("");
    };

    return (
        <>
            <ChatContainer>
                <ChatHeader>
                    <Box>
                        <Typography
                            variant="body1"
                            fontWeight={600}
                            lineHeight={1.1}
                        >
                            Sentiment 360 Chatbot
                        </Typography>
                        <Typography variant="caption" fontWeight={400}>
                            Get more insights by typing your prompt query{" "}
                        </Typography>
                    </Box>
                    <IconButton onClick={closeHandler}>
                        <CloseIcon />
                    </IconButton>
                </ChatHeader>
                <Box className={styles["chat-container"]}>
                    <Box className={styles.chat} ref={ref}>
                        {!!messages.length &&
                            messages.map((value, index) => {
                                if (value.user.isSender) {
                                    return (
                                        <ChatMessage
                                            {...value}
                                            key={index}
                                            isSender={true}
                                        />
                                    );
                                } else {
                                    return (
                                        <ChatMessage
                                            {...value}
                                            key={index}
                                            isSender={false}
                                        />
                                    );
                                }
                            })}
                    </Box>
                    <Box className={styles["input-chat-container"]}>
                        <FormControl size="small" fullWidth>
                            <InputLabel htmlFor="outlined-adornment-prompt">
                                Your prompt
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-prompt"
                                size="small"
                                multiline
                                maxRows={3}
                                minRows={2}
                                value={message}
                                onChange={(e: any) =>
                                    setMessage(e.target.value)
                                }
                                sx={{
                                    fontSize: "14px",
                                }}
                                // onKeyDown={(e: any) => {
                                //     if (e.keyCode === 13 && !e.shiftKey) {
                                //         // keyCode 13 is for Enter key
                                //         e.preventDefault(); // Prevents the default action (like adding a new line)
                                //         sendMessage();
                                //     }
                                // }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={sendMessage}
                                            edge="end"
                                        >
                                            <SendRoundedIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label={"Type here..."}
                            />
                        </FormControl>
                    </Box>
                </Box>
            </ChatContainer>
        </>
    );
}
