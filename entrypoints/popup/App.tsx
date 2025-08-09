import React from "react";
import { useModel } from "@/hooks/useModel";
import Messages from "@/components/Messages";
import { Loader } from "@/components/Loader";
import { SendMessage } from "@/components/SendMessage";
import { useConversation } from "@/hooks/userConversation";
import "./App.css";

function App() {
  const { model, modelLoading, error: modelError } = useModel();
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  const {
    messages,
    streamingMessage,
    loadingResponse,
    sendMessage,
    error: conversationError,
  } = useConversation(model);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [streamingMessage, loadingResponse, messages]);

  const error = modelError || conversationError;

  const disabledSendMessage =
    modelLoading.progress !== 1 || loadingResponse || !!error;
  return (
    <div className="w-full h-full px-4 py-2 flex flex-col gap-2 text-base">
      <div className="flex items-center gap-2 z-20">
        <img
          src="/icon/merido-transparent-icon.png"
          alt="logo"
          className="size-11"
        />
        <h1 className="text-2xl font-bold text-[#f60] -ml-4">erido</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div ref={messagesContainerRef} className="flex-grow-1 p-2 overflow-auto">
        <Messages messages={messages} streamingMessage={streamingMessage} />
      </div>
      <div className="sticky bottom-0 bg-white">
        {loadingResponse && <Loader />}
        <SendMessage sendMessage={sendMessage} disabled={disabledSendMessage} />
        <div className="text-sm text-gray-500">{modelLoading.text}</div>
        {modelLoading.progress !== 1 && <Loader />}
      </div>
    </div>
  );
}

export default App;
