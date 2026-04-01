"use client";

import { useState } from "react";

type FormattedTextProps = {
  text: string;
  maxWords?: number;
};

function truncate(text: string, maxWords: number) {
  const lines = text.split("\n").slice(0, 2);
  let words = 0;
  const result: string[] = [];

  for (const line of lines) {
    const lineWords = line.split(/\s+/).filter(Boolean);
    const remaining = maxWords - words;

    if (lineWords.length <= remaining) {
      result.push(line);
      words += lineWords.length;
    } else {
      result.push(lineWords.slice(0, remaining).join(" "));
      return { text: result.join("\n"), truncated: true };
    }
  }

  const hasMoreLines = text.split("\n").length > 2;
  return { text: result.join("\n"), truncated: hasMoreLines };
}

export default function FormattedText({
  text,
  maxWords = 20,
}: FormattedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { text: truncatedText, truncated } = truncate(text, maxWords);
  const displayText = isExpanded ? text : truncatedText;

  return (
    <div>
      {displayText
        .split("\n")
        .map((line, i) =>
          line === "" ? <br key={i} /> : <p key={i}>{line}</p>,
        )}
      {truncated && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 text-sm font-semibold hover:underline"
        >
          {isExpanded ? "اظهار أقل" : "اظهار المزيد..."}
        </button>
      )}
    </div>
  );
}
