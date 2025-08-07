import ReactMarkdown from "react-markdown";
import { ChatCompletionMessageParam } from "@mlc-ai/web-llm";

const Messages = ({
  messages,
  streamingMessage,
}: {
  messages: ChatCompletionMessageParam[];
  streamingMessage?: string;
}) => {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto py-4">
      {messages.map((message, index) => {
        if (message.role === "user") {
          return (
            <div
              key={index}
              className="ml-auto max-w-3/4 bg-[#f60]/70 p-2 rounded-2xl shadow-lg shadow-[#f60]/30 rounded-tr-none"
            >
              <ReactMarkdown disallowedElements={["script"]}>
                {message?.content as string}
              </ReactMarkdown>
            </div>
          );
        }
        return (
          <div
            key={index}
            className="mr-auto max-w-3/4 bg-[#f60]/30 p-2 rounded-2xl rounded-tl-none inset-shadow-sm inset-shadow-[#f60]/30"
          >
            <ReactMarkdown disallowedElements={["script"]}>
              {message?.content as string}
            </ReactMarkdown>
          </div>
        );
      })}
      {streamingMessage && (
        <div className="mr-auto max-w-3/4 bg-[#f60]/10 p-2 rounded-2xl rounded-tl-none inset-shadow-sm inset-shadow-[#f60]/30">
          <ReactMarkdown disallowedElements={["script"]}>
            {streamingMessage}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Messages;
