import { useState, useEffect } from "react";
import RecordRTC, {
    RecordRTCPromisesHandler,
    invokeSaveAsDialog,
} from "recordrtc";
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
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
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

const initMessage = {
    user: { fullName: "Bot", isSender: false },
    message:
        "Hello there! 👋 Need help to get more insights? Reach out to us right here, and we'll get back to you as soon as we can! ",
};

export default function ChatBot({
    closeHandler,
}: {
    closeHandler: () => void;
}) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<MessageType[]>([initMessage]);
    const [websckt, setWebsckt] = useState<WebSocket | null>(null);
    const ref = useChatScroll(messages);
    const localURL = "ws://localhost:8002/ws/voicechat";

    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState<any>(null);

    useEffect(() => {
        // const url = import.meta.env.VITE_WS_URL;
        const url = localURL;
        const ws = new WebSocket(url);

        ws.onopen = () => {
            // ws.send("Connect");{ text: "Connect", audio: "" }
            ws.send(JSON.stringify({ text: "Connect", audio: "" }));
        };

        ws.onmessage = (e) => {
            const message: any = JSON.parse(e.data);
            if (message.transribed_user_voice) {
                setMessages((prevMessages: MessageType[]) => [
                    ...prevMessages,
                    {
                        user: { fullName: "You", isSender: true },
                        message: message.transribed_user_voice,
                    },
                ]);

                // Converting text to speech
                // if ("speechSynthesis" in window) {
                //   let msg = new SpeechSynthesisUtterance(message.message);
                //   speechSynthesis.speak(msg);
                // }
            }
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
        if (websckt) websckt.send(JSON.stringify({ text: message, audio: "" }));

        // clear the input field.
        setMessage("");
    };

    useEffect(() => {
        let stream: any;
        async function startRecording() {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("PERMISSION GIVEN"); // Creating instance of RecordRTC
            const newRecorder = new RecordRTCPromisesHandler(stream, {
                type: "audio",
            });
            setRecorder(newRecorder); // Starting Recoding by calling startRecording function
            newRecorder.startRecording();
            console.log("RECORDING STARTED");
        }
        async function stopRecording() {
            console.log("RECORDING STOPPED", recorder); // Stopping the recording by calling the stopRecording function
            await recorder?.stopRecording();
            console.log("CHECKING BLOB", recorder);
            const base64: any = await recorder?.getDataURL();
            const base64txt: any = base64
                .toString()
                .replace("data:audio/webm;codecs=opus;base64,", "");
            console.log(base64txt);
            if (websckt)
                websckt.send(JSON.stringify({ text: "", audio: base64txt }));
            // stream.getAudioTracks().forEach((track) => track.stop());
        }
        if (isRecording) {
            startRecording();
        } else {
            if (recorder !== null) {
                stopRecording();
            }
        }
        return () => {
            if (stream !== undefined) {
                stream.getAudioTracks().forEach((track: any) => track.stop());
            }
        };
    }, [isRecording]);

    const handleStartRecording = () => {
        setIsRecording(true);
    };
    const handleStopRecording = () => {
        setIsRecording(false);
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

                                        <IconButton
                                            onClick={
                                                isRecording
                                                    ? handleStopRecording
                                                    : handleStartRecording
                                            }
                                            edge="end"
                                            sx={{ ml: 2 }}
                                        >
                                            {isRecording ? (
                                                <StopIcon />
                                            ) : (
                                                <MicIcon />
                                            )}
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
