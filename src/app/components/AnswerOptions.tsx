// components/AnswerOptions.tsx
"use client";

interface AnswerOptionsProps {
  options: string[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  type?: "radio" | "checkbox";
}

export default function AnswerOptions({
  options,
  value,
  onChange,
  type = "radio",
}: AnswerOptionsProps) {
  const isChecked = (option: string) => {
    if (Array.isArray(value)) return value.includes(option);
    return value === option;
  };

  const handleSelect = (option: string) => {
    if (type === "checkbox") {
      const current = Array.isArray(value) ? value : [];
      if (current.includes(option)) {
        onChange(current.filter((v) => v !== option));
      } else {
        onChange([...current, option]);
      }
    } else {
      onChange(option);
    }
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => handleSelect(option)}
          className={`w-full text-left px-4 py-3 rounded-xl border transition
            ${
              isChecked(option)
                ? "border-blue-600 bg-blue-50 text-blue-900"
                : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
            }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
