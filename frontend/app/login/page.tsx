"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Alert from "@/components/Alert";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);

      if (response.success) {
        router.push("/dashboard");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Login"
      subtitle="Sign in to your SnapLink account"
      footer={{
        text: "Don't have an account?",
        linkText: "Register",
        linkHref: "/register",
      }}
    >
      {error && <Alert variant="error">{error}</Alert>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />

        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />

        <Button type="submit" isLoading={isLoading} fullWidth>
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </AuthLayout>
  );
}
