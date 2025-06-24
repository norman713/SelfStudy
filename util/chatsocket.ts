export const connectChatSocket = (url: string, onMessage: (data: any) => void) => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
        console.log("WebSocket connected:", url);
    };

    socket.onmessage = (event) => {
        console.log("WebSocket raw event:", event.data);
        try {
            const message = JSON.parse(event.data);
            onMessage(message);
        } catch (err) {
            console.error("Failed to parse WebSocket message:", err);
        }
    };

    socket.onerror = (err) => {
        console.error("WebSocket error:", err);
    };

    socket.onclose = () => {
        console.warn("WebSocket closed. Consider reconnecting.");
    };

    return socket;
}