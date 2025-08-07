import { useModel } from "@/hooks/useModel";
import Messages from "@/components/Messages";
import { Loader } from "@/components/Loader";
import { SendMessage } from "@/components/SendMessage";
import { useConversation } from "@/hooks/userConversation";
import "./App.css";

function App() {
  const { model, modelLoading } = useModel();

  const { messages, streamingMessage, loadingResponse, sendMessage } =
    useConversation(model);

  return (
    <div className="w-full h-full px-4 py-2 flex flex-col gap-2 text-base">
      <div className="flex-grow-1">
        <h1 className="text-2xl font-bold text-[#f60]">Merido</h1>
      </div>
      <div className="flex-grow-1 p-2 overflow-auto">
        <Messages messages={messages} streamingMessage={streamingMessage} />
      </div>
      <div className="sticky bottom-0 bg-white">
        {loadingResponse && <Loader />}
        <SendMessage
          sendMessage={sendMessage}
          disabled={modelLoading.progress !== 1 || loadingResponse}
        />
        <div className="text-sm text-gray-500">{modelLoading.text}</div>
        {modelLoading.progress !== 1 && <Loader />}
      </div>
    </div>
  );
}

export default App;
