'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, MoveRight } from 'lucide-react';
import { IQuestion, QuestionType } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface QuestionRendererProps {
  question: IQuestion;
  questionNumber: number;
  totalQuestions: number;
  answer: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onAnswerChange: (answer: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function QuestionRenderer({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onAnswerChange,
}: QuestionRendererProps) {
  // Use answer prop directly, update only on explicit user interaction
  const [localAnswer, setLocalAnswer] = useState<any>(answer); // eslint-disable-line @typescript-eslint/no-explicit-any

  // Sync localAnswer when question changes
  useEffect(() => {
    if (question._id) {
      setLocalAnswer(answer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question._id]);

  const handleAnswerChange = (newAnswer: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    setLocalAnswer(newAnswer);
    onAnswerChange(newAnswer);
  };

  const renderMultipleChoice = () => {
    if (!question.choices || question.choices.length === 0) {
      return <p className="text-slate-500">No options available</p>;
    }

    return (
      <div className="space-y-3">
        {question.choices.map((option, index) => {
          const isSelected = localAnswer === option._id?.toString();
          
          return (
            <button
              key={option._id?.toString() || index}
              type="button"
              onClick={() => handleAnswerChange(option._id?.toString())}
              className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                isSelected
                  ? 'border-bio-500 bg-bio-50'
                  : 'border-slate-200 hover:border-bio-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'border-bio-500 bg-bio-500'
                    : 'border-slate-300'
                }`}>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-sm font-bold text-slate-600">
                      {String.fromCharCode(65 + index)}
                    </span>
                  )}
                </div>
                <span className={`flex-1 ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-700'}`}>
                  {option.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderTrueFalse = () => {
    return (
      <div className="space-y-3">
        {[
          { value: true, label: 'True' },
          { value: false, label: 'False' },
        ].map((option) => {
          const isSelected = localAnswer === option.value;
          
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => handleAnswerChange(option.value)}
              className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                isSelected
                  ? 'border-bio-500 bg-bio-50'
                  : 'border-slate-200 hover:border-bio-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'border-bio-500 bg-bio-500'
                    : 'border-slate-300'
                }`}>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <span className={`flex-1 text-lg ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-700'}`}>
                  {option.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderMatching = () => {
    if (!question.pairs || question.pairs.length === 0) {
      return <p className="text-slate-500">No pairs available</p>;
    }

    const currentAnswers = localAnswer || [];

    const handleMatchingChange = (leftValue: string, rightValue: string) => {
      const newAnswers = [...currentAnswers];
      const existingIndex = newAnswers.findIndex((a: any) => a.left === leftValue); // eslint-disable-line @typescript-eslint/no-explicit-any
      
      if (existingIndex >= 0) {
        newAnswers[existingIndex] = { left: leftValue, right: rightValue };
      } else {
        newAnswers.push({ left: leftValue, right: rightValue });
      }
      
      handleAnswerChange(newAnswers);
    };

    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600 mb-4">
          Match each item on the left with the correct item on the right:
        </p>
        {question.pairs.map((pair, index) => {
          const currentMatch = currentAnswers.find((a: any) => a.left === pair.left); // eslint-disable-line @typescript-eslint/no-explicit-any
          
          return (
            <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="flex-1 font-medium text-slate-900">{pair.left}</div>
              <MoveRight className="w-5 h-5 text-slate-400 shrink-0" />
              <select
                value={currentMatch?.right || ''}
                onChange={(e) => handleMatchingChange(pair.left, e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bio-500"
              >
                <option value="">Select match...</option>
                {question.pairs?.map((p, i) => (
                  <option key={i} value={p.right}>
                    {p.right}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    );
  };

  const renderFillInBlank = () => {
    if (!question.correctAnswers || question.correctAnswers.length === 0) {
      return <p className="text-slate-500">No blanks to fill</p>;
    }

    const currentAnswers = Array.isArray(localAnswer) ? localAnswer : [];

    const handleBlankChange = (index: number, value: string) => {
      const newAnswers = [...currentAnswers];
      newAnswers[index] = value;
      handleAnswerChange(newAnswers);
    };

    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600 mb-4">
          Fill in the blanks below:
        </p>
        {question.correctAnswers.map((_, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Blank {index + 1}
            </label>
            <Input
              type="text"
              value={currentAnswers[index] || ''}
              onChange={(e) => handleBlankChange(index, e.target.value)}
              placeholder={`Enter answer for blank ${index + 1}`}
              className="w-full"
            />
          </div>
        ))}
      </div>
    );
  };

  const renderShortAnswer = () => {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your Answer
        </label>
        <Textarea
          value={localAnswer || ''}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Type your answer here..."
          rows={4}
          className="w-full resize-none"
        />
        <p className="text-xs text-slate-500 mt-2">
          Write a concise answer (2-3 sentences recommended)
        </p>
      </div>
    );
  };

  const renderEssay = () => {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your Essay
        </label>
        <Textarea
          value={localAnswer || ''}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Write your detailed essay response here..."
          rows={10}
          className="w-full resize-none"
        />
        <p className="text-xs text-slate-500 mt-2">
          Provide a detailed and well-structured response
        </p>
      </div>
    );
  };

  const renderQuestionContent = () => {
    switch (question.questionType) {
      case QuestionType.MULTIPLE_CHOICE:
        return renderMultipleChoice();
      case QuestionType.TRUE_FALSE:
        return renderTrueFalse();
      case QuestionType.MATCHING:
        return renderMatching();
      case QuestionType.FILL_IN_BLANK:
        return renderFillInBlank();
      case QuestionType.SHORT_ANSWER:
        return renderShortAnswer();
      case QuestionType.ESSAY:
        return renderEssay();
      default:
        return <p className="text-slate-500">Unknown question type</p>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-600">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              question.difficulty === 'easy'
                ? 'bg-green-100 text-green-700'
                : question.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {question.difficulty}
            </span>
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
              {question.points} {question.points === 1 ? 'point' : 'points'}
            </span>
          </div>
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold text-slate-900">
          {question.questionText}
        </h3>
        
        {question.timeLimit && (
          <p className="text-sm text-slate-500 mt-2">
            Suggested time: {Math.floor(question.timeLimit / 60)} minutes
          </p>
        )}
      </div>

      {/* Question Content */}
      <div className="mb-6">
        {renderQuestionContent()}
      </div>

      {/* Answer Status Indicator */}
      <div className="pt-4 border-t border-slate-200">
        {localAnswer !== null && localAnswer !== undefined && localAnswer !== '' && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Answer saved</span>
          </div>
        )}
      </div>
    </div>
  );
}
