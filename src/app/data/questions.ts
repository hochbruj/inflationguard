// data/questions.ts

export const block1Questions = [
  {
    id: "q1.1",
    question:
      "When would you realistically expect to use a meaningful part of this capital?",
    options: [
      "Within 3 years",
      "3–7 years",
      "7–15 years",
      "15+ years",
      "I don't know yet",
    ],
  },
  {
    id: "q1.2",
    question:
      "If this portfolio temporarily lost value, would you need to access it?",
    options: ["Yes, likely", "Possibly", "Unlikely", "No"],
  },
  {
    id: "q1.3",
    question: "Is this capital emotionally 'safe' to invest long-term?",
    options: ["Yes", "Mostly", "No"],
    helper:
      "Emotionally safe means losses would not affect your sleep or life decisions.",
  },
{
  id: "q1.5",
  question: "If this portfolio lost 50% of its value permanently, what would happen?",
  options: [
    "I could absorb this loss without lifestyle changes",
    "It would hurt, but I'd be okay long-term",
    "It would seriously impact my financial security",
    "It would be financially devastating",
  ]
},
  {
    id: "q1.6",
    question:
      "If this portfolio lost value temporarily, how easily could you rebuild it through income or savings?",
    options: ["Easily", "With effort", "With difficulty", "Not realistically"],
  },
];

export const block2Questions = [
  {
    id: "q2.1",
    question:
      "Imagine this portfolio loses 30% over 12 months. What best describes your reaction?",
    options: [
      "I would be concerned but stay invested",
      "I would reduce exposure",
      "I would exit and reassess",
      "I'm not sure",
    ],
  },
  {
    id: "q2.2",
    question:
      "Have you personally held volatile assets through a major drawdown?",
    options: ["Yes, and I held", "Yes, but I sold", "No", "Not sure"],
  },
  {
    id: "q2.3",
    question: "Which feels more uncomfortable to you?",
    options: ["Temporary losses", "Missing long-term upside", "Both equally"],
  },
];

export const block3Questions = [
  {
    id: "q3.1",
    question: "How familiar are you with Bitcoin and Ethereum?",
    options: [
      "I actively use and understand them",
      "I understand the basics",
      "I have limited understanding",
      "I do not understand them",
    ],
  },
  {
    id: "q3.2",
    question: "Which best describes your view of Gold and Silver?",
    options: [
      "Monetary protection against currency debasement",
      "Portfolio diversification",
      "Speculative assets",
      "I haven't formed a view yet",
    ],
  },
  {
    id: "q3.3",
    question: "Which statement feels closer to your view?",
    options: [
      "Simplicity is more important than optimization",
      "Optimization is worth added complexity",
    ],
  },
];

export const block4Questions = [
  {
    id: "q4.2",
    question: "What is your primary goal for this portfolio?",
    options: [
      "Maximize long-term growth",
      "Preserve purchasing power",
      "Balance growth and preservation",
    ],
  },
];

export const ALL_QUESTIONS = [
  ...block1Questions,
  ...block2Questions,
  ...block3Questions,
  ...block4Questions,
];

export type QuestionBlock = (typeof ALL_QUESTIONS)[number];
