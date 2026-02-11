import { UIMessage } from "ai";

export const initialMessages = (answers: any): UIMessage => {
  const userMessage: UIMessage = {
    id: "user-answers",
    role: "user",
    parts: [
      {
        type: "text",
        text: `
User onboarding answers:
${JSON.stringify(answers, null, 2)}

Start with:
"Based on your answers, you appear to be..."
  `,
      },
    ],
  };
  return userMessage;
};
