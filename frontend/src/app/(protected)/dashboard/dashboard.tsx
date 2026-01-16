'use client';

import Link from "next/link";
import { 
  Users, 
  Plus, 
  Play, 
  Clock, 
  MoreVertical,
  BarChart3,
  Loader2
} from "lucide-react";
import { useRooms } from "@/hooks/useRooms";
import { useQuestions } from "@/hooks/useQuestions";

function Dashboard() {
  // API Integration
  const { data: roomsData, isLoading: loadingRooms, isError: errorRooms } = useRooms(1, 10);
  const { data: questionsData, isLoading: loadingQuestions, isError: errorQuestions } = useQuestions({ limit: 3 });

  const allRooms = roomsData?.data || [];
  const activeRooms = allRooms.filter(room => room.status === 'active');
  const recentQuizzes = questionsData?.data || [];
  const totalQuestions = questionsData?.pagination?.total || 0;

  const stats = [
    { label: "Active Rooms", value: activeRooms.length.toString(), icon: Play, color: "text-bio-500", bg: "bg-bio-100" },
    { label: "Total Questions", value: totalQuestions.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "All Rooms", value: allRooms.length.toString(), icon: BarChart3, color: "text-dna-500", bg: "bg-dna-100" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* 1. Overview Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Overview</h2>
            <p className="text-slate-500 mt-1 text-sm md:text-base">Here`s what`s happening in your biology classes today.</p>
          </div>
          <button className="w-full md:w-auto bg-bio-600 hover:bg-bio-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-bio-600/20 flex items-center justify-center gap-2 transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            Create New Quiz
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* 2. Active Rooms */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Active Live Rooms</h3>
            <Link href="/rooms" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
          </div>

          {loadingRooms ? (
            <div className="flex items-center justify-center py-12 bg-white rounded-2xl border border-slate-200">
              <Loader2 className="w-8 h-8 text-bio-500 animate-spin" />
              <span className="ml-3 text-slate-600">Loading rooms...</span>
            </div>
          ) : errorRooms ? (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
              <p className="text-dna-600 font-medium">Failed to load rooms. Please try again.</p>
            </div>
          ) : activeRooms.length > 0 ? (
            <div className="space-y-4">
              {activeRooms.map((room) => (
                <div key={room._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-blue-300 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg font-mono font-bold text-lg tracking-wider shrink-0">
                      {room.roomCode}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{room.title}</h4>
                      <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> {room.stats.totalParticipants || 0} Joined
                        </span>
                        <span className="flex items-center gap-1 text-blue-600">
                          <Clock className="w-4 h-4" /> {room.settings.timeLimit ? `${room.settings.timeLimit} min` : 'No limit'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Active
                    </span>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
              <p className="text-slate-500">No active rooms.</p>
            </div>
          )}
        </div>

        {/* 3. Recent Question Bank */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recent Questions</h3>
            <Link href="/questions" className="text-sm text-blue-600 font-medium hover:underline">Library</Link>
          </div>
          
          {loadingQuestions ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <Loader2 className="w-8 h-8 text-bio-500 animate-spin mx-auto" />
              <p className="text-slate-600 mt-3">Loading questions...</p>
            </div>
          ) : errorQuestions ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <p className="text-dna-600 font-medium">Failed to load questions.</p>
            </div>
          ) : recentQuizzes.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {recentQuizzes.map((quiz, i) => (
                <div key={quiz._id} className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${i !== recentQuizzes.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <h4 className="font-semibold text-slate-900 text-sm truncate">{quiz.questionText}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${
                      quiz.difficulty === 'hard' ? 'bg-dna-50 text-dna-600 border-dna-100' : 
                      quiz.difficulty === 'medium' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-bio-50 text-bio-600 border-bio-100'
                    }`}>
                      {quiz.difficulty}
                    </span>
                    <span className="text-xs text-slate-400">{quiz.questionType} • {new Date(quiz.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              <Link href="/questions" className="w-full py-3 text-sm text-slate-500 font-medium hover:bg-slate-50 border-t border-slate-100 block text-center">
                View All Questions
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <p className="text-slate-500">No questions yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;