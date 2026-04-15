import { motion } from "framer-motion";
import { CheckCircle, XCircle, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Finding } from "@/types/Finding";

/* ================= PROPS ================= */

interface Props {
  findings: Finding[];
}

/* ================= HELPERS ================= */

const getProgressColor = (percentage: number) => {
  if (percentage >= 90) return "bg-success";
  if (percentage >= 70) return "bg-warning";
  return "bg-destructive";
};

/* ================= COMPONENT ================= */

export function ComplianceStatus({ findings }: Props) {
  /**
   * SIMPLE DEMO LOGIC:
   * Each finding = one failed control
   * No findings = 100% compliant
   */

  const totalControls = 20;
  const failed = findings.length;
  const passed = Math.max(totalControls - failed, 0);
  const percentage = Math.round((passed / totalControls) * 100);

  const frameworks = [
    {
      name: "CIS AWS Foundations",
      version: "v2.0",
      passed,
      failed,
      total: totalControls,
      percentage,
    },
    {
      name: "AWS Best Practices",
      version: "2024",
      passed,
      failed,
      total: totalControls,
      percentage,
    },
    {
      name: "SOC 2 Type II",
      version: "2024",
      passed,
      failed,
      total: totalControls,
      percentage,
    },
    {
      name: "PCI-DSS",
      version: "v4.0",
      passed,
      failed,
      total: totalControls,
      percentage,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <FileCheck className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Compliance Status</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {frameworks.map((framework, index) => (
          <motion.div
            key={framework.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="p-4 rounded-lg bg-secondary/30 border border-border/50"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-sm">
                  {framework.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {framework.version}
                </p>
              </div>

              <span
                className={cn(
                  "text-xl font-bold",
                  framework.percentage >= 90
                    ? "text-success"
                    : framework.percentage >= 70
                    ? "text-warning"
                    : "text-destructive"
                )}
              >
                {framework.percentage}%
              </span>
            </div>

            <div className="relative h-2 rounded-full bg-secondary overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${framework.percentage}%`,
                }}
                transition={{
                  delay: 1 + index * 0.1,
                  duration: 0.8,
                }}
                className={cn(
                  "absolute h-full rounded-full",
                  getProgressColor(framework.percentage)
                )}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-success" />
                <span className="text-muted-foreground">
                  {framework.passed} passed
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5 text-destructive" />
                <span className="text-muted-foreground">
                  {framework.failed} failed
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
