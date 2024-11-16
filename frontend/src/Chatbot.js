import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css"; // Import the CSS file

function Chatbot() {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSend = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setError("");

        try {
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "user", text: query }
            ]);

            const result = await axios.post("http://localhost:5000/api/chatbot/message", {
                message: query,
            });
        
            let responseText = result.data.response;
        
            const responseSegments = responseText.split('\n');
        
            const newMessages = responseSegments.map(segment => ({
                sender: "bot",
                text: segment.trim()
            }));
        
            setMessages((prevMessages) => [
                ...prevMessages,
                ...newMessages,
            ]);
            setQuery("");
        } catch (error) {
            console.error("Error fetching chatbot response:", error);
            setError("Error connecting to the chatbot. Please try again later.");
        } finally {
            setLoading(false);
        }
   
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-box">
                <div className="chatbot-header">Real Estate Chatbot</div>
                <div className="chat-window">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message-bubble ${
                                message.sender === "user" ? "user-bubble" : "bot-bubble"
                            }`}
                        >
                            {message.text}
                        </div>
                    ))}
                </div>
                {error && <div className="error">{error}</div>}
                <div className="input-container">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Unlock Doors with Our Chatbot!..."
                        className="input"
                        disabled={loading}
                    ></textarea>
                    <button onClick={handleSend} className="send-button" disabled={loading}>
                        {loading ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;
