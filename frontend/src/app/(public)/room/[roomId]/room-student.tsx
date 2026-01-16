'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Loader2, Trophy, Clock } from 'lucide-react';
import { useJoinRoom, useCreateResponse, useUpdateResponse, useSubmitResponse } from '@/hooks';
import { IQuestion, IRoomJoinResponse, IStudentInfo } from '@/types';
import QuestionRenderer from '@/components/quiz/QuestionRenderer';
import QuizTimer from '@/components/quiz/QuizTimer';
import QuizProgress from '@/components/quiz/QuizProgress';

interface RoomStudentProps {
  roomId: string;
}

interface QuizAnswers {
  [questionId: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function RoomStudent({ roomId }: RoomStudentProps) {
  const router = useRouter();
  
  // API Hooks
  const { data: roomData, isLoading: isLoadingRoom, error: roomError } = useJoinRoom(roomId);

  useEffect(() => {
    console.log('Room Data:', roomData);
  }, [roomData]);
  
  const createResponseMutation = useCreateResponse();
  const updateResponseMutation = useUpdateResponse();
  const submitResponseMutation = useSubmitResponse();
  
  // State
  const [studentInfo, setStudentInfo] = useState<IStudentInfo>({ name: '', lrn: '', section: '', email: '' });
  const [hasJoined, setHasJoined] = useState(false);
  const [responseId, setResponseId] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [startTime] = useState(() => Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [finalTimeSpent, setFinalTimeSpent] = useState(0);
  const [isAutoSubmit, setIsAutoSubmit] = useState(false);
  
  // Ref to prevent multiple auto-submit calls
  const autoSubmitTriggered = useRef(false);

  const room = roomData?.data as IRoomJoinResponse | undefined;
  const questions = useMemo(() => (room?.questions as IQuestion[]) || [], [room?.questions]);
  const currentQuestion = questions[currentQuestionIndex];

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentInfo.name.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!room?._id) {
      alert('Room data not available');
      return;
    }

    try {
      // Create response in backend
      const response = await createResponseMutation.mutateAsync({
        roomId: room._id,
        studentInfo,
        ipAddress: '', // Could get from an IP detection service
        userAgent: navigator.userAgent,
      });

      setResponseId(response._id);
      setHasJoined(true);
    } catch (error) {
      console.error('Failed to join room:', error);
      alert('Failed to join room. Please try again.');
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    // Mark question as answered
    setAnsweredQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.add(currentQuestionIndex + 1);
      return newSet;
    });

    // Auto-save answer
    if (responseId) {
      const totalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
      const answersArray = Object.entries({ ...answers, [questionId]: answer }).map(([qId, ans]) => ({
        questionId: qId,
        answer: ans,
        timeSpent: 0,
      }));

      updateResponseMutation.mutate({
        responseId,
        answers: answersArray,
        totalTimeSpent,
      });
    }
  };

  const handleSubmitQuiz = useCallback(async (isAutoSubmit = false) => {
    if (!responseId) {
      alert('Response ID not found');
      return;
    }

    // Skip confirmation for auto-submit
    if (!isAutoSubmit) {
      const unansweredCount = questions.length - answeredQuestions.size;
      if (unansweredCount > 0) {
        const confirmSubmit = window.confirm(
          `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`
        );
        if (!confirmSubmit) return;
      }
    }

    setIsSubmitting(true);

    try {
      const totalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
      const answersArray = questions.map((q) => ({
        questionId: q._id,
        answer: answers[q._id] || null,
        timeSpent: 0,
      }));

      await submitResponseMutation.mutateAsync({
        responseId,
        answers: answersArray,
        totalTimeSpent,
      });

      setFinalTimeSpent(totalTimeSpent);
      setHasSubmitted(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      alert('Failed to submit quiz. Please try again.');
      setIsSubmitting(false);
    }
  }, [responseId, questions, answeredQuestions.size, startTime, answers, submitResponseMutation, router]);

  const handleTimeUp = useCallback(() => {
    // Prevent multiple calls
    if (autoSubmitTriggered.current || hasSubmitted || isSubmitting) {
      return;
    }
    
    autoSubmitTriggered.current = true;
    setIsAutoSubmit(true);
    handleSubmitQuiz(true);
  }, [hasSubmitted, isSubmitting, handleSubmitQuiz]);

  const handleNavigate = (questionNumber: number) => {
    setCurrentQuestionIndex(questionNumber - 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  if (isLoadingRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-bio-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading room...</p>
        </div>
      </div>
    );
  }

  if (roomError || !room) {
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

  // Check room status
  if (room.status !== 'active') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Room Not Active</h2>
          <p className="text-slate-600 mb-6">
            This room is currently {room.status}. Please wait for your teacher to activate it.
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

  // Show submitted state
  if (hasSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isAutoSubmit ? 'bg-orange-100' : 'bg-green-100'
          }`}>
            {isAutoSubmit ? (
              <Clock className="w-8 h-8 text-orange-600" />
            ) : (
              <Trophy className="w-8 h-8 text-green-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {isAutoSubmit ? "⏰ Time's Up!" : 'Quiz Submitted!'}
          </h2>
          <p className="text-slate-600 mb-6">
            {isAutoSubmit 
              ? 'Your quiz has been automatically submitted because the time limit was reached.'
              : 'Your answers have been submitted successfully. Thank you for participating!'
            }
          </p>
          <div className="space-y-3 text-left bg-slate-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between">
              <span className="text-slate-600">Questions Answered:</span>
              <span className="font-bold text-slate-900">{answeredQuestions.size} / {questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Time Spent:</span>
              <span className="font-bold text-slate-900">
                {Math.floor(finalTimeSpent / 60)} minutes
              </span>
            </div>
          </div>
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
                {room.status === 'active' ? 'Active' : 'Waiting to Start'}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                {room.title}
              </h1>
              
              <p className="text-slate-600 mb-4">
                {room.description || 'Live biology assessment'}
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-mono text-lg font-bold">
                Room Code: {room.roomCode}
              </div>
            </div>

            {/* Room Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">{questions.length}</div>
                <div className="text-xs text-slate-600">Questions</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">
                  {room.settings.maxStudents || '∞'}
                </div>
                <div className="text-xs text-slate-600">Max Students</div>
              </div>
            </div>

            {/* Join Form */}
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentInfo.name}
                  onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                  placeholder="Juan Dela Cruz"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  LRN (Optional)
                </label>
                <input
                  type="text"
                  value={studentInfo.lrn}
                  onChange={(e) => setStudentInfo({ ...studentInfo, lrn: e.target.value })}
                  placeholder="123456789012"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Section (Optional)
                </label>
                <input
                  type="text"
                  value={studentInfo.section}
                  onChange={(e) => setStudentInfo({ ...studentInfo, section: e.target.value })}
                  placeholder="Grade 10 - Einstein"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bio-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={createResponseMutation.isPending}
                className="w-full px-6 py-3 bg-bio-600 hover:bg-bio-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {createResponseMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Join Room
                  </>
                )}
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
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">{room.title}</h2>
            <p className="text-sm text-slate-600">
              {studentInfo.name} {studentInfo.section && `• ${studentInfo.section}`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {room.settings.timeLimit && room.settings.timeLimit > 0 && (
              <QuizTimer 
                totalSeconds={room.settings.timeLimit * 60} // Convert minutes to seconds
                onTimeUp={handleTimeUp}
                isActive={!hasSubmitted}
              />
            )}
          </div>
        </div>
      </header>

      {/* Quiz Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-2">
            {currentQuestion && (
              <QuestionRenderer
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                answer={answers[currentQuestion._id]}
                onAnswerChange={(answer) => handleAnswerChange(currentQuestion._id, answer)}
              />
            )}
          </div>

          {/* Sidebar - Progress & Submit */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">Quiz Progress</h3>
              
              <QuizProgress
                currentQuestion={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                answeredQuestions={answeredQuestions}
                onNavigate={handleNavigate}
                onPrevious={handlePrevious}
                onNext={handleNext}
                canGoPrevious={currentQuestionIndex > 0}
                canGoNext={currentQuestionIndex < questions.length - 1}
              />

              {/* Submit Button */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={() => handleSubmitQuiz(false)}
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Submit Quiz
                    </>
                  )}
                </button>
                
                {answeredQuestions.size < questions.length && (
                  <p className="text-xs text-amber-600 mt-2 text-center">
                    {questions.length - answeredQuestions.size} question(s) unanswered
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}