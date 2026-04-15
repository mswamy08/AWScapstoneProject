import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { FileCheck, CheckCircle, XCircle, AlertTriangle, ChevronRight, Download, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

const frameworks: any[] = [];

export default function Compliance() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Compliance Dashboard</h1>
            <p className="text-sm text-muted-foreground">Track compliance against security frameworks</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </motion.div>

        {/* Framework Cards */}
        <div className="space-y-4">
          {frameworks.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <FileCheck className="h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">No compliance frameworks</p>
              <p className="text-xs text-muted-foreground mt-1">No frameworks available for assessment.</p>
            </div>
          ) : (
            frameworks.map((framework, index) => {
            const isExpanded = expandedId === framework.id;
            const percentage = Math.round((framework.passed / framework.total) * 100);

            return (
              <motion.div
                key={framework.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : framework.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <FileCheck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{framework.name}</h3>
                          <Badge variant="outline">{framework.version}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{framework.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-sm">{framework.passed} passed</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <XCircle className="h-4 w-4 text-destructive" />
                            <span className="text-sm">{framework.failed} failed</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className={cn("text-3xl font-bold", percentage >= 90 ? "text-success" : percentage >= 70 ? "text-warning" : "text-destructive")}>
                          {percentage}%
                        </span>
                        <p className="text-xs text-muted-foreground">compliance</p>
                      </div>
                      <ChevronRight className={cn("h-5 w-5 text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className={cn("h-full rounded-full", percentage >= 90 ? "bg-success" : percentage >= 70 ? "bg-warning" : "bg-destructive")}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-border/50 p-6 bg-secondary/20"
                  >
                    <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Control Categories
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {framework.categories.map((category) => {
                        const catPercentage = Math.round((category.passed / category.total) * 100);
                        return (
                          <div key={category.name} className="p-4 rounded-lg bg-card/50 border border-border/50">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-medium">{category.name}</h5>
                              <span className={cn("text-sm font-bold", catPercentage >= 90 ? "text-success" : catPercentage >= 70 ? "text-warning" : "text-destructive")}>
                                {catPercentage}%
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-2">
                              <div
                                className={cn("h-full rounded-full transition-all", catPercentage >= 90 ? "bg-success" : catPercentage >= 70 ? "bg-warning" : "bg-destructive")}
                                style={{ width: `${catPercentage}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{category.passed}/{category.total} controls</span>
                              {category.failed > 0 && <span className="text-destructive">{category.failed} failed</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
