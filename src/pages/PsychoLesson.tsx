import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const lessonData: Record<string, any> = {
  '1': {
    title: 'El Guardián de tu Cuerpo',
    icon: 'water_drop',
    steps: [
      { text: '"Hola, soy Brotito. Antes de leer, nota cómo tus pies tocan el suelo. Estás a salvo aquí."', type: 'brotito' },
      { text: 'La ansiedad no es un error. Es como una alarma de humo muy sensible que vive en tu cerebro.', type: 'paragraph' },
      { text: 'A veces, mi sistema de alerta se activa aunque no haya peligro, ¡como una alarma de humo muy sensible!', type: 'paragraph' },
      { text: 'Interactúa con el brote para calmar la alarma.', type: 'interaction_1' },
      { text: 'Ese latido rápido de tu corazón es solo oxígeno moviéndose para darte fuerza. Tu cuerpo es asombroso.', type: 'fact' }
    ]
  },
  '2': {
    title: 'Lucha o Huida',
    icon: 'bolt',
    steps: [
      { text: '"Hola, soy Brotito. Tu corazón late rápido porque está enviando energía a tus músculos."', type: 'brotito' },
      { text: '¡Eres muy fuerte, aunque ahora te sientas frágil!', type: 'paragraph' },
      { text: 'Esta respuesta nos ayudaba a escapar de peligros en la naturaleza. Hoy, se activa con estrés moderno.', type: 'paragraph' },
      { text: 'Desliza hacia abajo para liberar la tensión de tus hombros.', type: 'interaction_2' },
      { text: 'La adrenalina se disipa cuando le dices a tu cuerpo que el peligro pasó.', type: 'fact' }
    ]
  },
  '3': {
    title: 'Mis Triggers',
    icon: 'cloud',
    steps: [
      { text: '"Brotito aquí: Vamos a identificar qué nubes grises suelen traer la lluvia. ¿Es el café? ¿El ruido? ¿Un pensamiento?"', type: 'brotito' },
      { text: 'Conocer lo que dispara tu ansiedad es el primer paso para predecir y normalizar tus crisis.', type: 'paragraph' },
      { text: 'Toca las nubes grises para iluminarlas con conocimiento.', type: 'interaction_3' },
      { text: 'No puedes evitar la lluvia siempre, pero puedes llevar un paraguas.', type: 'fact' }
    ]
  }
};

const PsychoLesson = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lesson = lessonData[id || '1'] || lessonData['1'];

  const [currentStep, setCurrentStep] = useState(0);
  const [interactionDone, setInteractionDone] = useState(false);
  const [clouds, setClouds] = useState([false, false, false]); // For interaction 3

  const progress = Math.min(((currentStep + 1) / lesson.steps.length) * 100, 100);
  
  const handleInteraction1 = () => setInteractionDone(true);
  
  const handleInteraction2 = (e: React.TouchEvent | React.MouseEvent) => {
    // Simple mock for swipe/drag
    setInteractionDone(true);
  };

  const handleCloudClick = (index: number) => {
    const newClouds = [...clouds];
    newClouds[index] = true;
    setClouds(newClouds);
    if (newClouds.every(c => c)) setInteractionDone(true);
  };

  const nextStep = () => {
    if (currentStep < lesson.steps.length - 1) {
      const isInteractionStep = lesson.steps[currentStep].type.startsWith('interaction');
      if (isInteractionStep && !interactionDone) return; // Block until interaction is done
      
      setCurrentStep(curr => curr + 1);
      setInteractionDone(false);
    }
  };

  return (
    <div className="bg-sanctuary-surface font-body text-sanctuary-on-surface min-h-screen flex flex-col">
      {/* Top Navigation */}
      <nav className="p-4 sticky top-0 z-40 bg-sanctuary-surface/90 backdrop-blur-md flex items-center justify-between border-b border-sanctuary-outline-variant/10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-sanctuary-surface-container flex items-center justify-center text-sanctuary-primary transition-colors hover:bg-sanctuary-surface-variant/50">
          <span className="material-symbols-outlined">close</span>
        </button>
        <span className="font-headline font-bold text-sanctuary-primary/90 text-[15px] mr-2">
          Aprendiendo con Brotito
        </span>
      </nav>

      {/* Progress Bar (Watering the seed) */}
      <div className="w-full h-1.5 bg-sanctuary-surface-variant sticky top-[73px] z-40">
        <div 
          className="h-full bg-sanctuary-primary transition-all duration-500 ease-out flex justify-end items-center relative"
          style={{ width: `${progress}%` }}
        >
          {/* Water drop following the progress */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-[#8eb295] rounded-full blur-[2px] opacity-60"></div>
          <span className="material-symbols-outlined absolute right-[-8px] text-[18px] text-[#A2C7A9]">water_drop</span>
        </div>
      </div>

      <main className="px-6 pt-8 pb-32 max-w-xl mx-auto flex-1 w-full space-y-8">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-sanctuary-primary-container rounded-full mx-auto mb-4 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-4xl text-sanctuary-primary">{lesson.icon}</span>
          </div>
          <h2 className="font-headline text-2xl font-bold text-sanctuary-on-surface">
            {lesson.title}
          </h2>
        </div>

        {/* Steps Reveal Logic */}
        <div className="space-y-6">
          {lesson.steps.slice(0, currentStep + 1).map((step: any, index: number) => {
            const isLatest = index === currentStep;
            
            return (
              <div 
                key={index} 
                className={`transition-all duration-700 transform origin-top ${isLatest ? 'opacity-100 translate-y-0' : 'opacity-80 scale-[0.98]'}`}
              >
                {step.type === 'brotito' && (
                  <div className="bg-sanctuary-primary/10 p-5 rounded-[24px] rounded-tl-sm border-l-4 border-sanctuary-primary shadow-sm flex gap-4">
                    <span className="text-2xl mt-1">🌱</span>
                    <p className="text-sanctuary-on-surface-variant italic font-medium leading-relaxed">{step.text}</p>
                  </div>
                )}

                {step.type === 'paragraph' && (
                  <p className="text-sanctuary-on-surface-variant leading-relaxed text-lg px-2">
                    {step.text}
                  </p>
                )}

                {step.type === 'fact' && (
                  <div className="bg-sanctuary-surface-container-high p-6 rounded-[24px] text-center shadow-sm">
                    <p className="text-sm font-bold text-sanctuary-primary mb-1 inline-flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">lightbulb</span> Dato curioso:
                    </p>
                    <p className="text-sanctuary-on-surface-variant text-[15px]">{step.text}</p>
                  </div>
                )}

                {/* --- Interactions --- */}
                {step.type === 'interaction_1' && (
                  <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[32px] flex flex-col items-center justify-center gap-6 mt-4 transition-all">
                    <p className="text-blue-900/80 font-medium text-center text-sm">{step.text}</p>
                    <button 
                      onClick={handleInteraction1}
                      className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700 ease-bounce shadow-xl ${interactionDone ? 'bg-sanctuary-primary scale-110 shadow-sanctuary-primary/40' : 'bg-white hover:scale-105 active:scale-95'}`}
                    >
                      <span className="text-4xl drop-shadow-md">{interactionDone ? '🌱' : '🌰'}</span>
                    </button>
                    {interactionDone && <p className="text-sanctuary-primary font-bold animate-pulse text-sm">¡Alarma en calma!</p>}
                  </div>
                )}

                {step.type === 'interaction_2' && (
                  <div className="bg-orange-50/50 border border-orange-100 p-8 rounded-[32px] flex flex-col items-center justify-center gap-6 mt-4 overflow-hidden relative"
                       onPointerDown={handleInteraction2} // Simplification for demo
                  >
                    <p className="text-orange-900/80 font-medium text-center text-sm z-10">{step.text}</p>
                    <div className="w-16 h-32 bg-white/60 rounded-full border-2 border-dashed border-orange-200 flex flex-col justify-start items-center p-2 z-10">
                       <div className={`w-12 h-12 bg-orange-400 rounded-full shadow-md text-white flex items-center justify-center transition-all duration-1000 ${interactionDone ? 'translate-y-16 opacity-0 scale-50' : 'animate-bounce'}`}>
                         <span className="material-symbols-outlined">south</span>
                       </div>
                    </div>
                    {interactionDone && <p className="text-sanctuary-primary font-bold text-sm z-10 absolute bottom-6">¡Tensión liberada! 🌿</p>}
                  </div>
                )}

                {step.type === 'interaction_3' && (
                  <div className="bg-slate-50 border border-slate-100 p-8 rounded-[32px] flex flex-col items-center justify-center gap-6 mt-4">
                     <p className="text-slate-600 font-medium text-center text-sm">{step.text}</p>
                     <div className="flex gap-4">
                        {[0, 1, 2].map(idx => (
                          <button 
                            key={idx} 
                            onClick={() => handleCloudClick(idx)}
                            className={`text-4xl transition-all duration-500 hover:scale-110 ${clouds[idx] ? 'scale-110 drop-shadow-lg' : 'grayscale opacity-60'}`}
                          >
                            {clouds[idx] ? '☀️' : '🌧️'}
                          </button>
                        ))}
                     </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer Navigation / Next Button fixed */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-sanctuary-surface via-sanctuary-surface to-transparent z-40 pb-8">
        {currentStep < lesson.steps.length - 1 ? (
          <button 
            onClick={nextStep}
            disabled={lesson.steps[currentStep].type.startsWith('interaction') && !interactionDone}
            className="w-full max-w-md mx-auto block bg-sanctuary-primary text-sanctuary-on-primary py-4 rounded-full font-headline font-bold shadow-lg shadow-sanctuary-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">water_drop</span>
            Regar para continuar
          </button>
        ) : (
          <button 
            onClick={() => navigate(-1)}
            className="w-full max-w-md mx-auto block bg-[#5c7a61] text-white py-4 rounded-full font-headline font-bold shadow-xl shadow-[#5c7a61]/30 active:scale-95 transition-all"
          >
            ✨ He regado mi semilla (Terminar)
          </button>
        )}
      </div>
    </div>
  );
};

export default PsychoLesson;
