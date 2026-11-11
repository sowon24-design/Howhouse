export function PolicyBody({ paragraphs }: { paragraphs: readonly string[] }) {
  return paragraphs.flatMap((block, section) => block.split('\n').map((line, row) =>
    line.startsWith('## ') ? <h3 key={`${section}-${row}`}>{line.slice(3)}</h3>
      : <p key={`${section}-${row}`}>{line.replace(/^- /, '• ').split(/(https:\/\/[^\s)]+[^\s).,;])/g).map((part, index) => part.startsWith('https://')
        ? <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a> : part)}</p>
  ))
}
