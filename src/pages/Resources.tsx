import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import {
  Server,
  Database,
  Users,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Finding as BaseFinding } from "@/types/Finding";

/* ================= TYPES ================= */

interface ResourceItem {
  id: string;
  service: "EC2" | "S3" | "IAM";
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  description: string;
}

/* ================= COMPONENT ================= */

export default function Resources() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= LOAD RESOURCES ================= */

  useEffect(() => {
    const roleArn = localStorage.getItem("roleArn");

    // ✅ AWS NOT CONNECTED
    if (!roleArn) {
      setLoading(false);
      setResources([]);
      return;
    }

    fetch("http://localhost:5000/api/aws/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleArn }),
    })
      .then((res) => res.json())
      .then((data) => {
        const mapped: ResourceItem[] = (data.findings || []).map(
          (f: BaseFinding) => ({
            id: f.resourceId,
            service: f.service,
            severity: f.severity,
            description: f.title,
          })
        );

        setResources(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load AWS resources");
        setLoading(false);
      });
  }, []);

  /* ================= GROUP ================= */

  const ec2 = resources.filter((r) => r.service === "EC2");
  const s3 = resources.filter((r) => r.service === "S3");
  const iam = resources.filter((r) => r.service === "IAM");

  /* ================= RENDER ================= */

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-sm text-muted-foreground">
            AWS resources with detected security issues
          </p>
        </motion.div>

        {/* STATES */}
        {loading && (
          <p className="text-sm text-muted-foreground">
            Loading AWS resources…
          </p>
        )}

        {!loading && error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {!loading && !error && resources.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No resource issues detected or AWS not connected.
          </div>
        )}

        {!loading && resources.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ResourceCard title="EC2 Instances" icon={Server} items={ec2} />
            <ResourceCard title="S3 Buckets" icon={Database} items={s3} />
            <ResourceCard title="IAM Identities" icon={Users} items={iam} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ================= RESOURCE CARD ================= */

function ResourceCard({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: any;
  items: ResourceItem[];
}) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{title}</h3>
      </div>

      {items.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-success">
          <CheckCircle className="h-4 w-4" />
          No issues detected
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between text-sm"
            >
              <span className="font-mono truncate">{item.id}</span>
              <span
                className={cn(
                  "flex items-center gap-1 text-xs",
                  item.severity === "CRITICAL"
                    ? "text-destructive"
                    : item.severity === "HIGH"
                    ? "text-warning"
                    : "text-info"
                )}
              >
                <AlertTriangle className="h-3 w-3" />
                {item.severity}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
