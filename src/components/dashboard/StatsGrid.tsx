import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Server,
  Shield,
  Database,
  Users,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Finding } from "@/types/Finding";

/* ================= PROPS ================= */

interface Props {
  findings: Finding[];
}

/* ================= COMPONENT ================= */

export function StatsGrid({ findings }: Props) {
  /* ================= COUNTS ================= */

  const critical = findings.filter(f => f.severity === "CRITICAL").length;
  const high = findings.filter(f => f.severity === "HIGH").length;
  const medium = findings.filter(f => f.severity === "MEDIUM").length;

  const serviceCount = {
    EC2: findings.filter(f => f.service === "EC2").length,
    S3: findings.filter(f => f.service === "S3").length,
    IAM: findings.filter(f => f.service === "IAM").length,
  };

  const totalResources =
    serviceCount.EC2 + serviceCount.S3 + serviceCount.IAM;

  const compliant = findings.length === 0 ? 1 : 0;

  /* ================= MAIN STATS ================= */

  const stats = [
    {
      name: "Total Resources",
      value: totalResources,
      icon: Server,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      name: "Critical Findings",
      value: critical,
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      name: "High Findings",
      value: high,
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      name: "Compliant",
      value: compliant,
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  /* ================= RESOURCE INVENTORY ================= */

  const resources = [
    {
      name: "S3 Buckets",
      count: serviceCount.S3,
      icon: Database,
    },
    {
      name: "EC2 Instances",
      count: serviceCount.EC2,
      icon: Server,
    },
    {
      name: "IAM Users",
      count: serviceCount.IAM,
      icon: Users,
    },
    {
      name: "VPC Networks",
      count: 0,
      icon: Lock,
    },
  ];

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6">
      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.name}
                </p>
                <p
                  className={cn(
                    "text-3xl font-bold mt-1",
                    stat.color
                  )}
                >
                  {stat.value}
                </p>
              </div>
              <div className={cn("p-2.5 rounded-lg", stat.bg)}>
                <stat.icon
                  className={cn("h-5 w-5", stat.color)}
                />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              vs last scan
            </p>
          </motion.div>
        ))}
      </div>

      {/* ================= RESOURCE INVENTORY ================= */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Resource Inventory</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {resources.map((r, index) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-4 rounded-lg bg-secondary/30 border border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <r.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{r.count}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.name}
                  </p>
                </div>
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                {r.count > 0 ? `${r.count} issues` : "No issues"}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
