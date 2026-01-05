"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import AuthLayout from "@/components/AuthLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Alert from "@/components/Alert";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register(email, password, name);

      if (response.success) {
        router.push("/dashboard");
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Register"
      subtitle="Create your SnapLink account"
      footer={{
        text: "Already have an account?",
        linkText: "Login",
        linkHref: "/login",
      }}
    >
      {error && <Alert variant="error">{error}</Alert>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />

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
          helperText="Minimum 6 characters"
        />

        <Input
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="••••••••"
        />

        <Button type="submit" isLoading={isLoading} fullWidth>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
