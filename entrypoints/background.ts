import { MLCEngine } from "@mlc-ai/web-llm";
import { modelOptions } from "@/utils/models";
import { CreateMLCEngine } from "@mlc-ai/web-llm";
import type {
  MessageType,
  ModelLoading,
  ModelStatusResponse,
  SendMessageResponse,
} from "@/types/messages";

let selectedModel: string = "";
let model: MLCEngine | null = null;
let modelError: string | null = null;
let modelLoading: ModelLoading = { text: "", progress: 0 };

// List of models to try in order of preference


const loadModel = async () => {
  if (model) return; // Model already loaded

  for (const modelName of modelOptions) {
    try {
      modelError = null;
      selectedModel = modelName;
      modelLoading = { text: `Initializing ${modelName}...`, progress: 0 };

      model = await CreateMLCEngine(modelName, {
        initProgressCallback: (initProgress: ModelLoading) => {
          modelLoading = initProgress;
        },
      });

      // Ensure the model is fully loaded
      if (model) {
        modelLoading = { text: `${modelName} ready`, progress: 1 };
        return; // Success, exit the loop
      }
    } catch (err) {
      console.error(`Failed to load model ${modelName}:`, err);
      // Continue to next model
    }
  }

  // If we get here, all models failed
  modelError = "Failed to load any available model";
  modelLoading = { text: "Failed to load model", progress: 0 };
};

// Helper function to safely send messages to popup
const sendToPopup = (message: MessageType) => {
  try {
    chrome.runtime.sendMessage(message).catch(() => {
      // Ignore errors when popup is not open
    });
  } catch (error) {
    // Ignore errors when popup is not open
  }
};

const handleMessage = async (
  message: MessageType,
  sender: any,
  sendResponse: (response?: any) => void
) => {
  switch (message.type) {
    case "load-model":
      if (!model) {
        await loadModel();
      }
      const statusResponse: ModelStatusResponse = {
        model: !!model,
        modelLoading,
        error: modelError,
        selectedModel,
      };
      sendResponse(statusResponse);
      break;

    case "get-model-status":
      const status: ModelStatusResponse = {
        model: !!model,
        modelLoading,
        error: modelError,
        selectedModel,
      };
      sendResponse(status);
      break;

    case "send-message":
      if (!model) {
        const errorResponse: SendMessageResponse = {
          error: "Model not loaded",
        };
        sendResponse(errorResponse);
        return;
      }
      try {
        const replyChunks = await model.chat.completions.create({
          messages: message.messages,
          stream: true,
          // max_tokens: 1000,
          // temperature: 0.7,
        });

        let fullMessage = "";
        for await (const chunk of replyChunks) {
          if (chunk.choices && chunk.choices[0]?.delta?.content) {
            fullMessage += chunk.choices[0].delta.content;
            // Send streaming chunks to popup
            sendToPopup({
              type: "stream-chunk",
              chunk: chunk.choices[0].delta.content,
            } as MessageType);
          }
        }

        // Send completion signal
        sendToPopup({
          type: "stream-complete",
          fullMessage: fullMessage,
        } as MessageType);

        const successResponse: SendMessageResponse = {
          success: true,
          message: fullMessage,
        };
        sendResponse(successResponse);
      } catch (error) {
        console.error("Error in sendMessage:", error);
        const errorResponse: SendMessageResponse = {
          error:
            error instanceof Error ? error.message : "Failed to send message",
        };
        sendResponse(errorResponse);
      }
      break;
  }
};

export default defineBackground(() => {
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener(handleMessage);

  // Load model when background script starts (but don't send messages)
  loadModel();
});
