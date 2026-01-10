'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RoomStudentProps {
  roomId: string;
}

export default function RoomStudent({ roomId }: RoomStudentProps) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [roomData, setRoomData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    // Fetch room data by roomId
    // Replace with actual API call using your useRooms hook
    const fetchRoom = async () => {
      try {
        // const response = await getRoomByCode(roomId);
        // setRoomData(response.data);
        
        // Mock data for now
        setRoomData({
          code: roomId,
          title: 'Genetics: Mitosis vs Meiosis',
          description: 'Live assessment covering cell division processes',
          status: 'live',
          questions: 15,
          timeLimit: 3600,
          participants: 24,
          maxStudents: 30
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch room:', error);
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName.trim()) {
      alert('Please enter your name');
      return;
    }

    // API call to join room
    // await joinRoom(roomId, studentName);
    setHasJoined(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-bio-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading room...</p>
        </div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Room Not Found</h2>
          <p className="text-slate-600 mb-6">
            The room code <span className="font-mono font-bold text-slate-900">{roomId}</span> is invalid or has expired.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-bio-600 hover:bg-bio-700 text-white rounded-lg font-medium transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!hasJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-bio-50 via-blue-50 to-slate-50 p-4">
        <div className="max-w-lg w-full">
          {/* Room Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 mb-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-bio-100 text-bio-700 rounded-full text-sm font-semibold mb-4">
                <div className="w-2 h-2 bg-bio-600 rounded-full animate-pulse"></div>
                {roomData.status === 'live' ? 'Live Now' : 'Waiting to Start'}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                {roomData.title}
              </h1>
              
              <p className="text-slate-600 mb-4">
                {roomData.description}
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-mono text-lg font-bold">
                Room Code: {roomData.code}
              </div>
            </div>

            {/* Room Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">{roomData.questions}</div>
                <div className="text-xs text-slate-600">Questions</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">
                  <Users className="w-6 h-6 inline-block" /> {roomData.participants}/{roomData.maxStudents}
                </div>
                <div className="text-xs text-slate-600">Participants</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">
                  <Clock className="w-6 h-6 inline-block" />
                </div>
                <div className="text-xs text-slate-600">Timed</div>
              </div>
            </div>

            {/* Join Form */}
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Enter Your Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Juan Dela Cruz"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-bio-600 hover:bg-bio-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Join Room
              </button>
            </form>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-slate-600">
            By joining, you agree to participate in this assessment session.
          </p>
        </div>
      </div>
    );
  }

  // After joining - show quiz interface
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Quiz Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">{roomData.title}</h2>
            <p className="text-sm text-slate-600">Question 1 of {roomData.questions}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-5 h-5" />
              <span className="font-mono font-bold">45:00</span>
            </div>
          </div>
        </div>
      </header>

      {/* Quiz Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <span className="text-sm font-medium text-slate-600">Question 1</span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">
              What is the main difference between mitosis and meiosis?
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {['Mitosis produces 2 cells, meiosis produces 4 cells', 'Mitosis is faster than meiosis', 'Mitosis occurs in plants only', 'Meiosis occurs in all cells'].map((option, index) => (
              <button
                key={index}
                className="w-full text-left p-4 border-2 border-slate-200 rounded-lg hover:border-bio-500 hover:bg-bio-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-sm font-bold text-slate-600">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-slate-900">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
            <button className="px-6 py-2 text-slate-600 hover:text-slate-900 font-medium">
              Previous
            </button>
            <button className="px-6 py-2 bg-bio-600 hover:bg-bio-700 text-white rounded-lg font-medium">
              Next Question
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}