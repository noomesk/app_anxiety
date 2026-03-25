"use client";

const MASCOT_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDCHFLGYbTmTeRXf-l4i2c_lKxAEARQNoxKd8G5rIMV55h7IZ-fGysr5vsABWGh5N2gvlqMz5DVuGP7XxbommEpWngXEp5bxldLAfjQmdffkHWPymjBI5NbpWLogPqHKXvELnrNlEDhsDvcLs1NW249Dn-JFW0cS7teCcIU9nywiO641mZFcel8IHki2czZMRv9UqEiIY1YYakyZZLSNMoJ-25oEYEfScqGqBZ5VB929YunD7jJho9Gr3q3rMQl5TODcNxQ9F8fpUI";

const features = [
  {
    icon: "favorite",
    title: "Validación",
    description: "Tus emociones son válidas y merecen ser escuchadas",
  },
  {
    icon: "self_improvement",
    title: "Ejercicios",
    description: "Técnicas prácticas para manejar la ansiedad en el momento",
  },
  {
    icon: "handshake",
    title: "Apoyo",
    description: "Un acompañamiento empático entre sesiones terapéuticas",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-sanctuary-surface text-sanctuary-on-surface font-body flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-2xl w-full flex flex-col items-center text-center">
          {/* Mascot */}
          <div className="w-28 h-28 md:w-36 md:h-36 bg-sanctuary-primary-fixed-dim rounded-full flex items-center justify-center overflow-hidden mb-8 shadow-[0px_20px_40px_rgba(52,50,43,0.06)]">
            <img
              alt="Brotito — mascota suculenta amigable"
              className="w-full h-full object-cover"
              src={MASCOT_URL}
            />
          </div>

          {/* Title */}
          <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-sanctuary-on-surface tracking-tight mb-3">
            Acompañamiento para Ansiedad
          </h1>
          <p className="text-sanctuary-on-surface-variant text-lg md:text-xl leading-relaxed max-w-md mb-6">
            Tu espacio seguro entre sesiones terapéuticas
          </p>

          {/* Description */}
          <p className="text-sanctuary-on-surface-variant/80 text-base leading-relaxed max-w-lg mb-4">
            Esta aplicación está diseñada para acompañarte en momentos de ansiedad,
            validando tus emociones y proponiendo ejercicios terapéuticos breves
            basados en TCC, mindfulness y grounding.
          </p>
          <p className="text-sanctuary-primary font-medium italic text-base mb-12">
            "Un acompañamiento empático, siempre disponible cuando más lo necesitas"
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mb-14">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="bg-sanctuary-surface-container-lowest rounded-sanctuary-lg p-6 shadow-[0px_4px_20px_rgba(52,50,43,0.04)] hover:shadow-[0px_8px_30px_rgba(74,101,79,0.08)] transition-shadow duration-300 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-sanctuary-primary-container flex items-center justify-center mb-4">
                  <span
                    className="material-symbols-outlined text-sanctuary-on-primary-container text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {feat.icon}
                  </span>
                </div>
                <h3 className="font-headline text-lg font-bold text-sanctuary-primary mb-2">
                  {feat.title}
                </h3>
                <p className="text-sanctuary-on-surface-variant text-sm leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full max-w-sm h-16 bg-sanctuary-primary text-sanctuary-on-primary font-headline font-bold text-lg rounded-full shadow-[0px_10px_25px_rgba(74,101,79,0.2)] hover:bg-sanctuary-primary-dim active:scale-95 transition-all duration-200"
          >
            Comenzar mi acompañamiento
          </button>

          {/* Disclaimer */}
          <p className="mt-8 text-xs text-sanctuary-on-surface-variant/70 max-w-sm leading-relaxed">
            Esta aplicación es un acompañamiento entre sesiones terapéuticas,
            no reemplaza la terapia profesional.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-sanctuary-on-surface-variant/50 font-label tracking-wide">
          Desarrollado por noomesk. All rights reserved © 2026.
        </p>
      </footer>

      {/* Breathing Indicator */}
      <div className="fixed top-8 right-8 hidden lg:flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-sanctuary-primary-fixed-dim animate-breath opacity-40"></div>
        <span className="text-[10px] font-label uppercase tracking-widest text-sanctuary-on-surface-variant">
          Respira
        </span>
      </div>
    </div>
  );
};

export default Index;