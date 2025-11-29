'use client';

import { ChevronLeft, ShieldAlert, Gavel, School, BookOpen } from "lucide-react";

export default function TermsPage() {

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
            Terms of Service
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Guidelines for using the GeneSys platform for academic purposes at Puerto Galera National High School.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12 space-y-12">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <School className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">1. Educational Purpose</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              GeneSys is a digital game-based learning module developed as part of a <strong>Practical Research 2 study</strong> by Grade 12 STEM students. By using this platform, you acknowledge that it is intended solely for educational assessment and the collection of research data regarding game-based learning effectiveness in General Biology.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-bio-100 rounded-lg text-bio-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">2. Student Responsibilities</h2>
            </div>
            <ul className="list-disc list-outside ml-6 space-y-3 text-slate-600">
              <li>
                <strong>Academic Integrity:</strong> Students must answer assessments honestly. Attempting to exploit the system, share room codes with unauthorized users, or manipulate scores is prohibited.
              </li>
              <li>
                <strong>Account Accuracy:</strong> You must provide your correct Name, LRN (Learner Reference Number), and Section when joining a room to ensure your grades are recorded accurately.
              </li>
              <li>
                <strong>Room Codes:</strong> Room codes are temporary (valid for 24 hours). Do not distribute these codes outside of your assigned section.
              </li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-dna-100 rounded-lg text-dna-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">3. Disclaimer & Limitations</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              This platform is provided `as is` for research purposes. While we strive for accuracy in content (aligned with the K-12 STEM Curriculum), the developers and Puerto Galera National High School are not liable for any technical interruptions, data loss due to connection failure, or minor content discrepancies.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Gavel className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">4. Modifications</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              The research team reserves the right to modify the quiz content, game mechanics, or scoring algorithms at any time to better fit the research objectives or curriculum requirements.
            </p>
          </section>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
            <p className="text-sm text-slate-500">
              <strong>Last Updated:</strong> October 2025<br />
              <strong>Research Context:</strong> A.Y. 2025-2026, STEM 12.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}