import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

/* ================= PAGES ================= */

import Login from "@/pages/login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Resources from "@/pages/Resources";
import Findings from "@/pages/Findings";
import Compliance from "@/pages/Compliance";
import IAMAnalysis from "@/pages/IAMAnalysis";
import NetworkSecurity from "@/pages/NetworkSecurity";
import ActivityLog from "@/pages/ActivityLog";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

/* ================= AUTH ================= */

import ProtectedRoute from "@/components/ProtectedRoute";

/* ================= SETUP ================= */

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>

            {/* ================= PUBLIC ================= */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ================= PROTECTED ================= */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              }
            />

            <Route
              path="/findings"
              element={
                <ProtectedRoute>
                  <Findings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/compliance"
              element={
                <ProtectedRoute>
                  <Compliance />
                </ProtectedRoute>
              }
            />

            <Route
              path="/iam"
              element={
                <ProtectedRoute>
                  <IAMAnalysis />
                </ProtectedRoute>
              }
            />

            <Route
              path="/network"
              element={
                <ProtectedRoute>
                  <NetworkSecurity />
                </ProtectedRoute>
              }
            />

            <Route
              path="/activity"
              element={
                <ProtectedRoute>
                  <ActivityLog />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* ================= DEFAULT ================= */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* ================= 404 ================= */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
