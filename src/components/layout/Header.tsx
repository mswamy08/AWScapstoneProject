import { Bell, Search, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNotificationsCount } from "@/hooks/useNotificationsCount";

export function Header() {
  const [lastScan, setLastScan] = useState("2 minutes ago");
  const [isScanning, setIsScanning] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const notificationsQuery = useNotificationsCount();

  useEffect(() => {
    if (notificationsQuery.data !== undefined) {
      setNotificationsCount(notificationsQuery.data);
    }
  }, [notificationsQuery.data]);

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScan("Just now");
    }, 2000);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search resources, findings..."
            className="w-80 pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Last Scan Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Last scan:</span>
          <span className="text-xs font-medium text-foreground">{lastScan}</span>
        </div>

        {/* Rescan Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRescan}
          disabled={isScanning}
          className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
        >
          <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
          {isScanning ? "Scanning..." : "Rescan"}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {notificationsCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-[10px]">
              {notificationsCount}
            </Badge>
          )}
        </Button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium">Security Admin</p>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
            SA
          </div>
        </div>
      </div>
    </header>
  );
}
