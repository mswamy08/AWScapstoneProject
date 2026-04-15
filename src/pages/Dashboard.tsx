import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SecurityScoreCard } from "@/components/dashboard/SecurityScoreCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { FindingsChart } from "@/components/dashboard/FindingsChart";
import { RecentFindings } from "@/components/dashboard/RecentFindings";
import { ComplianceStatus } from "@/components/dashboard/ComplianceStatus";
import AwsConnectModal from "@/components/AwsConnectmodal";
import { Cloud } from "lucide-react";
import { motion } from "framer-motion";
import type { Finding } from "@/types/Finding";

export default function Dashboard() {
  /* ================= STATE ================= */

  const [openAwsModal, setOpenAwsModal] = useState(false);
  const [awsConnected, setAwsConnected] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [scanning, setScanning] = useState(false);

  /* ================= INIT ================= */

  useEffect(() => {
    const roleArn = localStorage.getItem("roleArn");
    if (roleArn) {
      setAwsConnected(true);
    }
  }, []);

  /* ================= DERIVED ================= */

  const score = Math.max(0, 100 - findings.length * 10);

  /* ================= ACTIONS ================= */

  const scanAws = async () => {
    try {
      setScanning(true);

      const roleArn = localStorage.getItem("roleArn");
      if (!roleArn) {
        alert("AWS role not connected");
        return;
      }

      const res = await fetch("http://localhost:5000/api/aws/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleArn }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AWS scan failed");
      }

      setFindings(data.findings ?? []);
    } catch (err) {
      console.error("Scan failed:", err);
      alert("AWS scan failed. Check backend logs.");
    } finally {
      setScanning(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold">Security Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Real-time AWS cloud security posture overview
            </p>
          </div>

          {awsConnected && (
            <button
              onClick={scanAws}
              disabled={scanning}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {scanning ? "Scanning AWS..." : "Scan AWS"}
            </button>
          )}
        </motion.div>

        {/* ================= AWS STATUS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => !awsConnected && setOpenAwsModal(true)}
          className="max-w-sm cursor-pointer rounded-xl border border-sidebar-border bg-secondary/50 p-4 hover:bg-secondary transition"
        >
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold">AWS Account</h3>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                awsConnected ? "bg-green-500" : "bg-red-500 animate-pulse"
              }`}
            />
            <span
              className={`text-xs ${
                awsConnected ? "text-green-500" : "text-red-500"
              }`}
            >
              {awsConnected ? "Connected" : "Not Connected"}
            </span>
          </div>
        </motion.div>

        {/* ================= SCORE + STATS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <SecurityScoreCard
            score={score}
            trend={-findings.length}
            grade={score >= 90 ? "A" : score >= 75 ? "B" : "C"}
          />
          <div className="lg:col-span-3">
            <StatsGrid findings={findings} />
          </div>
        </div>

        {/* ================= CHART ================= */}
        <FindingsChart findings={findings} />

        {/* ================= BOTTOM ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RecentFindings findings={findings} />
          <ComplianceStatus findings={findings} />
        </div>

        {/* ================= AWS CONNECT MODAL ================= */}
        <AwsConnectModal
          open={openAwsModal}
          onClose={() => setOpenAwsModal(false)}
          onConnected={(roleArn: string) => {
            localStorage.setItem("roleArn", roleArn);
            setAwsConnected(true);
            setOpenAwsModal(false);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
