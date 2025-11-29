"use client";

import { ArrowRight, Brain, Microscope, Zap } from "lucide-react";
import Link from "next/link";
import Footer from "./footer";
import Image from "next/image";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* --- NAVBAR --- */}
      <nav className="w-full bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo Area */}
            <div className="flex items-center gap-2">
              <Image
                src="/genesys_icon.svg"
                alt="GeneSys Logo"
                width={50}
                height={50}
              />
              <span className="text-2xl font-bold text-white tracking-tight">
                Gene<span className="text-bio-400">Sys</span>
              </span>
            </div>

            {/* Nav Actions */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-slate-300 hover:text-white font-medium transition-colors"
              >
                Teacher Login
              </Link>
              <Link
                href="/signup"
                className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-slate-100 transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-grow">
        <section className="relative bg-slate-900 overflow-hidden">
          {/* Background Decorative Blobs (The RGB Elements) */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-40 w-96 h-96 bg-dna-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-20 w-96 h-96 bg-bio-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column: Text Content */}
              <div className="text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-bio-400 text-sm font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bio-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-bio-500"></span>
                  </span>
                  Live Biology Rooms Available
                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                  Master Biology <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-bio-400 via-blue-400 to-dna-400">
                    Through Play
                  </span>
                </h1>

                <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                  Join interactive game rooms, master genetics and evolution,
                  and compete with classmates in real-time.
                </p>

                {/* The "Enter Code" Box - Crucial for Students */}
                <div className="bg-white p-2 rounded-xl flex shadow-xl max-w-md transform hover:scale-105 transition-transform duration-200">
                  <input
                    type="text"
                    placeholder="Enter Room Code (e.g. A1B2C3)"
                    className="flex-grow px-4 py-3 text-slate-900 outline-none rounded-l-lg font-mono placeholder:text-slate-400"
                  />
                  <button className="bg-bio-600 hover:bg-bio-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
                    Join <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Visual/Dynamic Element */}
              <div className="hidden lg:block relative">
                {/* Abstract Card Stack Visual */}
                <div className="relative w-full max-w-md mx-auto aspect-square">
                  {/* Card 1: Back */}
                  <div className="absolute top-0 right-0 w-64 h-80 bg-dna-500 rounded-2xl opacity-20 transform rotate-12 translate-x-4"></div>
                  {/* Card 2: Middle */}
                  <div className="absolute top-4 right-8 w-64 h-80 bg-blue-600 rounded-2xl opacity-40 transform rotate-6"></div>
                  {/* Card 3: Front (Active Quiz Card) */}
                  <div className="absolute top-8 right-12 w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Question 4/10
                      </span>
                      <span className="text-dna-400 font-mono text-sm">
                        00:14
                      </span>
                    </div>
                    <h3 className="text-xl text-white font-bold mb-6">
                      Which organelle is known as the powerhouse of the cell?
                    </h3>
                    <div className="space-y-3">
                      <div className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 cursor-pointer transition">
                        Nucleus
                      </div>
                      <div className="w-full p-3 rounded-lg bg-bio-600/20 border border-bio-500 text-bio-400 font-bold cursor-pointer transition flex justify-between">
                        Mitochondria <span>✓</span>
                      </div>
                      <div className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 cursor-pointer transition">
                        Ribosome
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave Separator at Bottom */}
          <div className="absolute bottom-0 w-full leading-none z-10">
            <svg
              className="block w-full h-12 md:h-24"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
            >
              <path
                fill="#f8fafc"
                fillOpacity="1"
                d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,202.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* --- FEATURES GRID (The Quizizz "Cards" area) --- */}
        <section className="bg-slate-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">
                Designed for STEM Excellence
              </h2>
              <p className="mt-4 text-slate-600">
                Gamified learning tailored for the Philippine K-12 Curriculum.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <Brain className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Critical Thinking
                </h3>
                <p className="text-slate-600">
                  Move beyond rote memorization. Solve complex biological
                  problems in real-time scenarios.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 bg-bio-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-bio-500 transition-colors">
                  <Microscope className="w-8 h-8 text-bio-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Concept Mastery
                </h3>
                <p className="text-slate-600">
                  Deep dive into Genetics, Evolution, and Taxonomy with visual
                  aids and instant feedback.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 bg-dna-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-dna-500 transition-colors">
                  <Zap className="w-8 h-8 text-dna-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Gamified Retention
                </h3>
                <p className="text-slate-600">
                  Earn badges, track progress, and compete in leaderboards to
                  make learning stick.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
