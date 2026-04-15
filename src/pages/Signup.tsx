import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, Eye, EyeOff, User } from "lucide-react";

const Signup = (): JSX.Element => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSignup = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Demo mode: Just show success and redirect to login
    setError("");
    alert("Demo mode: Account would be created. Redirecting to login...");
    navigate("/login");
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
            Create Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Join AWS CSPM Platform
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-3 text-xs text-destructive text-center">{error}</p>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-xs text-muted-foreground">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-lg bg-sidebar px-9 py-2 text-sm text-foreground border border-sidebar-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
                placeholder="••••••••"
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

          {/* Confirm Password */}
          <div>
            <label className="text-xs text-muted-foreground">Confirm Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-sidebar px-9 py-2 pr-10 text-sm text-foreground border border-sidebar-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Sign up button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            Create Account
          </button>
        </form>

        {/* Login link */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
