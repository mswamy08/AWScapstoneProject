import { motion } from "framer-motion";
import { Shield, TrendingUp, TrendingDown } from "lucide-react";

interface SecurityScoreCardProps {
  score: number;
  trend: number;
  grade: string;
}

export function SecurityScoreCard({ score, trend, grade }: SecurityScoreCardProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getGradeColor = (grade: string) => {
    if (grade === "A" || grade === "A+") return "bg-success/20 text-success border-success/30";
    if (grade === "B" || grade === "B+") return "bg-info/20 text-info border-info/30";
    if (grade === "C" || grade === "C+") return "bg-warning/20 text-warning border-warning/30";
    return "bg-destructive/20 text-destructive border-destructive/30";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="stat-card flex flex-col items-center justify-center p-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Security Score
        </h3>
      </div>

      <div className="relative">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-secondary"
          />
          <motion.circle
            cx="72"
            cy="72"
            r="45"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="drop-shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--success))" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-4xl font-bold ${getScoreColor(score)}`}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className={`px-3 py-1 rounded-full border text-sm font-semibold ${getGradeColor(grade)}`}>
          Grade {grade}
        </div>
        <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? "text-success" : "text-destructive"}`}>
          {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
    </motion.div>
  );
}
