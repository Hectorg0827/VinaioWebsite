import { T } from "@/lib/theme";

export default function Hr({ w = "48px", c = T.taupe, style = {} }) {
  return (
    <div
      style={{ width: w, height: "1px", background: c, flexShrink: 0, ...style }}
    />
  );
}
