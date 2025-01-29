"use client";

import React, { useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage: ChatMessage = { role: "user", content: input };

    try {
      const apiUrl = "https://api.openai.com/v1/chat/completions";
      // Use REACT_APP_ prefix for Create React App
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      console.log(apiKey);

      console.log("API Key:", apiKey); // For debugging
      if (!apiKey) {
        throw new Error("OpenAI API key is not configured");
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.choices[0].message.content,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      let errorMessage = "Failed to send message. Please try again.";

      if (error instanceof Error && error.message.includes("429")) {
        errorMessage =
          "Rate limit exceeded. Please wait 60 seconds before trying again.";
      } else if (error.message === "OpenAI API key is not configured") {
        errorMessage =
          "API key is not configured. Please check your environment variables.";
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 border rounded-lg shadow-lg">
      <div className="space-y-4">
        <div className="h-[400px] overflow-y-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-100"
              } max-w-[80%]`}
            >
              {message.content}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
