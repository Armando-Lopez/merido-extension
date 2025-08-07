import React from "react";
import { MLCEngine } from "@mlc-ai/web-llm";
import { ChatCompletionMessageParam } from "@mlc-ai/web-llm";

export const useConversation = (model: MLCEngine | null) => {
  const [loadingResponse, setLoadingResponse] = React.useState(false);
  const [streamingMessage, setStreamingMessage] = React.useState<string>("");
  const [messages, setMessages] = React.useState<ChatCompletionMessageParam[]>(
    []
  );

  const sendMessage = async (message: string) => {
    try {
      if (!model || !message.trim()) return;

      setLoadingResponse(true);
      setMessages((prev) => [...prev, { role: "user", content: message }]);

      const replyChunks = await model.chat.completions.create({
        messages: [...messages, { role: "user", content: message }],
        stream: true,
      });

      let fullMessage = "";
      for await (const chunk of replyChunks) {
        fullMessage += chunk.choices[0]?.delta?.content || "";
        setStreamingMessage(fullMessage);
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fullMessage },
      ]);
      setStreamingMessage("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingResponse(false);
    }
  };

  return {
    messages,
    streamingMessage,
    loadingResponse,
    sendMessage,
  };
};
