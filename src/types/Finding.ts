// src/types/Finding.ts
import type { Finding as BaseFinding } from "@/types/Finding";

/* ================= UI EXTENDED TYPE ================= */

interface UIFinding extends BaseFinding {
  status: "open" | "in_progress" | "resolved";
  compliance: string[];
  remediation: string;
  timestamp: string;
}

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM";

export interface Finding {
  id: string;
  service: "EC2" | "S3" | "IAM";
  severity: Severity;
  title: string;
  description: string;
  resourceId: string;
  region: string;
}
