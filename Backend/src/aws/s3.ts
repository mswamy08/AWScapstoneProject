import {
  S3Client,
  ListBucketsCommand,
  GetBucketAclCommand,
} from "@aws-sdk/client-s3";
import { Finding } from "../types/Finding";

export async function scanS3(credentials: any): Promise<Finding[]> {
  const s3 = new S3Client({ region: "us-east-1", credentials });
  const findings: Finding[] = [];

  const buckets = await s3.send(new ListBucketsCommand({}));

  for (const bucket of buckets.Buckets || []) {
    if (!bucket.Name) continue;

    const acl = await s3.send(
      new GetBucketAclCommand({ Bucket: bucket.Name })
    );

    for (const grant of acl.Grants || []) {
      if (
        grant.Grantee?.URI?.includes("AllUsers")
      ) {
        findings.push({
          id: `s3-public-${bucket.Name}`,
          service: "S3",
          severity: "HIGH",
          title: "S3 bucket is public",
          description: "Bucket allows public access",
          resourceId: bucket.Name,
          region: "global",
        });
      }
    }
  }

  return findings;
}
