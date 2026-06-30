import { GoogleGenerativeAI } from "@google/generative-ai";

export class GoogleAdapter {
  private getAIInstance(): GoogleGenerativeAI | null {
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (apiKey) {
      return new GoogleGenerativeAI(apiKey);
    }
    return null;
  }

  public async generateText(prompt: string, modelName: string = "gemini-2.5-flash"): Promise<string> {
    const ai = this.getAIInstance();
    if (!ai) {
      // Return a simulated response if no key is present
      return `[SIMULATED RESPONSE for prompt: "${prompt.substring(0, 40)}..."]\nRunning in local mock mode. Add GEMINI_API_KEY to your environment variables to enable live Google Gemini calls.`;
    }

    try {
      const model = ai.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error("Gemini Generation Error:", error);
      return `Error generating response: ${error.message || error}`;
    }
  }

  public async generateTextWithImage(
    prompt: string,
    imageBuffer: Buffer,
    mimeType: string,
    modelName: string = "gemini-2.5-flash"
  ): Promise<string> {
    const ai = this.getAIInstance();
    if (!ai) {
      // Return simulated multimodal response if API key is not present
      return `[SIMULATED MULTIMODAL RESPONSE]
Running in local mock mode. Image size: ${imageBuffer.length} bytes, Mime: ${mimeType}. Add GEMINI_API_KEY to your environment variables to enable live Google Gemini calls.`;
    }

    try {
      const model = ai.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType
          }
        }
      ]);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error("Gemini Multimodal Generation Error:", error);
      throw error;
    }
  }
}

export const googleAdapter = new GoogleAdapter();

