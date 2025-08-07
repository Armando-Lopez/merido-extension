import React from "react";
import type { ModelLoading, MessageType, ModelStatusResponse } from "@/types/messages";

export const useModel = () => {
  const [modelLoading, setModelLoading] = React.useState<ModelLoading>({
    text: "",
    progress: 0,
  });

  const [error, setError] = React.useState<string | null>(null);
  const [selectedModel, setSelectedModel] = React.useState<string>("");
  const [modelReady, setModelReady] = React.useState<boolean>(false);

  // Function to get model status from background
  const getModelStatus = async () => {
    try {
      const response = await chrome.runtime.sendMessage({ type: "get-model-status" }) as ModelStatusResponse;
      if (response) {
        setModelReady(response.model);
        setModelLoading(response.modelLoading);
        setError(response.error);
        setSelectedModel(response.selectedModel);
      }
    } catch (err) {
      console.error("Failed to get model status:", err);
      setError("Failed to communicate with background script");
    }
  };

  React.useEffect(() => {
    // Listen for messages from background script
    const handleMessage = (message: MessageType) => {
      switch (message.type) {
        case "model-loading":
          setModelLoading(message.loading);
          break;
        case "model-ready":
          setModelLoading({ text: "Model ready", progress: 1 });
          setModelReady(true);
          setError(null);
          break;
        case "model-error":
          setError(message.error);
          setModelLoading({ text: "Failed to load model", progress: 0 });
          setModelReady(false);
          break;
      }
    };

    // Add message listener
    chrome.runtime.onMessage.addListener(handleMessage);

    // Get initial model status from background
    getModelStatus();

    // Set up polling to check model status if it's still loading
    const pollInterval = setInterval(() => {
      if (!modelReady && modelLoading.progress < 1 && !error) {
        getModelStatus();
      }
    }, 1000); // Check every second

    // Cleanup
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
      clearInterval(pollInterval);
    };
  }, [modelReady, modelLoading.progress, error]);

  return { 
    model: modelReady ? "ready" : null, // Return a simple indicator instead of the actual model
    modelLoading, 
    error, 
    selectedModel 
  };
};
