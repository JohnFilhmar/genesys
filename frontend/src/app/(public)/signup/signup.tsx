"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useMemo } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Loader2,
  ArrowRight,
  ChevronLeft,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { useRegister } from "@/hooks";
import Image from "next/image";

function Signup() {
  const router = useRouter();
  const register = useRegister();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    school: "",
    department: "",
  });

  const passwordStrength = useMemo(() => {
    const pass = formData.password || "";
    let score = 0;
    if (pass.length > 5) score += 1;
    if (pass.length > 9) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    return score;
  }, [formData.password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await register.mutateAsync(formData);
      router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden font-sans py-12">
      {/* --- Ambient Background Effects --- */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 bg-dna-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-lg px-4 relative z-10">
        {/* Navigation Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors text-sm font-medium group hover:cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Go back
        </button>

        {/* --- Main Card --- */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <Image
                src="/genesys_icon.svg"
                alt="GeneSys Logo"
                width={50}
                height={50}
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Teacher Registration
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Create an account to build biology quizzes and host live rooms.
            </p>

            {/* Student Notice Box */}
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700 flex items-start gap-2 text-left">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Students:</strong> You do not need an account. Simply
                ask your teacher for a Room Code to join a game.
              </span>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* First & Last Name */}
              <div className="flex flex-row justify-between items-center gap-2">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                    First Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="e.g. Juan Dela"
                      required
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                    Last Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="e.g. Dela Cruz"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                  School Email
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

              {/* Password */}
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
                    placeholder="Create a password"
                    required
                  />
                </div>

                {/* Password Strength Meter */}
                <div className="flex gap-1 h-1 mt-2">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 rounded-full transition-colors duration-300 ${
                        passwordStrength >= level
                          ? level <= 2
                            ? "bg-dna-400"
                            : "bg-bio-400"
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
              
              {/* School and Department */}
              <div className="flex flex-row justify-between items-center gap-2">
                {/* School Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                    School Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={formData.school}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          school: e.target.value,
                        }))
                      }
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="e.g. OMNHS"
                      required
                    />
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                    Department
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          department: e.target.value,
                        }))
                      }
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="e.g. STEM/Science"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 py-2">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="w-4 h-4 border border-slate-300 rounded bg-slate-50 focus:ring-3 focus:ring-bio-300 text-bio-600"
                  />
                </div>
                <label
                  htmlFor="terms"
                  className="text-xs text-slate-500 leading-tight"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  , and consent to participating in the GeneSys research study.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={register.isPending}
                className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white font-bold bg-bio-600 hover:bg-bio-700 active:bg-bio-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-bio-600/30 hover:shadow-bio-600/50 transform hover:-translate-y-0.5"
              >
                {register.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Teacher Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          {/* Decorative Bottom Bar */}
          <div className="h-1.5 w-full bg-linear-to-r from-dna-500 via-blue-500 to-bio-500"></div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-slate-600 text-xs mt-8 pb-8">
          © 2025 GeneSys. A Research Project by STEM 12.
        </p>
      </div>
    </div>
  );
}

export default Signup;
