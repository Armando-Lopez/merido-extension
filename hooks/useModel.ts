import React from "react";
import { CreateMLCEngine } from "@mlc-ai/web-llm";

type ModelLoading = {
  text: string;
  progress: number;
};

export const useModel = () => {
  const selectedModel = "Llama-3.2-1B-Instruct-q4f32_1-MLC";

  const model = React.useRef<Awaited<
    ReturnType<typeof CreateMLCEngine>
  > | null>(null);

  const [modelLoading, setModelLoading] = React.useState<ModelLoading>({
    text: "",
    progress: 0,
  });

  React.useEffect(() => {
    if (model.current) return;

    const loadEngine = async () => {
      model.current = await CreateMLCEngine(selectedModel, {
        initProgressCallback: (initProgress: ModelLoading) => {
          setModelLoading(initProgress);
        },
      });
    };
    loadEngine();
  }, []);

  return { model: model.current, modelLoading };
};
