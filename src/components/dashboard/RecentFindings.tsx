import { motion } from "framer-motion";
import {
  AlertTriangle,
  XCircle,
  Info,
  CheckCircle,
  ExternalLink,
  Clock,
  Database,
  Server,
  Users,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Finding } from "@/types/Finding";

/* ================= PROPS ================= */

interface Props {
  findings: Finding[];
}

/* ================= HELPERS ================= */

const getSeverityConfig = (severity: Finding["severity"]) => {
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

const getResourceIcon = (service: Finding["service"]) => {
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

/* ================= COMPONENT ================= */

export function RecentFindings({ findings }: Props) {
  const recent = findings.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold">Recent Findings</h3>
          <p className="text-sm text-muted-foreground">
            Latest security misconfigurations detected
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-2">
          View All
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="space-y-3">
        {recent.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <CheckCircle className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No findings
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              No security findings detected in this scan.
            </p>
          </div>
        ) : (
          recent.map((finding, index) => {
            const severity = getSeverityConfig(finding.severity);
            const SeverityIcon = severity.icon;
            const ResourceIcon = getResourceIcon(finding.service);

            return (
              <motion.div
                key={finding.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={cn("p-2 rounded-lg", severity.bg)}>
                    <SeverityIcon
                      className={cn("h-5 w-5", severity.color)}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">
                            {finding.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px]",
                              severity.badge
                            )}
                          >
                            {finding.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {finding.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <ResourceIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-mono">
                          {finding.resourceId}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 ml-auto">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {finding.region}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
