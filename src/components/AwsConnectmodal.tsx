import { useState } from "react";
import { X, Cloud } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConnected: (role: string) => void;
}

const AwsConnectModal = ({ open, onClose, onConnected }: Props) => {
  const [roleArn, setRoleArn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleConnect = async () => {
    if (!roleArn) {
      setError("IAM Role ARN is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 🔐 Call REAL backend
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
  const res = await fetch(`${base}/api/aws/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleArn }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AWS connection failed");
      }

      // ✅ REAL SUCCESS (no localStorage)
      onConnected(roleArn);
      onClose();

    } catch (err: any) {
      setError(err.message || "Failed to connect AWS account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xl bg-secondary border border-sidebar-border p-5 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <Cloud className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-semibold">Connect AWS Account</h2>
        </div>

        {/* Role ARN */}
        <div className="mb-3">
          <label className="text-xs text-muted-foreground">
            IAM Role ARN
          </label>
          <input
            value={roleArn}
            onChange={(e) => setRoleArn(e.target.value)}
            placeholder="arn:aws:iam::817623666586:role/CSPM-ReadOnly-Role"
            className="mt-1 w-full rounded-lg border bg-sidebar px-3 py-2 text-sm"
          />
        </div>

        {error && (
          <p className="text-xs text-destructive mb-2">{error}</p>
        )}

        {/* Action */}
        <button
          onClick={handleConnect}
          disabled={loading}
          className="mt-3 w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Connecting..." : "Connect AWS Account"}
        </button>
      </div>
    </div>
  );
};

export default AwsConnectModal;
