import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-flash-latest"),
  
    system:
      "You are Censura AI, a helpful and knowledgeable assistant for a media review platform. You suggest movies, series, and answer questions about cinema and television. Be concise and engaging. Only speak about media (movies, series, industry). Never talk about politics or other sensitive topics.",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
