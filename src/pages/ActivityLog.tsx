import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Activity, User, Database, Shield, Server, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const activityLogs = [
  { id: "1", action: "-", resource: "-", type: "-", user: "-", severity: "-", timestamp: "-" },
  { id: "2", action: "-", resource: "-", type: "-", user: "-", severity: "-", timestamp: "-" },

];

const getSeverityConfig = (severity: string) => {
  switch (severity) {
    case "critical": return { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" };
    case "high": return { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" };
    case "success": return { icon: CheckCircle, color: "text-success", bg: "bg-success/10" };
    default: return { icon: Activity, color: "text-info", bg: "bg-info/10" };
  }
};

const getResourceIcon = (type: string) => {
  switch (type) {
    case "S3": return Database;
    case "EC2": return Server;
    case "IAM": return User;
    default: return Shield;
  }
};

export default function ActivityLog() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Activity Log</h1>
          <p className="text-sm text-muted-foreground">Real-time security events and audit trail</p>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <div className="space-y-4">
            {activityLogs.map((log, index) => {
              const severityConfig = getSeverityConfig(log.severity);
              const SeverityIcon = severityConfig.icon;
              const ResourceIcon = getResourceIcon(log.type);

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className={cn("p-2 rounded-lg", severityConfig.bg)}>
                    <SeverityIcon className={cn("h-5 w-5", severityConfig.color)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{log.action}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5">
                        <ResourceIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-mono text-muted-foreground">{log.resource}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{log.type}</Badge>
                      <span className="text-xs text-muted-foreground">by {log.user}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
