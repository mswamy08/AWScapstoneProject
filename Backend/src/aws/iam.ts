import {
  IAMClient,
  ListUsersCommand,
  ListMFADevicesCommand,
} from "@aws-sdk/client-iam";
import { Finding } from "../types/Finding";

export async function scanIAM(credentials: any): Promise<Finding[]> {
  const iam = new IAMClient({ region: "us-east-1", credentials });
  const findings: Finding[] = [];

  const users = await iam.send(new ListUsersCommand({}));

  for (const user of users.Users || []) {
    if (!user.UserName) continue;

    const mfa = await iam.send(
      new ListMFADevicesCommand({ UserName: user.UserName })
    );

    if ((mfa.MFADevices || []).length === 0) {
      findings.push({
        id: `iam-mfa-${user.UserName}`,
        service: "IAM",
        severity: "MEDIUM",
        title: "IAM user without MFA",
        description: "User does not have MFA enabled",
        resourceId: user.UserName,
        region: "global",
      });
    }
  }

  return findings;
}
