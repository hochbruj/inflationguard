import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";

export const runtime = "edge"; // important for streaming

function createMockStreamResponse(text: string, delay = 0) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const chunks = text.match(/.{1,10}/g) || [text];
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}

export async function POST(req: Request) {
  const { answers, messages } = await req.json();
  console.log("Received answers for reflection:", answers);

  const system = `
You are a calm, conservative financial advisor.

Your task:
Reflect the user's investment profile based ONLY on their answers.
Do not give advice.
Do not suggest allocations.
Do not predict returns.

Tone:
Neutral, precise, respectful.
One short paragraph.
No hype. No jargon.
  `;

  // Stream AI text back
  const result = streamText({
    model: openai("gpt-4.1-mini"),
    system,
    messages: convertToModelMessages(messages),
    temperature: 0.3,
  });
  console.log("Reflection result stream initialized.");
  return result.toUIMessageStreamResponse();
  // return createMockStreamResponse(
  //   "Based on your answers, you have a medium time horizon with a balanced liquidity need and moderate capital criticality. Your primary motivation appears to be growth, and you exhibit a medium tolerance for volatility. Overall, your profile suggests a balanced investment approach that considers both growth potential and risk management."
  // );
}
