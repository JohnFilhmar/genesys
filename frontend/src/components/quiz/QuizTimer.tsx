'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface QuizTimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
  isActive?: boolean;
}

export default function QuizTimer({ totalSeconds, onTimeUp, isActive = true }: QuizTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [hasWarned5Min, setHasWarned5Min] = useState(false);
  const [hasWarned1Min, setHasWarned1Min] = useState(false);

  useEffect(() => {
    if (!isActive || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp]); // Removed remainingSeconds from dependencies

  // Show warnings at 5 minutes and 1 minute
  if (remainingSeconds === 300 && !hasWarned5Min) {
    setHasWarned5Min(true);
    console.log('⚠️ 5 minutes remaining!');
  }
  if (remainingSeconds === 60 && !hasWarned1Min) {
    setHasWarned1Min(true);
    console.log('⚠️ 1 minute remaining!');
  }

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Determine color based on time remaining
  const getTimerColor = () => {
    if (remainingSeconds <= 60) return 'text-red-600 bg-red-50 border-red-200';
    if (remainingSeconds <= 300) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-slate-700 bg-slate-50 border-slate-200';
  };

  const getIconColor = () => {
    if (remainingSeconds <= 60) return 'text-red-600';
    if (remainingSeconds <= 300) return 'text-yellow-600';
    return 'text-slate-600';
  };

  const showWarningIcon = remainingSeconds <= 300;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-mono font-bold transition-colors ${getTimerColor()}`}>
      {showWarningIcon ? (
        <AlertTriangle className={`w-5 h-5 ${getIconColor()} animate-pulse`} />
      ) : (
        <Clock className={`w-5 h-5 ${getIconColor()}`} />
      )}
      <span className="text-lg">{formattedTime}</span>
    </div>
  );
}
