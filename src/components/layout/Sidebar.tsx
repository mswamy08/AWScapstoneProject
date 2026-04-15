import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Shield,
  Server,
  AlertTriangle,
  FileCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Users,
  Lock,
  Activity,
  LogOut,
} from "lucide-react";

/* ---------------- Navigation ---------------- */

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resources", href: "/resources", icon: Server },
  { name: "Findings", href: "/findings", icon: AlertTriangle },
  { name: "Compliance", href: "/compliance", icon: FileCheck },
  { name: "IAM Analysis", href: "/iam", icon: Users },
  { name: "Network Security", href: "/network", icon: Lock },
];

const secondaryNav = [
  { name: "Activity Log", href: "/activity", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

/* ---------------- Sidebar ---------------- */

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const awsAccount = localStorage.getItem("awsAccount");
  const isAwsConnected = Boolean(awsAccount);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">

        {/* ---------------- Logo ---------------- */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-bold">AWS CSPM</h1>
                <p className="text-[10px] text-muted-foreground">
                  Security Posture
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 mx-auto">
              <Shield className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>

        {/* ---------------- Navigation ---------------- */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>

          <div className="my-4 border-t border-sidebar-border" />

          <div className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </nav>
        {/* ---------------- Logout ---------------- */}
        <button
          onClick={handleLogout}
          className="mx-3 mb-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* ---------------- Collapse Button ---------------- */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-secondary border border-border text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </div>
    </aside>
  );
}
