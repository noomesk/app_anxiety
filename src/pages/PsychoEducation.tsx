import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Data structure for the capsules
const capsules = [
  {
    id: '1',
    title: '¿Qué es la Ansiedad?',
    emojiTop: '⚠️',
    seedState: 'root', // 'seed', 'root', 'sprout'
    progress: 40,      // percentage 0-100
    locked: false,
  },
  {
    id: '2',
    title: 'Lucha o Huida',
    emojiTop: '💪',
    seedState: 'sprout',
    progress: 80,
    locked: false,
  },
  {
    id: '3',
    title: 'Mis Triggers',
    emojiTop: '🌧️',
    seedState: 'seed',
    progress: 0,
    locked: false,
  },
  {
    id: '4',
    title: 'Catastrofismo',
    emojiTop: '🏢',
    seedState: 'seed',
    progress: 0,
    locked: false,
  },
  {
    id: '5',
    title: 'Ciclo de Evitación',
    emojiTop: '🪹',
    seedState: 'seed',
    progress: 0,
    locked: false,
  },
  {
    id: '6',
    title: 'Higiene del Sueño',
    emojiTop: '🌙',
    seedState: 'seed',
    progress: 0,
    locked: false,
  }
];

const MASCOT_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDCHFLGYbTmTeRXf-l4i2c_lKxAEARQNoxKd8G5rIMV55h7IZ-fGysr5vsABWGh5N2gvlqMz5DVuGP7XxbommEpWngXEp5bxldLAfjQmdffkHWPymjBI5NbpWLogPqHKXvELnrNlEDhsDvcLs1NW249Dn-JFW0cS7teCcIU9nywiO641mZFcel8IHki2czZMRv9UqEiIY1YYakyZZLSNMoJ-25oEYEfScqGqBZ5VB929YunD7jJho9Gr3q3rMQl5TODcNxQ9F8fpUI";

const PsychoEducation = () => {
  return (
    <div className="bg-sanctuary-surface font-body text-sanctuary-on-surface min-h-screen flex flex-col selection:bg-sanctuary-primary-container">
      {/* Top Header */}
      <header className="w-full sticky top-0 z-40 bg-sanctuary-surface/90 backdrop-blur-md flex justify-between items-center px-4 py-4 mx-auto border-b border-sanctuary-outline-variant/10">
        <div className="flex items-center gap-3">
          <Link
            to="/resources"
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-sanctuary-surface-variant/50 transition-colors"
          >
            <span className="material-symbols-outlined text-sanctuary-primary">arrow_back</span>
          </Link>
          <img
            alt="Brotito"
            className="w-8 h-8 rounded-full object-cover bg-sanctuary-primary-container"
            src={MASCOT_URL}
          />
          <div className="flex flex-col">
            <span className="font-headline font-bold text-sanctuary-primary text-sm leading-tight">Brotito</span>
            <span className="text-[10px] uppercase font-bold text-sanctuary-on-surface-variant tracking-wider leading-none">Online Now</span>
          </div>
        </div>
        <button className="w-8 h-8 rounded-full bg-sanctuary-surface-variant/50 flex items-center justify-center text-sanctuary-on-surface-variant">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto px-6 pt-8 pb-32 flex-1 w-full space-y-8 text-center">
        
        {/* Title */}
        <div>
          <h1 className="font-headline text-3xl font-bold text-sanctuary-on-surface mb-3 tracking-tight">
            Biblioteca de Brotito:<br />Psicoeducación<br />Interactiva
          </h1>
          <p className="text-sanctuary-on-surface-variant leading-relaxed text-[15px]">
            ¡Hola! Ayúdame a crecer estas semillas de conocimiento. Cada una te ayudará a entender mejor tu mente.
          </p>
        </div>

        {/* Grid of Capsules */}
        <section className="grid grid-cols-2 gap-4 text-left">
          {capsules.map((cap) => (
            <Link
              to={cap.locked ? "#" : `/resources/psychoeducation/${cap.id}`}
              key={cap.id}
              className={`relative bg-[#f4ebd9]/80 rounded-[24px] p-5 flex flex-col cursor-pointer transition-all active:scale-95 ${
                cap.locked ? "opacity-60 cursor-not-allowed grayscale-[0.2]" : "hover:bg-[#f4ebd9] shadow-sm"
              }`}
            >
              {/* Top Right Emoji */}
              <div className="absolute top-4 right-4 text-xl opacity-80">
                {cap.emojiTop}
              </div>

              {/* Center Seed Icon */}
              <div className="flex-1 flex items-center justify-center mt-3 mb-4">
                <span className="text-5xl drop-shadow-sm filter">
                  {cap.seedState === 'sprout' ? '🌱' : '🌰'}
                </span>
              </div>

              {/* Title and Progress */}
              <div className="mt-auto text-center">
                <h3 className="font-headline font-bold text-sanctuary-on-surface leading-tight mb-3 mx-1">
                  {cap.title}
                </h3>
                {cap.progress > 0 && (
                  <div className="w-full h-1.5 bg-sanctuary-outline-variant/20 rounded-full overflow-hidden mx-auto max-w-[80%]">
                    <div 
                      className="bg-[#5c7a61] h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${cap.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </section>

        {/* Helper Badge */}
        <div className="inline-block mt-4 bg-sanctuary-surface-variant/40 border border-sanctuary-outline-variant/20 px-6 py-3 rounded-full text-sm font-medium text-sanctuary-on-surface-variant">
          Toca una semilla para empezar a crecer
        </div>

      </main>

      {/* Floating Chat Prompt */}
      <Link to="/chat" className="fixed bottom-24 left-6 right-6 max-w-md mx-auto bg-sanctuary-surface-container-low/90 backdrop-blur-md rounded-[32px] p-4 flex items-center gap-4 shadow-xl border border-sanctuary-outline-variant/20 cursor-pointer hover:bg-sanctuary-surface-container-low transition-colors group">
        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-sanctuary-outline-variant/10 group-hover:bg-sanctuary-surface">
          <span className="material-symbols-outlined text-sanctuary-on-surface-variant text-xl">add</span>
        </button>
        <p className="flex-1 text-sm text-sanctuary-on-surface-variant/80 text-left">Pregúntale a Brotito sobre tus semillas...</p>
        <button className="w-10 h-10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-sanctuary-on-surface-variant group-hover:text-sanctuary-primary">mic</span>
        </button>
      </Link>

      {/* Global Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-4 bg-sanctuary-surface/95 backdrop-blur-xl rounded-t-[32px] border-t border-sanctuary-outline-variant/15 shadow-[0px_-10px_30px_rgba(52,50,43,0.04)]">
        <Link className="flex flex-col items-center justify-center text-sanctuary-on-surface/40 px-6 py-2 transition-all hover:text-sanctuary-on-surface/80" to="/chat">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
          <span className="text-[10px] font-bold mt-1 uppercase">Chat</span>
        </Link>
        <Link className="flex flex-col items-center text-sanctuary-on-primary-container px-6 py-2" to="/resources">
          <div className="bg-[#5c7a61] text-white px-8 py-2 rounded-full flex flex-col items-center shadow-md">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>library_books</span>
            <span className="text-[10px] font-bold mt-1 uppercase">Resources</span>
          </div>
        </Link>
        <Link className="flex flex-col items-center justify-center text-sanctuary-on-surface/40 px-6 py-2 transition-all hover:text-sanctuary-on-surface/80" to="/profile">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <span className="text-[10px] font-bold mt-1 uppercase">Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default PsychoEducation;
