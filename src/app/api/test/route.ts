import { block1Questions } from "@/onboarding/step1/page";

export const runtime = "edge"; // important for streaming

export async function POST(req: Request) {
  const { answers } = await req.json();
  console.log("Received answers for reflection:", answers);

  console.log("Received answers for reflection:", block1Questions);

  return new Response("Test response");
}
