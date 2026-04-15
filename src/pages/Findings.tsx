import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  XCircle,
  Info,
  CheckCircle,
  Filter,
  ChevronRight,
  Clock,
  Database,
  Server,
  Users,
  Lock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/* ================= BASE TYPE (BACKEND) ================= */

import type { Finding as BaseFinding } from "@/types/Finding";

/* ================= UI EXTENDED TYPE ================= */

interface UIFinding extends BaseFinding {
  status: "open" | "in_progress" | "resolved";
  compliance: string[];
  remediation: string;
  timestamp: string;
}

/* ================= HELPERS ================= */

const getSeverityConfig = (severity: UIFinding["severity"]) => {
  switch (severity) {
    case "CRITICAL":
      return {
        icon: XCircle,
        color: "text-destructive",
        bg: "bg-destructive/10",
        badge: "bg-destructive/20 text-destructive border-destructive/30",
      };
    case "HIGH":
      return {
        icon: AlertTriangle,
        color: "text-warning",
        bg: "bg-warning/10",
        badge: "bg-warning/20 text-warning border-warning/30",
      };
    case "MEDIUM":
      return {
        icon: Info,
        color: "text-info",
        bg: "bg-info/10",
        badge: "bg-info/20 text-info border-info/30",
      };
    default:
      return {
        icon: CheckCircle,
        color: "text-success",
        bg: "bg-success/10",
        badge: "bg-success/20 text-success border-success/30",
      };
  }
};

const getResourceIcon = (service: UIFinding["service"]) => {
  switch (service) {
    case "S3":
      return Database;
    case "EC2":
      return Server;
    case "IAM":
      return Users;
    default:
      return Lock;
  }
};

const severityFilters = ["All", "CRITICAL", "HIGH", "MEDIUM"];
const statusFilters = ["All", "open", "in_progress", "resolved"];

/* ================= COMPONENT ================= */

export default function Findings() {
  const [findings, setFindings] = useState<UIFinding[]>([]);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const base = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

  /* ================= LOAD FINDINGS ================= */

  useEffect(() => {
    const roleArn = localStorage.getItem("roleArn");
    if (!roleArn) return;

      fetch(`${base}/api/aws/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleArn }),
    })
      .then((res) => res.json())
      .then((data) => {
        const normalized: UIFinding[] = (data.findings || []).map(
          (f: BaseFinding) => ({
            ...f,
            status: "open",
            compliance: ["CIS", "AWS"],
            remediation:
              "Restrict public access or follow AWS security best practices",
            timestamp: new Date().toISOString(),
          })
        );

        setFindings(normalized);
      })
      .catch(console.error);
  }, []);

  /* ================= FILTER ================= */

  const filteredFindings = findings.filter((f) => {
    const severityMatch =
      severityFilter === "All" || f.severity === severityFilter;
    const statusMatch =
      statusFilter === "All" || f.status === statusFilter;
    return severityMatch && statusMatch;
  });

  /* ================= RENDER ================= */

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold">Security Findings</h1>
          <p className="text-sm text-muted-foreground">
            Review and remediate AWS security issues
          </p>
        </motion.div>

        {/* FILTERS */}
        <div className="glass-card p-4 flex flex-wrap gap-4">
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {severityFilters.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={severityFilter === s ? "default" : "outline"}
                onClick={() => setSeverityFilter(s)}
              >
                {s}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            {statusFilters.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={statusFilter === s ? "default" : "outline"}
                onClick={() => setStatusFilter(s)}
              >
                {s.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>

        {/* FINDINGS LIST */}
        {filteredFindings.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No findings available
            </p>
          </div>
        ) : (
          filteredFindings.map((finding) => {
            const severityConfig = getSeverityConfig(finding.severity);
            const SeverityIcon = severityConfig.icon;
            const ResourceIcon = getResourceIcon(finding.service);
            const isExpanded = expandedId === finding.id;

            return (
              <div key={finding.id} className="glass-card overflow-hidden">
                <div
                  className="p-4 cursor-pointer"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : finding.id)
                  }
                >
                  <div className="flex gap-4">
                    <div className={cn("p-2 rounded-lg", severityConfig.bg)}>
                      <SeverityIcon
                        className={cn("h-5 w-5", severityConfig.color)}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{finding.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {finding.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={cn(severityConfig.badge)}>
                            {finding.severity}
                          </Badge>
                          <ChevronRight
                            className={cn(
                              "h-5 w-5 transition-transform",
                              isExpanded && "rotate-90"
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ResourceIcon className="h-3 w-3" />
                          {finding.resourceId}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(finding.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t p-4 bg-secondary/20">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Remediation
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {finding.remediation}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
