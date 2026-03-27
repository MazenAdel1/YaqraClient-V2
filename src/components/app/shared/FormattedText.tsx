export default function FormattedText({ text }: { text: string }) {
  return text
    .split("\n")
    .map((line, index) =>
      line === "" ? <br key={index} /> : <p key={index}>{line}</p>,
    );
}
