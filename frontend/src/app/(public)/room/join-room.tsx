'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Dna, Users, Play, AlertCircle } from 'lucide-react';

function JoinRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase and limit to 6 characters
    const value = e.target.value.toUpperCase().slice(0, 6);
    setRoomCode(value);
    setError('');
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (roomCode.length !== 6) {
      setError('Room code must be 6 characters');
      return;
    }

    // Validate room code format (alphanumeric)
    const alphanumericRegex = /^[A-Z0-9]{6}$/;
    if (!alphanumericRegex.test(roomCode)) {
      setError('Room code must contain only letters and numbers');
      return;
    }

    // Navigate to the room page
    router.push(`/room/${roomCode}`);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-bio-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-linear-to-br from-bio-400 to-blue-500 w-12 h-12 rounded-xl flex items-center justify-center">
              <Dna className="text-white w-7 h-7" />
            </div>
            <h1 className="text-white font-bold text-2xl">
              Gene<span className="text-bio-400">Sys</span>
            </h1>
          </div>
          <p className="text-slate-400 text-sm">Interactive Biology Learning Platform</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Join a Room
              </h2>
              <p className="text-slate-600 text-sm">
                Enter the 6-character room code provided by your teacher
              </p>
            </div>

            {/* Room Code Input Form */}
            <form onSubmit={handleJoinRoom} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={handleRoomCodeChange}
                  placeholder="ABC123"
                  className="w-full px-4 py-4 text-center text-2xl font-mono font-bold border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent uppercase tracking-widest"
                  maxLength={6}
                  autoFocus
                />
                <p className="text-xs text-slate-500 mt-2 text-center">
                  {roomCode.length}/6 characters
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Join Button */}
              <button
                type="submit"
                disabled={roomCode.length !== 6}
                className="w-full px-6 py-4 bg-bio-600 hover:bg-bio-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg shadow-bio-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Play className="w-5 h-5" />
                Join Room
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Features Info */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">What to expect:</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-5 h-5 bg-bio-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-3 h-3 text-bio-600" />
                  </div>
                  <span>Join your classmates in live quizzes</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Play className="w-3 h-3 text-blue-600" />
                  </div>
                  <span>Answer questions in real-time</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <div className="w-5 h-5 bg-dna-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Dna className="w-3 h-3 text-dna-600" />
                  </div>
                  <span>Learn biology through interactive gameplay</span>
                </div>
              </div>
            </div>
          </div>

          {/* Go Back Button */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={handleGoHome}
              className="w-full px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back Home
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Don`t have a room code? Ask your teacher to create a room.
        </p>
      </div>
    </div>
  );
}

export default JoinRoom;