import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Users, Shield, AlertTriangle, CheckCircle, Key, UserCheck, Settings, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const iamFindings = [
  
  {
    id: "-",
    principal: "-",
    type: "-",
    issue: "-",
    risk: "-",
    lastActivity: "-",
  },
  {
    id: "-",
    principal: "-",
    type: "-",
    issue: "-",
    risk: "-",
    lastActivity: "-",
  },
];

const getRiskConfig = (risk: string) => {
  switch (risk) {
    case "critical": return { color: "text-destructive", bg: "bg-destructive/10", badge: "bg-destructive/20 text-destructive border-destructive/30" };
    case "high": return { color: "text-warning", bg: "bg-warning/10", badge: "bg-warning/20 text-warning border-warning/30" };
    default: return { color: "text-success", bg: "bg-success/10", badge: "bg-success/20 text-success border-success/30" };
  }
};

export default function IAMAnalysis() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">IAM Analysis</h1>
          <p className="text-sm text-muted-foreground">Identity and access management security review</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Principals", value: "0", icon: Users, color: "text-primary" },
            { label: "At Risk", value: "0", icon: AlertTriangle, color: "text-destructive" },
            { label: "Compliant", value: "0", icon: CheckCircle, color: "text-success" },
            { label: "Policies Analyzed", value: "0", icon: Key, color: "text-info" },
          ].map((stat, index) => (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={cn("text-3xl font-bold mt-1", stat.color)}>{stat.value}</p>
                </div>
                <stat.icon className={cn("h-8 w-8", stat.color, "opacity-50")} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* IAM Findings Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              IAM Security Findings
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Principal</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Issue</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Risk</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {iamFindings.map((finding, index) => {
                  const riskConfig = getRiskConfig(finding.risk);
                  return (
                    <motion.tr
                      key={finding.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="border-b border-border/30 hover:bg-secondary/20 cursor-pointer"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-primary" />
                          <span className="font-mono text-sm">{finding.principal}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{finding.type}</Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{finding.issue}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={cn("capitalize", riskConfig.badge)}>
                          {finding.risk}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {finding.lastActivity}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
