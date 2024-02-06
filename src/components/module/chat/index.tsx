import { useState, useEffect, useRef } from "react";
// import RecordRTC, {
//     RecordRTCPromisesHandler,
//     invokeSaveAsDialog,
// } from "recordrtc";
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
    const localURL = "ws://localhost:8002/ws/marriotchat";
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<any>(null);
    const chunks = useRef<Blob[]>([]);

    useEffect(() => {
        // const url = import.meta.env.VITE_WS_URL;
        const url = localURL;
        const ws = new WebSocket(url);

        ws.onopen = () => {
            ws.send("Connect");
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
        // return () => ws.close();

        // Cleanup function to stop media stream
        return () => {
            ws.close();
            if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state !== "inactive"
            ) {
                mediaRecorderRef.current.stop();
            }
        };
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

    const handleStartRecording = () => {
        setIsRecording(true);
    };
    const handleStopRecording = () => {
        setIsRecording(false);
    };

    /**
     * Functions for Voice to Text Conversion via Azure OpenAI Whisper
     */
    const startRecording = () => {
        console.log("Recording Started");
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                // setAudioChunks([]);
                chunks.current = [];
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        // setAudioChunks(prevAudioChunks => [...prevAudioChunks, event.data]);
                        chunks.current = [...chunks.current, event.data];
                    }
                };
                mediaRecorder.onstop = () => {
                    // const audioBlob = new Blob(audioChunks, { type: 'audio/wav; codecs=0'});
                    const audioBlob = new Blob(chunks.current, {
                        type: "audio/wav; codecs=0",
                    });
                    sendAudioFile(audioBlob);
                };
                mediaRecorder.start();
                setIsRecording(true);
            })
            .catch((error) =>
                console.error("Error accessing microphone:", error)
            );
    };

    const stopRecording = () => {
        console.log("Recording Stopped");
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== "inactive"
        ) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const sendAudioFile = (audioBlob: Blob) => {
        const formData = new FormData();
        formData.append("file", audioBlob);

        fetch(`http://localhost:8002/transcribe`, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                setMessages((prevMessages: MessageType[]) => [
                    ...prevMessages,
                    {
                        user: { fullName: "You", isSender: true },
                        message: data.transcriptionText,
                    },
                ]);
                if (websckt) websckt.send(data.transcriptionText);
            })
            .catch((error) => {
                console.error("Error sending audio file:", error);
            });
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
                                                    ? stopRecording
                                                    : startRecording
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
