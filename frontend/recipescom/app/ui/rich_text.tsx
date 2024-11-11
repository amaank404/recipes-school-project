import Markdown from "react-markdown";
import styles from "./rich_text.module.css";

export default function RichText({
  children,
  classList,
  variableSize,
}: {
  children: string;
  classList?: string;
  variableSize?: boolean;
}) {
  return (
    <div className={classList}>
      <Markdown
        className={`${styles.richText} ${variableSize ? styles.varSize : ""}`}
      >
        {children}
      </Markdown>
    </div>
  );
}
