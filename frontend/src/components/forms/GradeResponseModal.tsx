'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  AlertCircle,
  CheckCircle2,
  User,
  FileText,
  Award,
  Clock,
  Loader2
} from 'lucide-react';
import { IStudentResponse, IRoom, QuestionType, IQuestion } from '@/types';
import { useGradeResponse } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface GradeResponseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  responses: IStudentResponse[];
  room: IRoom;
  initialResponseIndex?: number;
}

export default function GradeResponseModal({
  open,
  onOpenChange,
  responses,
  room,
  initialResponseIndex = 0,
}: GradeResponseModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialResponseIndex);
  const [grades, setGrades] = useState<Record<string, { points: number; isGraded: boolean }>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const gradeResponseMutation = useGradeResponse();

  const currentResponse = responses[currentIndex];

  // Get questions from the room that are essay or short-answer
  const manualGradingQuestions = useMemo(() => {
    if (!room.questions) return [];
    
    const questions = Array.isArray(room.questions) ? room.questions : [];
    // Check if questions are populated (objects) rather than just IDs (strings)
    if (questions.length === 0 || typeof questions[0] === 'string') return [];
    return (questions as IQuestion[]).filter(
      (q) => 
        q.questionType === QuestionType.ESSAY || 
        q.questionType === QuestionType.SHORT_ANSWER
    );
  }, [room.questions]);

  // Compute initial grades from current response
  const initialGrades = useMemo(() => {
    if (!currentResponse) return {};

    const grades: Record<string, { points: number; isGraded: boolean }> = {};
    
    currentResponse.answers.forEach((answer) => {
      const question = manualGradingQuestions.find(
        (q) => q._id === answer.questionId.toString()
      );
      
      if (question) {
        grades[answer.questionId.toString()] = {
          points: answer.pointsEarned || 0,
          isGraded: answer.isCorrect !== undefined && answer.pointsEarned !== undefined,
        };
      }
    });

    return grades;
  }, [currentResponse, manualGradingQuestions]);

  // Initialize grades when response changes (depends on response ID, not computed grades)
  useEffect(() => {
    if (!currentResponse) return;
    setGrades(initialGrades);
    setHasUnsavedChanges(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentResponse?._id]);

  const handlePointsChange = (questionId: string, points: number) => {
    setGrades((prev) => ({
      ...prev,
      [questionId]: {
        points,
        isGraded: true,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const calculateTotalPoints = () => {
    return Object.values(grades).reduce((sum, grade) => sum + (grade.points || 0), 0);
  };

  const calculatePreviousAutoGradedPoints = () => {
    if (!currentResponse) return 0;
    
    return currentResponse.answers
      .filter((answer) => {
        const question = manualGradingQuestions.find(
          (q) => q._id === answer.questionId.toString()
        );
        return !question; // Not a manual grading question
      })
      .reduce((sum, answer) => sum + (answer.pointsEarned || 0), 0);
  };

  const handleSaveGrades = async () => {
    if (!currentResponse) return;

    const answersToGrade = Object.entries(grades).map(([questionId, grade]) => ({
      questionId,
      isCorrect: grade.points > 0,
      pointsEarned: grade.points,
    }));

    try {
      await gradeResponseMutation.mutateAsync({
        responseId: currentResponse._id,
        answers: answersToGrade,
      });
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save grades:', error);
    }
  };

  const handleSaveAndNext = async () => {
    await handleSaveGrades();
    if (currentIndex < responses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Close modal after saving the last response
      onOpenChange(false);
    }
  };

  const handlePrevious = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Do you want to discard them?')) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
    } else {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const handleNext = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Do you want to discard them?')) {
        setCurrentIndex(Math.min(responses.length - 1, currentIndex + 1));
      }
    } else {
      setCurrentIndex(Math.min(responses.length - 1, currentIndex + 1));
    }
  };

  const allQuestionsGraded = useMemo(() => {
    return manualGradingQuestions.every((q) => 
      grades[q._id]?.isGraded
    );
  }, [grades, manualGradingQuestions]);

  const getAnswerForQuestion = (questionId: string) => {
    return currentResponse?.answers.find(
      (a) => a.questionId.toString() === questionId
    );
  };

  if (!currentResponse) {
    return null;
  }

  const newTotalScore = calculatePreviousAutoGradedPoints() + calculateTotalPoints();
  const newPercentage = currentResponse.maxScore > 0 
    ? (newTotalScore / currentResponse.maxScore) * 100 
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-white">
        {/* Header */}
        <DialogHeader className="bg-linear-to-r from-bio-500 to-bio-600 text-white px-6 py-4 shrink-0 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  Grade Essays & Short Answers
                </DialogTitle>
                <p className="text-sm text-white/80 mt-1">
                  {room.title} • {responses.length} {responses.length === 1 ? 'Response' : 'Responses'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <span className="text-sm font-medium">
                {currentIndex + 1} / {responses.length}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Student Info Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-bio-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-bio-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{currentResponse.studentInfo.name}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                  {currentResponse.studentInfo.lrn && (
                    <span>LRN: {currentResponse.studentInfo.lrn}</span>
                  )}
                  {currentResponse.studentInfo.section && (
                    <span>Section: {currentResponse.studentInfo.section}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.floor(currentResponse.totalTimeSpent / 60)}m {currentResponse.totalTimeSpent % 60}s
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === responses.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {manualGradingQuestions.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Manual Grading Required
              </h3>
              <p className="text-slate-600">
                This quiz doesn`t contain essay or short answer questions.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {manualGradingQuestions.map((question, index: number) => {
                const answer = getAnswerForQuestion(question._id);
                const currentGrade = grades[question._id] || { points: 0, isGraded: false };
                const maxPoints = question.points || 1;

                return (
                  <div
                    key={question._id}
                    className={`bg-white rounded-xl border-2 p-6 transition-all ${
                      currentGrade.isGraded
                        ? 'border-green-200 bg-green-50/30'
                        : 'border-slate-200 hover:border-bio-300'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-slate-500 uppercase">
                            Question {index + 1}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            question.questionType === QuestionType.ESSAY
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-teal-100 text-teal-700'
                          }`}>
                            {question.questionType === QuestionType.ESSAY ? 'Essay' : 'Short Answer'}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-slate-900 mb-3">
                          {question.questionText}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-bold text-slate-700">
                          Max: {maxPoints} {maxPoints === 1 ? 'point' : 'points'}
                        </span>
                      </div>
                    </div>

                    {/* Student Answer */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Student`s Answer:
                      </label>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[100px]">
                        <p className="text-slate-900 whitespace-pre-wrap">
                          {answer?.answer ? (
                            typeof answer.answer === 'string' ? answer.answer :
                            typeof answer.answer === 'boolean' ? String(answer.answer) :
                            Array.isArray(answer.answer) ? answer.answer.join(', ') :
                            JSON.stringify(answer.answer)
                          ) : (
                            <span className="text-slate-400 italic">No answer provided</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Grading Section */}
                    <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700">
                          Assign Points:
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-bio-600">
                            {currentGrade.points}
                          </span>
                          <span className="text-sm text-slate-500">
                            / {maxPoints}
                          </span>
                        </div>
                      </div>

                      <Slider
                        value={[currentGrade.points]}
                        onValueChange={(value) => handlePointsChange(question._id, value[0])}
                        max={maxPoints}
                        step={0.5}
                        className="w-full"
                      />

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>0 points</span>
                        <span>{maxPoints} points</span>
                      </div>

                      {currentGrade.isGraded && (
                        <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Graded</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Score Summary */}
        <div className="border-t border-slate-200 bg-white px-6 py-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-slate-500">Manual Grading Score</p>
                  <p className="text-xl font-bold text-bio-600">
                    {calculateTotalPoints()} points
                  </p>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <p className="text-xs text-slate-500">Auto-Graded Score</p>
                  <p className="text-xl font-bold text-slate-700">
                    {calculatePreviousAutoGradedPoints()} points
                  </p>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <p className="text-xs text-slate-500">New Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    {newTotalScore} / {currentResponse.maxScore}
                  </p>
                  <p className="text-xs text-slate-500">
                    {newPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!allQuestionsGraded && (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Some questions not graded</span>
                </div>
              )}
              
              <Button
                variant="outline"
                onClick={handleSaveGrades}
                disabled={!hasUnsavedChanges || gradeResponseMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>

              <Button
                onClick={handleSaveAndNext}
                disabled={gradeResponseMutation.isPending}
                className="bg-bio-600 hover:bg-bio-700"
              >
                {gradeResponseMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {currentIndex < responses.length - 1 ? 'Save & Next' : 'Save & Close'}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-green-500 h-full transition-all duration-300"
                style={{ 
                  width: `${((currentIndex + 1) / responses.length) * 100}%` 
                }}
              />
            </div>
            <span className="font-medium">
              {currentIndex + 1} of {responses.length} graded
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
