import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownView = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {children.replaceAll("\\`\\`\\`", "```") ?? ""}
    </ReactMarkdown>
  );
};

export default MarkdownView;
