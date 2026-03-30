import React from 'react';
import { Link } from 'react-router-dom';

const EmergencyContacts = () => {
  return (
    <div className="bg-red-50 font-body text-red-950 min-h-screen flex flex-col">
      {/* Top Navigation Shell */}
      <header className="w-full sticky top-0 z-40 bg-red-50/90 backdrop-blur-sm flex justify-between items-center px-6 py-4 max-w-full mx-auto border-b border-red-100/50">
        <div className="flex items-center gap-4">
          <Link
            to="/resources"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-red-100 transition-colors active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-red-700">arrow_back</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-600 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              emergency
            </span>
            <h1 className="font-headline text-xl font-bold tracking-tight text-red-800">
              SOS / Emergencias
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-6 pt-6 pb-24 flex-1 w-full space-y-6">
        
        {/* Urgent Info */}
        <section className="bg-white rounded-sanctuary-xl p-6 shadow-[0px_10px_30px_rgba(220,38,38,0.05)] border border-red-100 flex flex-col gap-4">
          <h2 className="text-lg font-headline font-bold text-red-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500">warning</span>
            Atención Inmediata (Colombia)
          </h2>
          <p className="text-red-900/80 leading-relaxed text-sm">
            Para una crisis inmediata (ideación suicida, ansiedad extrema o riesgo vital), la <strong>Línea 123</strong> es el número nacional único de emergencias que conecta con todos los servicios del Estado las 24 horas.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <a href="tel:123" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-600/20 active:scale-95">
              <span className="material-symbols-outlined">call</span>
              Llamar al 123
            </a>
            <a href="tel:192" className="w-full bg-white hover:bg-red-50 text-red-700 border-2 border-red-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95">
              <span className="material-symbols-outlined">support_agent</span>
              Línea 192 (Opción 4)
            </a>
          </div>
        </section>

        {/* Specific Mental Health Lines */}
        <section className="bg-white rounded-sanctuary-xl p-6 shadow-[0px_10px_30px_rgba(220,38,38,0.05)] border border-red-100">
          <h3 className="font-bold text-red-800 mb-4 text-base border-b border-red-50 pb-2">Líneas de Salud Mental Específicas (24/7)</h3>
          <ul className="space-y-4">
            <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-red-50/50 rounded-lg">
              <div>
                <p className="font-bold text-red-900">Línea Salvavidas</p>
                <p className="text-xs text-red-800/70">Fundación Sergio Urrego. Contención en crisis y riesgo de suicidio.</p>
              </div>
              <div className="flex gap-2">
                <a href="tel:3117668666" className="w-10 h-10 bg-white text-red-600 rounded-full flex items-center justify-center shadow-sm border border-red-100 hover:bg-red-50 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </a>
                <a href="https://wa.me/573117668666" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </a>
              </div>
            </li>
            
            <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-red-50/50 rounded-lg">
              <div>
                <p className="font-bold text-red-900">Línea 106</p>
                <p className="text-xs text-red-800/70">Escucha y orientación (Bogotá, Valle, Ant, Boyacá). Posible contacto WA: 300 754 8933.</p>
              </div>
              <a href="tel:106" className="flex items-center gap-2 text-red-700 bg-white border border-red-200 px-4 py-2 rounded-full font-medium text-sm hover:bg-red-50">
                <span className="material-symbols-outlined text-[18px]">call</span> Marcar 106
              </a>
            </li>

            <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-red-50/50 rounded-lg">
              <div>
                <p className="font-bold text-red-900">Línea Calma</p>
                <p className="text-xs text-red-800/70">Atención gratuita para hombres con ira, celos o crisis.</p>
              </div>
              <a href="tel:018000423614" className="flex items-center gap-2 text-red-700 bg-white border border-red-200 px-4 py-2 rounded-full font-medium text-sm hover:bg-red-50">
                <span className="material-symbols-outlined text-[18px]">call</span> 01 8000 423 614
              </a>
            </li>

            <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-red-50/50 rounded-lg">
              <div>
                <p className="font-bold text-red-900">Línea Diversa</p>
                <p className="text-xs text-red-800/70">Orientación psicosocial comunidad LGBTIQ+ (Bogotá).</p>
              </div>
              <a href="https://wa.me/573108644214" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#25D366] bg-white border border-green-100 px-4 py-2 rounded-full font-medium text-sm hover:bg-green-50">
                <span className="material-symbols-outlined text-[18px]">chat</span> 310 864 4214
              </a>
            </li>
          </ul>
        </section>

        {/* Protection to Specific Groups */}
        <section className="bg-white rounded-sanctuary-xl p-6 shadow-[0px_10px_30px_rgba(220,38,38,0.05)] border border-red-100">
          <h3 className="font-bold text-red-800 mb-4 text-base border-b border-red-50 pb-2">Protección a Grupos Específicos</h3>
          <ul className="space-y-4">
            <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#FCE8E6] rounded-lg">
              <div>
                <p className="font-bold text-[#C5221F]">Violencia contra la mujer (Línea Púrpura)</p>
                <p className="text-xs text-[#C5221F]/80">Atención 24 horas.</p>
              </div>
              <div className="flex gap-2">
                <a href="tel:018000112137" className="w-10 h-10 bg-white text-[#C5221F] rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </a>
                <a href="https://wa.me/573007551846" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </a>
              </div>
            </li>
            
            <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-bold text-blue-900">NNA (ICBF)</p>
                <p className="text-xs text-blue-800/70">Violencia contra niños, niñas y adolescentes. Protección inmediata.</p>
              </div>
              <div className="flex gap-2">
                <a href="tel:141" className="flex items-center gap-2 text-blue-700 bg-white border border-blue-200 px-4 py-2 rounded-full font-medium text-sm hover:bg-blue-50">
                  <span className="material-symbols-outlined text-[18px]">call</span> 141
                </a>
              </div>
            </li>
          </ul>
        </section>

        {/* Regional Support */}
        <section className="bg-white rounded-sanctuary-xl p-6 shadow-[0px_10px_30px_rgba(220,38,38,0.05)] border border-red-100">
          <h3 className="font-bold text-red-800 mb-4 text-base border-b border-red-50 pb-2">Atención Regional Complementaria</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-sm">
              <span className="font-bold text-red-900 block">Medellín: Línea Amiga Saludable</span>
              <a href="tel:6044444448" className="text-red-600 hover:underline">(604) 444 44 48</a> <br/>
              WA: <a href="https://wa.me/573007231123" target="_blank" className="text-green-600 hover:underline">300 723 1123</a>
            </div>
            <div className="text-sm">
              <span className="font-bold text-red-900 block">Barranquilla: Línea de la Vida</span>
              <a href="tel:53399999" className="text-red-600 hover:underline">(5) 339 99 99</a>
            </div>
            <div className="text-sm">
              <span className="font-bold text-red-900 block">Cali: Atención Gratuita</span>
              <a href="tel:106" className="text-red-600 hover:underline">106</a> | <a href="tel:3153002003" className="text-red-600 hover:underline">315 300 2003</a>
            </div>
            <div className="text-sm">
              <span className="font-bold text-red-900 block">Cartagena: Línea de la Vida</span>
              <a href="tel:6053399999" className="text-red-600 hover:underline">(605) 339 99 99</a> <br/>
              WA: <a href="https://wa.me/573104420195" target="_blank" className="text-green-600 hover:underline">310 442 0195</a>
            </div>
            <div className="text-sm md:col-span-2">
              <span className="font-bold text-red-900 block">Villavicencio:</span>
              <a href="tel:775" className="text-red-600 hover:underline">#775</a> | <a href="tel:3125751235" className="text-red-600 hover:underline">312 575 1235</a> | Línea "Estamos Contigo" <a href="tel:018000931035" className="text-red-600 hover:underline">01 8000 931 035</a>
            </div>
          </div>
        </section>

        {/* Final Disclaimer */}
        <div className="bg-red-900 text-red-50 p-6 rounded-sanctuary-xl shadow-lg mt-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-red-300">local_hospital</span>
          <p className="text-sm leading-relaxed">
            Si no hay respuesta telefónica o la situación es de peligro inminente, <strong className="text-white">acude directamente a la Sala de Emergencias más cercana</strong> de tu EPS o institución de salud. No existen botones de pánico físicos universales, pero servicios de WhatsApp (como <strong>Fundación Sergio Urrego</strong> o <strong>Línea 106</strong>) permiten enviar tu ubicación y un texto de auxilio en silencio.
          </p>
        </div>

      </main>
    </div>
  );
};

export default EmergencyContacts;
