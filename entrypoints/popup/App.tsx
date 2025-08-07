import React from "react";
import { useModel } from "@/hooks/useModel";
import Messages from "@/components/Messages";
import { Loader } from "@/components/Loader";
import { SendMessage } from "@/components/SendMessage";
import { useConversation } from "@/hooks/userConversation";
import "./App.css";

function App() {
  const { model, modelLoading, error: modelError } = useModel();

  const { messages, streamingMessage, loadingResponse, sendMessage, error: conversationError } =
    useConversation(model);
 
  const error = modelError || conversationError;

  const disabledSendMessage = modelLoading.progress !== 1 || loadingResponse || !!error
  return (
    <div className="w-full h-full px-4 py-2 flex flex-col gap-2 text-base">
      <div className="flex-grow-1 flex items-center gap-2">
        <img src="/icon/merido-transparent-icon.png" alt="logo" className="size-11" />
        <h1 className="text-2xl font-bold text-[#f60] -ml-3.5">erido</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="flex-grow-1 p-2 overflow-auto">
        <Messages messages={messages} streamingMessage={streamingMessage} />
      </div>
      <div className="sticky bottom-0 bg-white">
        {loadingResponse && <Loader />}
        <SendMessage
          sendMessage={sendMessage}
          disabled={disabledSendMessage}
        />
        <div className="text-sm text-gray-500">{modelLoading.text}</div>
        {modelLoading.progress !== 1 && <Loader />}
      </div>
    </div>
  );
}

export default App;
