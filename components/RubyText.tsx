import { Fragment, type ElementType } from "react";

const token = /([一-龯々ヶ]+)\(([^)]+)\)/g;

export function RubyText({ text, as: Tag = "span", className }: { text: string; as?: ElementType; className?: string }) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(token)) {
    const index = match.index ?? 0;
    if (index > cursor) parts.push(text.slice(cursor, index));
    parts.push(<ruby key={`${index}-${match[1]}`}>{match[1]}<rt>{match[2]}</rt></ruby>);
    cursor = index + match[0].length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <Tag className={className}>{parts.map((part, index) => <Fragment key={index}>{part}</Fragment>)}</Tag>;
}
