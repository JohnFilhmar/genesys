"use client";

import { useLogin } from "@/hooks";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Mail, Lock, Loader2, ArrowRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const login = useLogin();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await login.mutateAsync(formData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden font-sans">
      {/* --- Background Ambient Effects (Matches Landing Page) --- */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-bio-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* --- Grid Pattern Overlay --- */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md px-4 relative z-10">
        {/* Navigation Back */}
        <Link
          href="/"
          className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors text-sm font-medium group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Go back
        </Link>

        {/* --- Main Card --- */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          {/* Card Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-6">
              <Image
                src="/genesys_icon.svg"
                alt="GeneSys Logo"
                width={50}
                height={50}
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 text-sm mt-2">
              Sign in to manage your biology classes and track student progress.
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="teacher@school.edu"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {login.isError && (
                <div className="bg-dna-50 border border-dna-100 text-dna-600 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-shake">
                  <span className="mt-0.5 block w-1.5 h-1.5 rounded-full bg-dna-500 shrink-0" />
                  Invalid email or password. Please try again.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={login.isPending}
                className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white font-bold bg-bio-600 hover:bg-bio-700 active:bg-bio-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-bio-600/30 hover:shadow-bio-600/50 transform hover:-translate-y-0.5"
              >
                {login.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                Do not have an account?{" "}
                <Link
                  href="/signup"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Decorative Bottom Bar */}
          <div className="h-1.5 w-full bg-linear-to-r from-bio-400 via-blue-500 to-dna-500"></div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-slate-600 text-xs mt-8">
          © 2025 GeneSys. Protected by reCAPTCHA.
        </p>
      </div>
    </div>
  );
}
