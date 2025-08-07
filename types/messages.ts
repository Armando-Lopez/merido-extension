export type ModelLoading = {
  text: string;
  progress: number;
};

export type MessageType = 
  | { type: "load-model" }
  | { type: "get-model-status" }
  | { type: "send-message"; messages: any[] }
  | { type: "model-ready" }
  | { type: "model-error"; error: string }
  | { type: "model-loading"; loading: ModelLoading }
  | { type: "stream-chunk"; chunk: string }
  | { type: "stream-complete"; fullMessage: string };

export type ModelStatusResponse = {
  model: boolean;
  modelLoading: ModelLoading;
  error: string | null;
  selectedModel: string;
};

export type SendMessageResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};
