// Simple test script to verify model loading
import { CreateMLCEngine } from "@mlc-ai/web-llm";

async function testModelLoading() {
  const modelOptions = [
    "Llama-2-7b-chat-q4f32_1",
    "Phi-3-mini-4k-instruct-q4f32_1",
  ];

  for (const modelName of modelOptions) {
    try {
      console.log(`Testing model: ${modelName}`);
      
      const model = await CreateMLCEngine(modelName, {
        initProgressCallback: (progress) => {
          console.log(`Progress: ${progress.text} (${progress.progress})`);
        },
      });

      console.log(`✅ Successfully loaded ${modelName}`);
      
      // Test a simple completion
      const response = await model.chat.completions.create({
        messages: [{ role: "user", content: "Hello, how are you?" }],
        stream: false,
        max_tokens: 50,
      });

      console.log(`✅ Test completion successful:`, response.choices[0]?.message?.content);
      
      return model; // Success, return the working model
      
    } catch (error) {
      console.error(`❌ Failed to load ${modelName}:`, error.message);
    }
  }
  
  throw new Error("No models could be loaded");
}

// Run the test
testModelLoading()
  .then(() => {
    console.log("✅ All tests passed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  });
