import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Trees } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D5A27] to-[#1a3316]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Logo and Branding */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#2D5A27] rounded-full flex items-center justify-center mb-4">
              <Trees className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl text-[#2D5A27] mb-1">Zoo Management</h1>
            <p className="text-slate-600">Staff Portal</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="staff@zoo.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-slate-300 focus:border-[#2D5A27] focus:ring-[#2D5A27]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-slate-300 focus:border-[#2D5A27] focus:ring-[#2D5A27]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2D5A27] hover:bg-[#1f3f1c] text-white py-6"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-slate-600 hover:text-[#2D5A27]">
              Forgot password?
            </a>
          </div>
        </div>

        <p className="text-center text-white text-sm mt-6">
          Zoo Staff Access Only • Authorized Personnel
        </p>
      </div>
    </div>
  );
}
