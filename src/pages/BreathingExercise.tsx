import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BreathingExercise = () => {
  const [phase, setPhase] = useState<'Inhala' | 'Mantén' | 'Exhala'>('Inhala');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    let timeoutId: NodeJS.Timeout;

    const cycleBreathing = () => {
      setPhase('Inhala');
      timeoutId = setTimeout(() => {
        setPhase('Mantén');
        timeoutId = setTimeout(() => {
          setPhase('Exhala');
          timeoutId = setTimeout(cycleBreathing, 8000); // 8 seconds exhale
        }, 7000); // 7 seconds hold
      }, 4000); // 4 seconds inhale
    };

    cycleBreathing();

    return () => clearTimeout(timeoutId);
  }, [isActive]);

  return (
    <div className="bg-sanctuary-surface font-body text-sanctuary-on-surface min-h-screen flex flex-col selection:bg-sanctuary-primary-container">
      {/* Top Navigation Shell */}
      <header className="w-full sticky top-0 z-40 bg-sanctuary-surface flex justify-between items-center px-6 py-4 max-w-full mx-auto">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-sanctuary-surface-variant/50 transition-colors active:scale-95 duration-200"
            onClick={() => window.history.back()}
          >
            <span className="material-symbols-outlined text-sanctuary-primary">arrow_back</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-2xl font-semibold tracking-tight text-sanctuary-primary">
              Respiración 4-7-8
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-6 pt-12 pb-32 flex-1 w-full flex flex-col items-center justify-center space-y-12">
        <div className="text-center max-w-md">
          <p className="text-sanctuary-on-surface-variant text-lg">
            Sigue el ritmo del círculo para calmar tu sistema nervioso de forma natural.
          </p>
        </div>

        {/* Breathing Animation Container */}
        <div className="relative w-64 h-64 flex items-center justify-center mt-8">
          {/* Animated background circle */}
          <div
            className={`absolute w-full h-full rounded-full bg-sanctuary-primary/20 transition-all ease-in-out`}
            style={{
              transform: isActive
                ? phase === 'Inhala'
                  ? 'scale(1.5)'
                  : phase === 'Mantén'
                  ? 'scale(1.5)'
                  : 'scale(0.8)'
                : 'scale(1)',
              transitionDuration: isActive
                ? phase === 'Inhala'
                  ? '4000ms'
                  : phase === 'Mantén'
                  ? '7000ms'
                  : '8000ms'
                : '500ms',
            }}
          ></div>

          {/* Core circle with text */}
          <div className="relative z-10 w-48 h-48 rounded-full bg-sanctuary-primary flex flex-col items-center justify-center shadow-xl shadow-sanctuary-primary/30">
            <span className="text-sanctuary-on-primary font-headline text-3xl font-bold tracking-wider">
              {isActive ? phase : 'Listo'}
            </span>
            {isActive && (
              <span className="text-sanctuary-on-primary/70 text-sm mt-2 font-medium">
                {phase === 'Inhala' ? '4 segundos' : phase === 'Mantén' ? '7 segundos' : '8 segundos'}
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-16">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-10 py-4 rounded-full font-bold tracking-wide transition-all active:scale-95 shadow-lg ${
              isActive
                ? 'bg-sanctuary-surface-variant text-sanctuary-on-surface-variant hover:bg-sanctuary-surface-variant/80'
                : 'bg-sanctuary-primary text-sanctuary-on-primary hover:bg-sanctuary-primary/90 shadow-sanctuary-primary/20'
            }`}
          >
            {isActive ? 'Pausar ejercicio' : 'Comenzar a respirar'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default BreathingExercise;
