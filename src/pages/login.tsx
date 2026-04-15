import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, X, Eye, EyeOff } from "lucide-react";

const DEMO_EMAIL = "superadmin@cspm.com";
const DEMO_PASSWORD = "admin123";

const Login = (): JSX.Element => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [showReset, setShowReset] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetMessage, setResetMessage] = useState<string>("");

  const handleLogin = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (
      cleanEmail === DEMO_EMAIL &&
      cleanPassword === DEMO_PASSWORD
    ) {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/dashboard", { replace: true });
      return;
    }

    setError("Invalid demo credentials");
  };

  const handlePasswordReset = (): void => {
    if (!resetEmail.trim()) {
      setResetMessage("Please enter your email");
      return;
    }

    setResetMessage(
      "Demo mode: Password reset link would be sent to your email."
    );
  };

  const handleSignUp = (): void => {
    // Navigate to sign up page or handle sign up logic
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar">
      <div className="w-full max-w-md rounded-xl border border-sidebar-border bg-secondary/50 p-6 shadow-lg">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-3 text-lg font-bold text-primary">
            AWS CSPM Login
          </h1>
          <p className="text-xs text-muted-foreground">
            Cloud Security Posture Management
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-3 text-xs text-destructive text-center">{error}</p>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={DEMO_EMAIL}
                className="w-full rounded-lg bg-sidebar px-9 py-2 text-sm text-foreground border border-sidebar-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-muted-foreground">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={DEMO_PASSWORD}
                className="w-full rounded-lg bg-sidebar px-9 py-2 pr-10 text-sm text-foreground border border-sidebar-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setShowReset(true);
                setResetMessage("");
                setResetEmail("");
              }}
              className="text-[11px] text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign in */}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            Sign In
          </button>

          {/* Sign up */}
          <button
            type="button"
            onClick={handleSignUp}
            className="w-full rounded-lg border border-primary py-2 text-sm font-medium text-primary hover:bg-primary/10 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Divider with text */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={handleSignUp}
              className="text-primary hover:underline font-medium"
            >
              Create one
            </button>
          </p>
        </div>
      </div>

      {/* Reset Modal */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl bg-secondary border border-sidebar-border p-5 relative">
            <button
              onClick={() => setShowReset(false)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-sm font-semibold text-foreground mb-2">
              Reset Password
            </h2>

            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder={DEMO_EMAIL}
              className="w-full rounded-lg bg-sidebar px-3 py-2 text-sm text-foreground border border-sidebar-border focus:outline-none focus:ring-2 focus:ring-primary/40"
            />

            {resetMessage && (
              <p className="mt-3 text-[11px] text-primary">{resetMessage}</p>
            )}

            <button
              onClick={handlePasswordReset}
              className="mt-4 w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Send Reset Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
