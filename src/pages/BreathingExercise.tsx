import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BreathingExercise = () => {
  const [phase, setPhase] = useState<'Inhala' | 'Mantén' | 'Exhala'>('Inhala');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(4); // Starts with Inhale (4s)

  const playZenChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      // Calming 432Hz frequency
      osc.frequency.setValueAtTime(432, ctx.currentTime);
      
      // Soft envelope (Attack / Decay)
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1); 
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 3);
    } catch (e) {
      console.warn("Audio playback issue", e);
    }
  };

  useEffect(() => {
    if (!isActive) return;

    // A single interval running every 1000ms
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          // Transition to next phase
          playZenChime();
          setPhase((currentPhase) => {
            if (currentPhase === 'Inhala') {
              setTimeLeft(7);
              return 'Mantén';
            } else if (currentPhase === 'Mantén') {
              setTimeLeft(8);
              return 'Exhala';
            } else {
              setTimeLeft(4);
              return 'Inhala';
            }
          });
          return 0; // Temporary return, overriden by setTimeLeft inside setPhase, but technically React batches this.
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isActive]);

  const toggleExercise = () => {
    if (!isActive) {
      setPhase('Inhala');
      setTimeLeft(4);
      playZenChime(); // Initial chime
    }
    setIsActive(!isActive);
  };

  return (
    <div className="bg-sanctuary-surface font-body text-sanctuary-on-surface min-h-screen flex flex-col selection:bg-sanctuary-primary-container">
      {/* Top Navigation Shell */}
      <header className="w-full sticky top-0 z-40 bg-sanctuary-surface flex justify-between items-center px-6 py-4 max-w-full mx-auto">
        <div className="flex items-center gap-4">
          <Link
            to="/resources"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-sanctuary-surface-variant/50 transition-colors active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-sanctuary-primary">arrow_back</span>
          </Link>
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
              <span className="text-sanctuary-on-primary/90 text-2xl mt-1 font-bold">
                {timeLeft}s
              </span>
            )}
            {!isActive && (
              <span className="text-sanctuary-on-primary/70 text-sm mt-2 font-medium">
                Toca Comenzar
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-16">
          <button
            onClick={toggleExercise}
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
