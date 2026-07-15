import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

export const FlashSaleCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 32,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset countdown to 6 hours for demo continuity
          return { hours: 5, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number): string => {
    return time.toString().padStart(2, '0');
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-rose-500/10 border border-rose-500/20 rounded-2xl p-6 shadow-md max-w-2xl mx-auto my-8">
      
      {/* Icon & Label */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white animate-bounce">
          <Flame className="w-5 h-5 fill-white" />
        </div>
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Nexus Flash Sale</h4>
          <p className="text-xs text-slate-500">Limited quantities remaining.</p>
        </div>
      </div>

      {/* Progress Line */}
      <div className="hidden sm:block flex-1 h-1 bg-rose-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-rose-500 w-3/4 animate-pulse-slow" />
      </div>

      {/* Timer Blocks */}
      <div className="flex items-center gap-2">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-lg shadow-inner">
            {formatTime(timeLeft.hours)}
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Hrs</span>
        </div>
        
        <span className="font-extrabold text-xl text-slate-800 dark:text-slate-200 mb-4">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-lg shadow-inner">
            {formatTime(timeLeft.minutes)}
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Min</span>
        </div>

        <span className="font-extrabold text-xl text-slate-800 dark:text-slate-200 mb-4">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center font-extrabold text-lg shadow-lg shadow-rose-500/20">
            {formatTime(timeLeft.seconds)}
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Sec</span>
        </div>
      </div>

    </div>
  );
};
