import express, { Request, Response } from "express";
import cors from "cors";
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { EC2Client, DescribeRegionsCommand } from "@aws-sdk/client-ec2";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MUST match IAM trust policy
const EXTERNAL_ID = "demo-cspm-123";

// Route
app.post("/api/aws/connect", async (req: Request, res: Response) => {
  const { roleArn } = req.body as { roleArn?: string };

  if (!roleArn) {
    return res.status(400).json({ error: "roleArn is required" });
  }

  try {
    // 1️⃣ STS AssumeRole
    const sts = new STSClient({ region: "us-east-1" });

    const assumeRoleResponse = await sts.send(
      new AssumeRoleCommand({
        RoleArn: roleArn,
        RoleSessionName: "cspm-demo-session",
        ExternalId: EXTERNAL_ID,
        DurationSeconds: 3600,
      })
    );

    if (!assumeRoleResponse.Credentials) {
      throw new Error("Failed to assume role");
    }

    const { AccessKeyId, SecretAccessKey, SessionToken } =
      assumeRoleResponse.Credentials;

    // 2️⃣ Real AWS API validation
    const ec2 = new EC2Client({
      region: "us-east-1",
      credentials: {
        accessKeyId: AccessKeyId!,
        secretAccessKey: SecretAccessKey!,
        sessionToken: SessionToken!,
      },
    });

    await ec2.send(new DescribeRegionsCommand({}));

    // SUCCESS
    return res.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "AWS connection failed";

    return res.status(400).json({ error: message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
