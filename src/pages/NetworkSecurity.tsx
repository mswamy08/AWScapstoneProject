import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Lock, Shield, Globe, AlertTriangle, CheckCircle, Network, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const securityGroups = [
  { id: "-", name: "-", vpc: "-", inbound: 0, outbound: 0, issues: 0, status: "Nil" },
  { id: "-", name: "-", vpc: "-", inbound: 0, outbound: 0, issues: 0, status: "Nil" },

];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "critical": return { color: "text-destructive", badge: "bg-destructive/20 text-destructive border-destructive/30" };
    case "warning": return { color: "text-warning", badge: "bg-warning/20 text-warning border-warning/30" };
    default: return { color: "text-success", badge: "bg-success/20 text-success border-success/30" };
  }
};

export default function NetworkSecurity() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Network Security</h1>
          <p className="text-sm text-muted-foreground">VPC, Security Groups, and Network ACL analysis</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "VPCs", value: "0", icon: Network, color: "text-primary" },
            { label: "Security Groups", value: "0", icon: Shield, color: "text-info" },
            { label: "Open to Internet", value: "0", icon: Globe, color: "text-warning" },
            { label: "Issues Found", value: "0", icon: AlertTriangle, color: "text-destructive" },
          ].map((stat) => (
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

        {/* Security Groups */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-semibold flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Security Groups
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">VPC</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Inbound Rules</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Outbound Rules</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Issues</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {securityGroups.map((sg, index) => {
                  const statusConfig = getStatusConfig(sg.status);
                  return (
                    <motion.tr
                      key={sg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="border-b border-border/30 hover:bg-secondary/20 cursor-pointer"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-primary" />
                          <span className="font-mono text-sm">{sg.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground font-mono">{sg.vpc}</td>
                      <td className="p-4 text-sm">{sg.inbound}</td>
                      <td className="p-4 text-sm">{sg.outbound}</td>
                      <td className="p-4">
                        {sg.issues > 0 ? (
                          <span className="text-sm font-medium text-destructive">{sg.issues}</span>
                        ) : (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={cn("capitalize", statusConfig.badge)}>
                          {sg.status}
                        </Badge>
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
