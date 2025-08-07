import React from "react";
import type { MessageType } from "@/types/messages";
import { ChatCompletionMessageParam } from "@mlc-ai/web-llm";

export const useConversation = (model: any) => {
  const [loadingResponse, setLoadingResponse] = React.useState(false);
  const [streamingMessage, setStreamingMessage] = React.useState<string>("");
  const [messages, setMessages] = React.useState<ChatCompletionMessageParam[]>(
    []
  );
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Listen for streaming messages from background script
    const handleMessage = (message: MessageType) => {
      switch (message.type) {
        case "stream-chunk":
          setStreamingMessage((prev) => prev + message.chunk);
          break;
        case "stream-complete":
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: message.fullMessage },
          ]);
          setLoadingResponse(false);
          setStreamingMessage("");
          break;
      }
    };

    // Add message listener
    chrome.runtime.onMessage.addListener(handleMessage);

    // Cleanup
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const sendMessage = async (message: string) => {
    try {
      if (!model || !message.trim()) return;

      setError(null);
      setLoadingResponse(true);
      setStreamingMessage("");

      const userMessage: ChatCompletionMessageParam = {
        role: "user",
        content: message,
      };
      setMessages((prev) => [...prev, userMessage]);

      // Ensure messages are properly formatted
      const currentMessages: ChatCompletionMessageParam[] = [
        ...messages,
        userMessage,
      ];

      // Send message to background script
      chrome.runtime.sendMessage({
        type: "send-message",
        messages: currentMessages,
      });

      // The streaming response will be handled by the message listener above
      // We don't need to manually add the assistant message here since it's handled by streaming
    } catch (error) {
      console.error("Error in sendMessage:", error);
      setError(
        error instanceof Error ? error.message : "Failed to send message"
      );
      setLoadingResponse(false);
      setStreamingMessage("");

      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  return {
    error,
    messages,
    loadingResponse,
    streamingMessage,
    sendMessage,
  };
};
