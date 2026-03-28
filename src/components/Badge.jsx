import { T, ff } from "@/lib/theme";

const MAP = {
  open:        { bg: T.blueLight,   color: T.blue,   label: "Open" },
  overdue:     { bg: T.redLight,    color: T.red,    label: "Overdue" },
  paid:        { bg: T.greenLight,  color: T.green,  label: "Paid" },
  processing:  { bg: T.orangeLight, color: T.orange, label: "Processing" },
  shipped:     { bg: T.blueLight,   color: T.blue,   label: "Shipped" },
  delivered:   { bg: T.greenLight,  color: T.green,  label: "Delivered" },
  active:      { bg: T.greenLight,  color: T.green,  label: "Active" },
  expiring:    { bg: T.orangeLight, color: T.orange, label: "Expiring Soon" },
  expired:     { bg: T.redLight,    color: T.red,    label: "Expired" },
  outofstock:  { bg: T.cream,       color: T.muted,  label: "Out of Stock" },
};

export default function Badge({ status }) {
  const s = MAP[status] ?? MAP.open;
  return (
    <span
      style={{
        fontFamily: ff.b,
        fontSize: "9px",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        fontWeight: 600,
        color: s.color,
        background: s.bg,
        padding: "4px 10px",
        borderRadius: "4px",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}
