'use client';

import { useRouter } from "next/navigation";
import { BarChart3, TrendingUp, PieChart, Activity, ArrowLeft, Sparkles } from "lucide-react";

function Analytics() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Icon Group */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-linear-to-br from-blue-100 to-bio-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-blue-400/20 to-bio-400/20 animate-pulse"></div>
            <BarChart3 className="w-16 h-16 text-blue-600 relative z-10" />
          </div>
          {/* Floating Icons */}
          <div className="absolute top-0 right-1/4 animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '3s' }}>
            <div className="w-12 h-12 bg-bio-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-bio-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-1/4 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
            <div className="w-12 h-12 bg-dna-100 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-dna-600" />
            </div>
          </div>
          <div className="absolute top-1/2 right-0 animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '3s' }}>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-12 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-bio-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-dna-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-bio-100 text-bio-700 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Coming Soon
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Analytics & Reports
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
              We are building powerful analytics tools to help you track student performance, identify learning patterns, and make data-driven decisions for your biology classes.
            </p>

            {/* Feature List */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left max-w-lg mx-auto">
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Performance Tracking</h3>
                  <p className="text-xs text-slate-500">Monitor student progress over time</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 bg-bio-100 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-bio-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Learning Insights</h3>
                  <p className="text-xs text-slate-500">Identify knowledge gaps</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 bg-dna-100 rounded-lg flex items-center justify-center shrink-0">
                  <PieChart className="w-4 h-4 text-dna-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Topic Breakdown</h3>
                  <p className="text-xs text-slate-500">Analyze by biology topics</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Export Reports</h3>
                  <p className="text-xs text-slate-500">Download detailed reports</p>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-bio-600 hover:bg-bio-700 text-white font-semibold rounded-xl shadow-lg shadow-bio-600/20 transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-sm text-slate-500">
          This feature is under active development and will be available soon.
        </p>
      </div>
    </div>
  );
}

export default Analytics;