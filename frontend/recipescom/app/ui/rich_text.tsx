import Markdown from "react-markdown";
import styles from "./rich_text.module.css";

export default function RichText({
  children,
  classList,
  variableSize,
  fontSize,
}: {
  children: string;
  classList?: string;
  variableSize?: boolean;
  fontSize?: number;
}) {
  return (
    <div
      className={classList + ` ${styles.richText}`}
      style={{ fontSize: fontSize }}
    >
      <Markdown className={`${variableSize ? styles.varSize : ""}`}>
        {children}
      </Markdown>
    </div>
  );
}
