import React from 'react';
import { Link } from 'react-router-dom';

const MASCOT_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDCHFLGYbTmTeRXf-l4i2c_lKxAEARQNoxKd8G5rIMV55h7IZ-fGysr5vsABWGh5N2gvlqMz5DVuGP7XxbommEpWngXEp5bxldLAfjQmdffkHWPymjBI5NbpWLogPqHKXvELnrNlEDhsDvcLs1NW249Dn-JFW0cS7teCcIU9nywiO641mZFcel8IHki2czZMRv9UqEiIY1YYakyZZLSNMoJ-25oEYEfScqGqBZ5VB929YunD7jJho9Gr3q3rMQl5TODcNxQ9F8fpUI";

const Resources = () => {
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
              Recursos
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-6 pt-6 pb-32 flex-1 w-full space-y-8">
        
        {/* Brotito Greeting */}
        <section className="bg-sanctuary-surface-container-low rounded-sanctuary-xl p-6 shadow-sm border border-sanctuary-outline-variant/20 flex flex-col md:flex-row items-center gap-6">
          <img
            alt="Avatar de Brotito"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-md border-4 border-sanctuary-surface"
            src={MASCOT_URL}
          />
          <div className="text-center md:text-left">
            <h2 className="text-xl font-headline font-bold text-sanctuary-primary mb-2">
              Estoy aquí para ti.
            </h2>
            <p className="text-sanctuary-on-surface-variant leading-relaxed text-sm md:text-base">
              He preparado estas herramientas para ayudarte a encontrar calma en cualquier momento. 
              Si necesitas ayuda urgente, por favor usa el botón de emergencia.
            </p>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: SOS / Emergencias */}
          <div className="bg-red-50 hover:bg-red-100 transition-colors border border-red-100 rounded-sanctuary-xl p-5 flex flex-col cursor-pointer group active:scale-[0.98]">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600 group-hover:bg-red-200 transition-colors">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                emergency
              </span>
            </div>
            <h3 className="font-bold text-red-900 mb-1">SOS / Emergencias</h3>
            <p className="text-red-700/80 text-sm leading-relaxed mb-4">
              Números de ayuda inmediata y botón de pánico si estás en crisis profunda.
            </p>
            <div className="mt-auto flex justify-end">
              <span className="material-symbols-outlined text-red-500">arrow_forward</span>
            </div>
          </div>

          {/* Card 2: Ejercicios de alivio rápido */}
          <Link to="/resources/breathing" className="bg-sanctuary-surface-container-lowest hover:bg-sanctuary-surface-container transition-colors border border-sanctuary-outline-variant/30 rounded-sanctuary-xl p-5 flex flex-col cursor-pointer group active:scale-[0.98]">
            <div className="w-12 h-12 rounded-full bg-sanctuary-primary-container flex items-center justify-center mb-4 text-sanctuary-on-primary-container group-hover:bg-sanctuary-primary/20 transition-colors">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                air
              </span>
            </div>
            <h3 className="font-bold text-sanctuary-on-surface mb-1">Ejercicios de alivio rápido</h3>
            <p className="text-sanctuary-on-surface-variant text-sm leading-relaxed mb-4">
              Técnicas interactivas como respiración 4-7-8 y anclaje 5-4-3-2-1.
            </p>
            <div className="mt-auto flex justify-end">
              <span className="material-symbols-outlined text-sanctuary-primary">arrow_forward</span>
            </div>
          </Link>

          {/* Card 3: Paisaje Sonoro */}
          <div className="bg-sanctuary-surface-container-lowest hover:bg-sanctuary-surface-container transition-colors border border-sanctuary-outline-variant/30 rounded-sanctuary-xl p-5 flex flex-col cursor-pointer group active:scale-[0.98]">
            <div className="w-12 h-12 rounded-full bg-[#E8F0FE] flex items-center justify-center mb-4 text-[#1967D2] group-hover:bg-[#D2E3FC] transition-colors">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                headphones
              </span>
            </div>
            <h3 className="font-bold text-sanctuary-on-surface mb-1">Paisaje sonoro</h3>
            <p className="text-sanctuary-on-surface-variant text-sm leading-relaxed mb-4">
              Audios de ruido blanco, sonidos de naturaleza y meditaciones guiadas.
            </p>
            <div className="mt-auto flex justify-end">
              <span className="material-symbols-outlined text-[#1967D2]">arrow_forward</span>
            </div>
          </div>

          {/* Card 4: Psicoeducación */}
          <div className="bg-sanctuary-surface-container-lowest hover:bg-sanctuary-surface-container transition-colors border border-sanctuary-outline-variant/30 rounded-sanctuary-xl p-5 flex flex-col cursor-pointer group active:scale-[0.98]">
            <div className="w-12 h-12 rounded-full bg-[#FCE8E6] flex items-center justify-center mb-4 text-[#C5221F] group-hover:bg-[#FAD2CF] transition-colors">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                menu_book
              </span>
            </div>
            <h3 className="font-bold text-sanctuary-on-surface mb-1">Psicoeducación</h3>
            <p className="text-sanctuary-on-surface-variant text-sm leading-relaxed mb-4">
              Conoce más sobre la ansiedad, por qué ocurre y cómo tu mente trabaja.
            </p>
            <div className="mt-auto flex justify-end">
              <span className="material-symbols-outlined text-[#C5221F]">arrow_forward</span>
            </div>
          </div>

        </section>
      </main>

      {/* Global Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-4 bg-glass rounded-t-sanctuary-xl border-t border-sanctuary-outline-variant/15 shadow-[0px_-10px_30px_rgba(52,50,43,0.04)]">
        <Link
          className="flex flex-col items-center justify-center text-sanctuary-on-surface/60 px-6 py-2 hover:text-sanctuary-primary transition-all"
          to="/chat"
        >
          <span className="material-symbols-outlined">
            chat_bubble
          </span>
          <span className="font-label text-[12px] font-medium tracking-wide mt-1">Chat</span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center bg-sanctuary-primary-container text-sanctuary-on-primary-container rounded-full px-6 py-2 transition-all"
          to="/resources"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>library_books</span>
          <span className="font-label text-[12px] font-medium tracking-wide mt-1">Recursos</span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center text-sanctuary-on-surface/60 px-6 py-2 hover:text-sanctuary-primary transition-all"
          to="/profile"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="font-label text-[12px] font-medium tracking-wide mt-1">Perfil</span>
        </Link>
      </nav>
    </div>
  );
};

export default Resources;
