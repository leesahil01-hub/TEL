import React, { useState } from "react";
import { UserSession } from "../types";
import MaasaiLogo from "./MaasaiLogo";
import { Eye, EyeOff, Lock, User, ShieldAlert, BookOpen } from "lucide-react";

interface LoginScreenProps {
  onLogin: (session: UserSession) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTesterGuide, setShowTesterGuide] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const u = username.trim();
    const p = password.trim();

    if (!u || !p) {
      setError("Please fill in both fields");
      return;
    }

    // Collector logins: Tel001, Nar001, Mul001 (case insensitive or exact?)
    // Let's accept both exact or standard casing for robust usability.
    const collectors = ["Tel001", "Nar001", "Mul001"];
    const matchedCollector = collectors.find(
      (c) => c.toLowerCase() === u.toLowerCase()
    );

    if (matchedCollector && p === matchedCollector) {
      onLogin({ username: matchedCollector, role: "collector" });
    } else if (u.toLowerCase() === "admin" && p.toLowerCase() === "admin") {
      onLogin({ username: "admin", role: "admin" });
    } else {
      setError("Invalid credentials. Please verify and try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800">
      {/* Top Banner / Header */}
      <div className="w-full bg-slate-900 text-white py-4 px-6 flex items-center justify-between border-b-4 border-yellow-500 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-full shadow-inner">
            <MaasaiLogo className="w-14 h-14" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-yellow-500">County Government</h1>
            <h2 className="text-lg font-black tracking-widest text-white leading-tight">OF NAROK</h2>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-xs text-slate-400 font-mono">REVENUE DEPT - CESS GATEWAY</span>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-850 p-6 text-white text-center border-b border-slate-850 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600"></div>
            <h2 className="text-xl font-bold tracking-tight">Revenue Operations</h2>
            <p className="text-xs text-slate-400 mt-1">Authorized Access Only</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span className="text-xs text-red-800 font-medium">{error}</span>
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Username / Collector ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username credential"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-mono tracking-wide"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-950 text-white hover:text-yellow-400 font-bold rounded-lg text-sm transition-all shadow-md focus:ring-2 focus:ring-yellow-500"
            >
              Sign In to Terminal
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full py-3 bg-slate-900 border-t border-slate-800 text-center text-[10px] text-slate-500">
        <p>© 2026 COUNTY GOVERNMENT OF NAROK. ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  );
}
