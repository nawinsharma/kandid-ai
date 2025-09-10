"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Eye, EyeOff, Mail} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "welcome" | "login" | "register";
}

type AuthMode = "welcome" | "login" | "register";

export function AuthModal({ isOpen, onClose, initialMode = "welcome" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRedirectButton, setShowRedirectButton] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setError("Google authentication failed");
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("🔐 Starting login process...");
      console.log("📧 Email:", email);
      
      const result = await authClient.signIn.email({
        email,
        password,
      });
      
      console.log("🔍 Login result:", result);
      
      if (result.error) {
        console.log("❌ Login failed with error:", result.error);
        // Provide more user-friendly error messages
        if (result.error.message?.includes("User not found") || result.error.message?.includes("Invalid email or password")) {
          setError("Invalid email or password. Please check your credentials and try again.");
        } else if (result.error.message?.includes("Email not verified")) {
          setError("Please verify your email address before signing in.");
        } else {
          setError(result.error.message || "Login failed. Please try again.");
        }
      } else {
        // Any successful response should trigger redirect
        console.log("✅ Login successful! Starting redirect process...");
        console.log("🔍 Login result:", result);
        console.log("🔍 Login result data:", result.data);
        console.log("🔍 Login result user:", result.data?.user);
        console.log("🔄 Closing modal...");
        onClose();
        
        // Trigger auth change event to update auth state
        console.log("🔔 Triggering auth change event...");
        window.dispatchEvent(new CustomEvent('auth-change'));
        
        // Also try to refresh auth state manually
        if ((window as Window & { refreshAuth?: () => void }).refreshAuth) {
          console.log("🔄 Manually refreshing auth state...");
          (window as Window & { refreshAuth?: () => void }).refreshAuth!();
        }
        
        console.log("⏰ Using immediate redirect...");
        // Use immediate redirect without timeout
        console.log("🚀 Executing immediate redirect via window.location.href");
        // Force a hard redirect to bypass any caching issues
        window.location.href = "/dashboard";
        
        // Fallback redirect after 2 seconds
        setTimeout(() => {
          console.log("🆘 Fallback redirect triggered");
          window.location.href = "/dashboard";
        }, 2000);
        
        // Show manual redirect button after 3 seconds if still not redirected
        setTimeout(() => {
          console.log("🔘 Showing manual redirect button");
          setShowRedirectButton(true);
        }, 3000);
      }
    } catch (error) {
      console.error("💥 Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      console.log("🏁 Login process finished, setting loading to false");
      setIsLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await authClient.signUp.email({
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
      });

      console.log("🔍 Registration result:", result);

      if (result.error) {
        // Provide more user-friendly error messages
        if (result.error.message?.includes("User already exists") || result.error.message?.includes("Email already exists")) {
          setError("An account with this email already exists. Please try logging in instead.");
        } else if (result.error.message?.includes("Invalid email")) {
          setError("Please enter a valid email address.");
        } else if (result.error.message?.includes("Password")) {
          setError("Password must be at least 6 characters long.");
        } else {
          setError(result.error.message || "Registration failed");
        }
      } else {
        console.log("✅ Registration successful! Starting redirect process...");
        console.log("🔄 Closing modal...");
        onClose();
        
        // Trigger auth change event to update auth state
        console.log("🔔 Triggering auth change event...");
        window.dispatchEvent(new CustomEvent('auth-change'));
        
        // Also try to refresh auth state manually
        if ((window as Window & { refreshAuth?: () => void }).refreshAuth) {
          console.log("🔄 Manually refreshing auth state...");
          (window as Window & { refreshAuth?: () => void }).refreshAuth!();
        }
        
        console.log("⏰ Using immediate redirect...");
        // Use immediate redirect without timeout
        console.log("🚀 Executing immediate redirect via window.location.replace");
        window.location.replace("/dashboard");
        
        // Fallback redirect after 2 seconds
        setTimeout(() => {
          console.log("🆘 Fallback redirect triggered");
          window.location.href = "/dashboard";
        }, 2000);
      }
    } catch (error) {
      console.error("💥 Registration error:", error);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setConfirmPassword("");
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowRedirectButton(false);
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const renderWelcomeScreen = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100">Continue with an account</h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400">You must log in or register to continue.</p>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full h-12 text-gray-700 dark:text-neutral-300 border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700"
          onClick={handleGoogleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Continue with Google
        </Button>

        <Button
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => handleModeChange("login")}
          disabled={isLoading}
        >
          <Mail className="mr-2 h-5 w-5" />
          Login with Email
        </Button>
      </div>

      <div className="text-center">
        <button
          onClick={() => handleModeChange("register")}
          className="text-sm text-blue-600 hover:underline"
        >
          New User? Create New Account
        </button>
      </div>

      <div className="text-center text-xs text-gray-500 dark:text-neutral-400">
        By continuing, you agree to our{" "}
        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and{" "}
        <a href="#" className="text-blue-600 hover:underline">T&Cs</a>
      </div>
    </div>
  );

  const renderLoginScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleModeChange("welcome")}
          className="flex items-center text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </button>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100">Login with email</h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400">Login using your email address.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email" className="text-sm font-medium text-gray-700 dark:text-neutral-300">
            Email or Username
          </Label>
          <Input
            id="login-email"
            type="email"
            placeholder="Enter email or username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password" className="text-sm font-medium text-gray-700 dark:text-neutral-300">
            Password
          </Label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 pr-10"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-400"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
      </form>

      {showRedirectButton && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 mb-2">
            Login successful! If you weren&apos;t redirected automatically, click below:
          </p>
          <Button
            onClick={() => {
              console.log("🔘 Manual redirect button clicked");
              window.location.href = "/dashboard";
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Go to Dashboard
          </Button>
        </div>
      )}

      <div className="flex justify-between text-sm">
        <button className="text-blue-600 hover:underline">Forgot password</button>
        <button
          onClick={() => handleModeChange("register")}
          className="text-blue-600 hover:underline"
        >
          Create New Account
        </button>
      </div>
    </div>
  );

  const renderRegisterScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleModeChange("welcome")}
          className="flex items-center text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </button>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100">Register with email</h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400">Register using your email address.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleEmailRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="register-firstname" className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              First Name
            </Label>
            <Input
              id="register-firstname"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-12"
              required
              autoComplete="given-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-lastname" className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              Last Name
            </Label>
            <Input
              id="register-lastname"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-12"
              required
              autoComplete="family-name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email" className="text-sm font-medium text-gray-700 dark:text-neutral-300">
            Email
          </Label>
          <Input
            id="register-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password" className="text-sm font-medium text-gray-700 dark:text-neutral-300">
            Password
          </Label>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 pr-10"
              required
              minLength={6}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-400"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-confirm-password" className="text-sm font-medium text-gray-700 dark:text-neutral-300">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="register-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 pr-10"
              required
              minLength={6}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-400"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create my account
        </Button>
      </form>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <button
          onClick={() => handleModeChange("login")}
          className="text-blue-600 hover:underline"
        >
          Login
        </button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/60 backdrop-blur-md" />
      <DialogContent className="sm:max-w-md w-full mx-4 bg-white rounded-2xl shadow-xl border-0 p-8">
        <DialogTitle className="sr-only">
          {mode === "welcome" && "Authentication"}
          {mode === "login" && "Login"}
          {mode === "register" && "Register"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {mode === "welcome" && "Choose your authentication method"}
          {mode === "login" && "Sign in to your account"}
          {mode === "register" && "Create a new account"}
        </DialogDescription>
        {mode === "welcome" && renderWelcomeScreen()}
        {mode === "login" && renderLoginScreen()}
        {mode === "register" && renderRegisterScreen()}
      </DialogContent>
    </Dialog>
  );
}
