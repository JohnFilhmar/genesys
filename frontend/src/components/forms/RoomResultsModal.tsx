'use client';

import { useState, useMemo } from 'react';
import { useRoomResponses } from '@/hooks/useResponses';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IQuestion, IRoom, QuestionType } from '@/types/models';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  FileText, 
  Loader2,
  Award,
  Timer,
  AlertCircle,
  Edit3,
  CheckCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import GradeResponseModal from './GradeResponseModal';

// Helper function to format time ago
const formatTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

interface RoomResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: IRoom | null;
}

export default function RoomResultsModal({ open, onOpenChange, room }: RoomResultsModalProps) {
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedResponseIndex, setSelectedResponseIndex] = useState(0);

  const { data: responsesData, isLoading, isError } = useRoomResponses({ 
    roomId: room?._id || '',
    enabled: open && !!room?._id
  });

  const stats = responsesData?.stats;
  const responses = useMemo(() => responsesData?.data || [], [responsesData?.data]);

  // Check if room has essay or short answer questions
  const hasManualGradingQuestions = useMemo(() => {
    if (!room?.questions) return false;
    const questions = Array.isArray(room.questions) ? room.questions : [];
    // Check if questions are populated (objects) rather than just IDs (strings)
    if (questions.length === 0 || typeof questions[0] === 'string') return false;
    return (questions as IQuestion[]).some(
      (q) => 
        q.questionType === QuestionType.ESSAY || 
        q.questionType === QuestionType.SHORT_ANSWER
    );
  }, [room]);

  // Filter and sort submitted responses to match display order
  const submittedResponses = useMemo(() => {
    return responses
      .filter(r => r.status === 'submitted' || r.status === 'reviewed')
      .sort((a, b) => {
        // Match the sorting in the display: highest percentage first
        if (b.percentage !== a.percentage) {
          return b.percentage - a.percentage;
        }
        // Tie-breaker: fastest time first
        return a.totalTimeSpent - b.totalTimeSpent;
      });
  }, [responses]);

  if (!room) return null;

  const handleOpenGrading = (responseIndex: number) => {
    setSelectedResponseIndex(responseIndex);
    setShowGradingModal(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-hidden flex flex-col bg-linear-to-br from-slate-50 to-blue-50 p-0">
        {/* Header */}
        <DialogHeader className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 lg:py-5 shrink-0">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-linear-to-br from-bio-500 to-bio-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-1 truncate">
                {room.title}
              </DialogTitle>
              <p className="text-sm text-slate-600">Room Results & Analytics</p>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-bio-500 animate-spin mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Loading results...</p>
              </div>
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Failed to Load Results</h3>
              <p className="text-red-600">Please try again later.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Statistics Overview */}
              <div>
                <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-slate-600 uppercase tracking-wide mb-3 sm:mb-4 lg:mb-5">Overview Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
                  <div className="bg-white rounded-xl p-4 lg:p-5 border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-2 mb-2 lg:mb-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                      </div>
                      <span className="text-xs lg:text-sm font-semibold text-blue-600 uppercase">Total</span>
                    </div>
                    <p className="text-3xl lg:text-4xl font-bold text-blue-900">{stats?.total || 0}</p>
                    <p className="text-xs lg:text-sm text-slate-500 mt-1">Participants</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-xs font-semibold text-green-600 uppercase">Done</span>
                    </div>
                    <p className="text-3xl font-bold text-green-900">{stats?.submitted || 0}</p>
                    <p className="text-xs text-slate-500 mt-1">Submitted</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border-2 border-yellow-100 hover:border-yellow-300 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span className="text-xs font-semibold text-yellow-600 uppercase">Active</span>
                    </div>
                    <p className="text-3xl font-bold text-yellow-900">{stats?.inProgress || 0}</p>
                    <p className="text-xs text-slate-500 mt-1">In Progress</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Award className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-xs font-semibold text-purple-600 uppercase">Score %</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-900">
                      {stats?.averagePercentage ? `${stats.averagePercentage.toFixed(1)}%` : '0%'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Average</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border-2 border-bio-100 hover:border-bio-300 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-bio-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-bio-600" />
                      </div>
                      <span className="text-xs font-semibold text-bio-600 uppercase">Points</span>
                    </div>
                    <p className="text-3xl font-bold text-bio-900">
                      {stats?.averageScore ? stats.averageScore.toFixed(1) : '0'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Average</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border-2 border-slate-100 hover:border-slate-300 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Timer className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 uppercase">Time</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">
                      {stats?.averageTime ? `${Math.floor(stats.averageTime / 60)}m` : '0m'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Average</p>
                  </div>
                </div>
              </div>

              {/* Participants List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Participant Responses
                  </h3>
                  <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                    {responses.length} {responses.length === 1 ? 'Response' : 'Responses'}
                  </span>
                </div>

                {responses.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">No Responses Yet</h4>
                    <p className="text-slate-500">Responses will appear here once students submit their answers.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[...responses]
                      .sort((a, b) => {
                        // Primary sort: highest percentage first
                        if (b.percentage !== a.percentage) {
                          return b.percentage - a.percentage;
                        }
                        // Secondary sort (tie-breaker): fastest time first (lower totalTimeSpent)
                        return a.totalTimeSpent - b.totalTimeSpent;
                      })
                      .map((response, index) => {
                      const isSubmitted = response.status === 'submitted' || response.status === 'reviewed';
                      const timeSpentMinutes = Math.floor(response.totalTimeSpent / 60);
                      const timeSpentSeconds = response.totalTimeSpent % 60;

                      return (
                        <div
                          key={response._id}
                          className="bg-white rounded-xl p-5 border border-slate-200 hover:border-bio-300 hover:shadow-lg transition-all"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Student Info */}
                            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-linear-to-br from-bio-400 to-bio-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-white text-base sm:text-lg lg:text-xl shadow-md">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-lg text-slate-900 truncate mb-1">
                                  {response.studentInfo.name}
                                </h4>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                                  {response.studentInfo.lrn && (
                                    <span className="flex items-center gap-1">
                                      <span className="font-semibold">LRN:</span> {response.studentInfo.lrn}
                                    </span>
                                  )}
                                  {response.studentInfo.section && (
                                    <span className="flex items-center gap-1">
                                      <span className="font-semibold">Section:</span> {response.studentInfo.section}
                                    </span>
                                  )}
                                  {response.studentInfo.email && (
                                    <span className="flex items-center gap-1 truncate">
                                      <span className="font-semibold">Email:</span> {response.studentInfo.email}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 lg:gap-3">
                              {isSubmitted ? (
                                <>
                                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-linear-to-br from-green-50 to-green-100 text-green-700 rounded-xl font-bold border border-green-200">
                                    <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                                    <span className="text-base sm:text-lg lg:text-xl">{response.percentage.toFixed(1)}%</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-linear-to-br from-blue-50 to-blue-100 text-blue-700 rounded-xl font-semibold border border-blue-200">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>{response.totalScore} / {response.maxScore}</span>
                                  </div>
                                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-mono font-semibold border border-slate-200">
                                    <Timer className="w-4 h-4" />
                                    <span>{timeSpentMinutes}:{timeSpentSeconds.toString().padStart(2, '0')}</span>
                                  </div>
                                  {response.submittedAt && (
                                    <div className="text-xs text-slate-500 font-medium px-2">
                                      {formatTimeAgo(response.submittedAt)}
                                    </div>
                                  )}
                                  {hasManualGradingQuestions && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        // Find the index in submittedResponses array
                                        const submittedIndex = submittedResponses.findIndex(r => r._id === response._id);
                                        if (submittedIndex !== -1) {
                                          handleOpenGrading(submittedIndex);
                                        }
                                      }}
                                      className="ml-2 gap-2"
                                    >
                                      {response.status === 'reviewed' ? (
                                        <>
                                          <CheckCheck className="w-4 h-4 text-green-600" />
                                          <span>Reviewed</span>
                                        </>
                                      ) : (
                                        <>
                                          <Edit3 className="w-4 h-4" />
                                          <span>Grade</span>
                                        </>
                                      )}
                                    </Button>
                                  )}
                                </>
                              ) : (
                                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-linear-to-br from-yellow-50 to-yellow-100 text-yellow-700 rounded-xl font-bold border border-yellow-200">
                                  <Clock className="w-5 h-5 animate-pulse" />
                                  <span>In Progress</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Grading Modal */}
      {hasManualGradingQuestions && submittedResponses.length > 0 && (
        <GradeResponseModal
          key={selectedResponseIndex}
          open={showGradingModal}
          onOpenChange={setShowGradingModal}
          responses={submittedResponses}
          room={room}
          initialResponseIndex={selectedResponseIndex}
        />
      )}
    </Dialog>
  );
}