import React from 'react';
import { Cpu, HelpCircle, Lightbulb, CheckCircle2 } from 'lucide-react';

export const EducationalGuide: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-300">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Fundamentos del Circuito y Eliminación de Patitas
          </h3>
          <p className="text-xs text-slate-400">
            Cómo funciona el display de 7 segmentos sin decodificador
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Card 1 */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold text-slate-200">
            <Cpu className="w-4 h-4 text-sky-400 shrink-0" />
            <span>¿Por qué retirar o eliminar patitas?</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Un display de 7 segmentos contiene <strong className="text-slate-200">7 u 8 LEDs individuales</strong> (A-G y DP) unidos a un terminal común (Pin 3 o Pin 8). Al conectarlo directamente a una batería sin un circuito integrado decodificador (como el CD4511 o 7447), la única manera de apagar los segmentos no deseados es <strong className="text-amber-400">interrumpir el circuito físico</strong> retirando la patita o su resistencia correspondiente.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Configuración en Protoboard</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            En el montaje de Tinkercad mostrado, la patita central inferior (<strong className="text-pink-400">Pin 3</strong>) va al riel negativo (GND) mediante el cable rosa. Las demás patitas van conectadas al riel positivo (+4.5V) a través de resistencias de protección (330Ω) para evitar que los LEDs se quemen.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold text-slate-200">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Ejemplo Práctico</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Para formar el número <strong className="text-amber-400 font-mono text-sm">3</strong>, se necesitan los segmentos <strong className="text-slate-200">A, B, C, D y G</strong>. Por lo tanto, se deben desconectar o eliminar las patitas de los segmentos <strong className="text-red-400">E (Pin 1)</strong> y <strong className="text-red-400">F (Pin 9)</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
