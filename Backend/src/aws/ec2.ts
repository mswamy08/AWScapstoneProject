import { EC2Client, DescribeSecurityGroupsCommand } from "@aws-sdk/client-ec2";
import { Finding } from "../types/Finding";

export async function scanEC2(
  credentials: any,
  region = "us-east-1"
): Promise<Finding[]> {
  const ec2 = new EC2Client({ region, credentials });
  const findings: Finding[] = [];

  const res = await ec2.send(new DescribeSecurityGroupsCommand({}));

  for (const sg of res.SecurityGroups || []) {
    for (const rule of sg.IpPermissions || []) {
      for (const ip of rule.IpRanges || []) {
        if (ip.CidrIp === "0.0.0.0/0") {
          if (rule.FromPort === 22) {
            findings.push({
              id: `ec2-ssh-${sg.GroupId}`,
              service: "EC2",
              severity: "CRITICAL",
              title: "SSH open to the world",
              description: "Port 22 is open to 0.0.0.0/0",
              resourceId: sg.GroupId || "unknown",
              region,
            });
          }

          if (rule.FromPort === 3389) {
            findings.push({
              id: `ec2-rdp-${sg.GroupId}`,
              service: "EC2",
              severity: "CRITICAL",
              title: "RDP open to the world",
              description: "Port 3389 is open to 0.0.0.0/0",
              resourceId: sg.GroupId || "unknown",
              region,
            });
          }
        }
      }
    }
  }

  return findings;
}
