// app/components/Header.tsx
"use client";

interface HeaderProps {
  step: number;
  totalSteps: number;
}

export default function Header({ step, totalSteps }: HeaderProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Onboarding</h1>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-600 mt-1">
        Step {step} of {totalSteps}
      </p>
    </div>
  );
}
