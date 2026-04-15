import { createXai } from '@ai-sdk/xai';
import { streamText, convertToModelMessages, UIMessage } from 'ai';

// Create a configured xAI provider instance
const xaiProvider = createXai({
  apiKey: process.env.GROK_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // The client sends UIMessage[] (ai v6 format); we must convert to ModelMessage[]
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: xaiProvider('grok-4.20-non-reasoning'),
      messages: await convertToModelMessages(messages),
      system: "You are Grok, an AI created by xAI. You are helpful, intelligent, and sometimes humorous.",
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request", details: error.message || error.toString() }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
