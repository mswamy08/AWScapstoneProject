// src/types/Finding.ts
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
