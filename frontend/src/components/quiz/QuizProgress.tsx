'use client';

import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
  onNavigate: (questionNumber: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export default function QuizProgress({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  onNavigate,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: QuizProgressProps) {
  const progressPercentage = (answeredQuestions.size / totalQuestions) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">
            Progress: {answeredQuestions.size} of {totalQuestions} answered
          </span>
          <span className="text-sm font-bold text-bio-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-bio-600 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
          const isAnswered = answeredQuestions.has(num);
          const isCurrent = num === currentQuestion;

          return (
            <button
              key={num}
              type="button"
              onClick={() => onNavigate(num)}
              className={`aspect-square rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all ${
                isCurrent
                  ? 'border-bio-600 bg-bio-600 text-white'
                  : isAnswered
                  ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50'
              }`}
              title={`Question ${num}${isAnswered ? ' (Answered)' : ''}`}
            >
              {isAnswered && !isCurrent ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                num
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            canGoPrevious
              ? 'text-slate-700 hover:bg-slate-100'
              : 'text-slate-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <div className="text-sm text-slate-600">
          Question <span className="font-bold text-slate-900">{currentQuestion}</span> of {totalQuestions}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            canGoNext
              ? 'bg-bio-600 text-white hover:bg-bio-700'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
