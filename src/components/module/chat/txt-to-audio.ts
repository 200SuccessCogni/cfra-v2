/**
 * Convert text to audio using Elevenlabs
 * @param textToConvert
 * @returns
 */
const convertTextToAudio = async (
    textToConvert: string
): Promise<ArrayBuffer> => {
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`) as any;
        if (parts.length === 2) return parts.pop().split(";").shift();
    };

    // Check if the feature flag for making API calls is enabled
    const voicefeatureFlag = getCookie("voice-feature-flag");
    if (voicefeatureFlag !== "true") {
        console.log("Feature flag for text-to-speech conversion is disabled.");
        return new ArrayBuffer(0);
    }

    // Attempt to get the API key from a cookie
    let apiKey = getCookie("voice-api-key");

    // Fallback to the hardcoded API key if the cookie isn't set
    if (!apiKey) {
        console.warn("API key cookie not found, using the hardcoded API key.");
        apiKey = "7e89ab832dca4aa68b4516a6d46a6970"; // Your hardcoded API key
    }

    const voiceId = "KyTNWqFEzEJ6EzmveIVW"; // Example voice ID

    if (!apiKey) {
        console.error("API key is not defined.");
        return new ArrayBuffer(0);
    }

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const headers = {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
    };
    const body = JSON.stringify({
        text: textToConvert,
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: body,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.arrayBuffer();
    } catch (error) {
        console.error("Error calling ElevenLabs API:", error);
        return new ArrayBuffer(0);
    }
};

export default convertTextToAudio;
