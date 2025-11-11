import { useEffect, useState, useRef } from "react";
import { Send, MessageCircle } from "lucide-react";
import socket from "../socket";
import "./ChatBox.css";

export default function ChatBox({ roomId, username, darkMode = false }) {
    const [message, setMessage] = useState("");
    const [chatLog, setChatLog] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // Socket connection status
        setIsConnected(socket.connected);

        socket.on("connect", () => {
            setIsConnected(true);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        socket.on("receive-message", (data) => {
            setChatLog((prev) => [...prev, data]);
        });

        return () => {
            socket.off("receive-message");
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatLog]);

    const sendMessage = (e) => {
        e?.preventDefault();
        if (!message.trim() || !isConnected) return;

        const payload = {
            roomId,
            message: message.trim(),
            sender: username || "Anonymous",
        };

        socket.emit("chat-message", payload);

        // Add to local chat log with timestamp
        setChatLog((prev) => [
            ...prev,
            {
                ...payload,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                isOwn: true,
            },
        ]);

        setMessage("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className={`chat-box ${darkMode ? "dark" : "light"}`}>
            {/* Connection Status */}
            <div
                className={`connection-status ${
                    isConnected ? "connected" : "disconnected"
                }`}
            >
                <div className="status-indicator"></div>
                <span className="status-text">
                    {isConnected ? "Connected" : "Connecting..."}
                </span>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
                {chatLog.length === 0 ? (
                    <div className="empty-chat">
                        <MessageCircle size={32} className="empty-icon" />
                        <p>No messages yet</p>
                        <span>Start the conversation!</span>
                    </div>
                ) : (
                    chatLog.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.isOwn ? "own" : "other"}`}
                        >
                            <div className="message-header">
                                <span className="sender">{msg.sender}</span>
                                <span className="timestamp">
                                    {msg.time || formatTime(msg.timestamp)}
                                </span>
                            </div>
                            <div className="message-content">{msg.message}</div>
                        </div>
                    ))
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Message Input */}
            <form className="chat-input-form" onSubmit={sendMessage}>
                <div className="input-container">
                    <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={
                            isConnected ? "Type a message..." : "Connecting..."
                        }
                        className="message-input"
                        disabled={!isConnected}
                        maxLength={500}
                    />
                    <button
                        type="submit"
                        disabled={!message.trim() || !isConnected}
                        className="send-button"
                        title="Send message"
                    >
                        <Send size={18} />
                    </button>
                </div>

                <div className="input-footer">
                    <span className="char-count">{message.length}/500</span>
                    <span className="hint">Press Enter to send</span>
                </div>
            </form>
        </div>
    );
}
