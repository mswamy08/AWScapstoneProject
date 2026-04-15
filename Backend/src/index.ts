import express from "express";
import cors from "cors";
import type { Request, Response } from "express";

import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { EC2Client, DescribeRegionsCommand } from "@aws-sdk/client-ec2";

const { scanAWS } = require("./aws/scan");

const app = express();
const PORT = 5000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// MUST match IAM trust policy
const EXTERNAL_ID = "demo-cspm-123";
const REGION = "us-east-1";

// ================= TYPES =================
interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
}

// ================= HELPERS =================
async function assumeRole(roleArn: string): Promise<AwsCredentials> {
  const sts = new STSClient({ region: REGION });

  const res = await sts.send(
    new AssumeRoleCommand({
      RoleArn: roleArn,
      RoleSessionName: "cspm-scan-session",
      ExternalId: EXTERNAL_ID,
      DurationSeconds: 3600,
    })
  );

  if (!res.Credentials) {
    throw new Error("Failed to assume role");
  }

  return {
    accessKeyId: res.Credentials.AccessKeyId!,
    secretAccessKey: res.Credentials.SecretAccessKey!,
    sessionToken: res.Credentials.SessionToken!,
  };
}

// ================= ROUTES =================

/**
 * 🔐 AWS CONNECT (validate role)
 */
app.post("/api/aws/connect", async (req: Request, res: Response) => {
  const { roleArn } = req.body as { roleArn?: string };

  if (!roleArn) {
    return res.status(400).json({ error: "roleArn is required" });
  }

  try {
    const credentials = await assumeRole(roleArn);

    // Validate credentials by calling AWS
    const ec2 = new EC2Client({
      region: REGION,
      credentials,
    });

    await ec2.send(new DescribeRegionsCommand({}));

    return res.json({ success: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "AWS connection failed";
    return res.status(400).json({ error: message });
  }
});

/**
 * 🔍 AWS SCAN (EC2 + S3 + IAM)
 */
app.post("/api/aws/scan", async (req: Request, res: Response) => {
  const { roleArn } = req.body as { roleArn?: string };

  if (!roleArn) {
    return res.status(400).json({ error: "roleArn is required" });
  }

  try {
    // 1️⃣ Assume role
    const credentials = await assumeRole(roleArn);

    // 2️⃣ Run all scans
    const findings = await scanAWS(credentials);

    // 3️⃣ Return findings
    return res.json({ findings });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "AWS scan failed";
    return res.status(500).json({ error: message });
  }
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
