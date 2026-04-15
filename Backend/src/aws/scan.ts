import { scanEC2 } from "./ec2";
import { scanS3 } from "./s3";
import { scanIAM } from "./iam";
import type { Finding } from "../types/Finding";

/**
 * Runs all AWS security checks and aggregates findings
 */
export async function scanAWS(
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
    region?: string;
  }
): Promise<Finding[]> {
  const findings: Finding[] = [];

  try {
    const ec2Findings = await scanEC2(credentials);
    findings.push(...ec2Findings);
  } catch (err) {
    console.error("EC2 scan failed:", err);
  }

  try {
    const s3Findings = await scanS3(credentials);
    findings.push(...s3Findings);
  } catch (err) {
    console.error("S3 scan failed:", err);
  }

  try {
    const iamFindings = await scanIAM(credentials);
    findings.push(...iamFindings);
  } catch (err) {
    console.error("IAM scan failed:", err);
  }

  return findings;
}
