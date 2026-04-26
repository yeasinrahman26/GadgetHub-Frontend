"use client";

import { useState } from "react";
import { useForgotPasswordMutation } from "@/store/api/authApi";
import { toast } from "react-toastify";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  Loader2,
  ArrowLeft,
  Zap,
  Send,
  CheckCircle2,
  MailOpen,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  // Validate
  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    setError("");
    return true;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await forgotPassword({ email: email.trim() }).unwrap();
      setSubmitted(true);
      toast.success("Reset link sent to your email!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send reset link");
    }
  };

  // Success state
  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />

        <Card className="w-full max-w-md border-border/50 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="bg-emerald-500/10 rounded-full p-6 w-fit mx-auto">
                <MailOpen className="h-12 w-12 text-emerald-500" />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Check Your Email</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We have sent a password reset link to{" "}
                  <strong className="text-foreground">{email}</strong>. Please
                  check your inbox and follow the instructions.
                </p>
              </div>

              {/* Tips */}
              <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
                <p className="text-sm font-medium">
                  Did not receive the email?
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc ml-4">
                  <li>Check your spam or junk folder</li>
                  <li>Make sure the email address is correct</li>
                  <li>Wait a few minutes and try again</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                >
                  <Send className="h-4 w-4" />
                  Resend Email
                </Button>
                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />

      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="text-center space-y-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 mb-2"
          >
            <div className="bg-primary rounded-lg p-2">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>

          <div>
            <CardTitle className="text-2xl font-bold">
              Forgot Password?
            </CardTitle>
            <CardDescription className="mt-2">
              No worries! Enter your email and we will send you a reset link.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className={`pl-10 ${
                    error
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Reset Link
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
