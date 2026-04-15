import { motion } from "framer-motion";
import type { Finding } from "@/types/Finding";

/* ================= PROPS ================= */

interface Props {
  findings: Finding[];
}

/* ================= COMPONENT ================= */

export function FindingsChart({ findings }: Props) {
  const critical = findings.filter(f => f.severity === "CRITICAL").length;
  const high = findings.filter(f => f.severity === "HIGH").length;
  const medium = findings.filter(f => f.severity === "MEDIUM").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h3 className="font-semibold mb-4">Findings Overview</h3>

      <div className="space-y-2 text-sm">
        <p>Critical: {critical}</p>
        <p>High: {high}</p>
        <p>Medium: {medium}</p>
      </div>
    </motion.div>
  );
}
