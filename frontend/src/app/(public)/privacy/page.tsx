'use client';

import { ChevronLeft, Lock, Database, UserCheck, Eye } from "lucide-react";

export default function PrivacyPage() {

  const handleBackClick = () => {
    window.history.back();
  }
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors text-sm font-medium group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Go back
          </button>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            How we handle student data, research metrics, and academic records.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12 space-y-12">
          
          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              At <strong>GeneSys</strong>, we prioritize the privacy of our student users. As a research-based project, we collect the minimum amount of data necessary to evaluate the effectiveness of Game-Based Learning in General Biology.
            </p>
          </section>

          {/* Section 1: Data Collection */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <UserCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">1. Information We Collect</h2>
            </div>
            <p className="text-slate-600">We collect the following information for assessment purposes:</p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-slate-600">
              <li><strong>Student Identifiers:</strong> Full Name, LRN (Learner Reference Number), and Section.</li>
              <li><strong>Performance Data:</strong> Pre-test and post-test scores, time taken to complete quizzes, and answers selected.</li>
              <li><strong>Session Data:</strong> Temporary connection logs during active game rooms.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2: Data Retention (The Unique Selling Point) */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-bio-100 rounded-lg text-bio-600">
                <Database className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">2. Data Retention & The 24-Hour Rule</h2>
            </div>
            <div className="bg-bio-50 border border-bio-100 p-4 rounded-xl">
               <p className="text-bio-800 font-medium">
                 To ensure student privacy, GeneSys utilizes an ephemeral data policy for student sessions.
               </p>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Student session data in active rooms is stored temporarily. <strong>Room data is automatically expired and cleaned from our active cache after 24 hours.</strong> Teachers are responsible for exporting grades before this expiration period. Long-term research data is anonymized for statistical analysis in the research study.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3: Usage */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-dna-100 rounded-lg text-dna-600">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">3. How We Use Your Data</h2>
            </div>
            <ul className="list-disc list-outside ml-6 space-y-3 text-slate-600">
              <li>
                <strong>Academic Grading:</strong> To provide teachers with assessment results for General Biology.
              </li>
              <li>
                <strong>Research Analysis:</strong> To answer the research problem: <em>`Is there a significant difference between students’ performance before and after the implementation of GeneSys?`</em>.
              </li>
              <li>
                <strong>System Improvement:</strong> Aggregated, anonymous data helps us identify which biological concepts (e.g., Genetics, Evolution) students struggle with the most.
              </li>
            </ul>
          </section>

          <hr className="border-slate-100" />

           {/* Section 4: Security */}
           <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">4. Data Security</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Teacher accounts are secured using encrypted credentials (bcrypt). All data transmission occurs over secure HTTPs channels. We do not sell, trade, or transfer student PII (Personally Identifiable Information) to external commercial parties.
            </p>
          </section>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
            <p className="text-sm text-slate-500">
              For privacy concerns regarding this research study, please contact the research team leader or the Practical Research 2 adviser at Puerto Galera National High School.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}