import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Cloud, Bell, Shield, Users, Key, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure your CSPM tool preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AWS Configuration */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Cloud className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">AWS Configuration</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="account-id">AWS Account ID</Label>
                <Input id="account-id" value="-" className="mt-1.5 bg-secondary/50" readOnly />
              </div>
              <div>
                <Label htmlFor="region">Default Region</Label>
                <Input id="region" value="-" className="mt-1.5 bg-secondary/50" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-Discovery</p>
                  <p className="text-xs text-muted-foreground">Automatically discover new resources</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Critical Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified for critical findings</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Daily Reports</p>
                  <p className="text-xs text-muted-foreground">Receive daily security summary</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Compliance Alerts</p>
                  <p className="text-xs text-muted-foreground">Alert on compliance changes</p>
                </div>
                <Switch />
              </div>
            </div>
          </motion.div>

          {/* Scan Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Scan Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="scan-interval">Scan Interval (minutes)</Label>
                <Input id="scan-interval" type="number" value="15" className="mt-1.5 bg-secondary/50" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-Remediation</p>
                  <p className="text-xs text-muted-foreground">Automatically fix low-risk issues</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Deep Scan</p>
                  <p className="text-xs text-muted-foreground">Include detailed IAM analysis</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </motion.div>

          {/* User Management */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">User Management</h3>
            </div>
            <div className="space-y-3">
              {["Super Admin", "Security Analyst", "Read Only"].map((role) => (
                <div key={role} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                  <span className="text-sm">{role}</span>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-end">
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
