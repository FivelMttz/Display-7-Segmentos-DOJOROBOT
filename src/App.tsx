import React, { useState, useEffect, useRef } from 'react';
import { DIGIT_PRESETS, DISPLAY_PINS } from './data/pinout';
import { EliminationMode, LedColor, SegmentId } from './types';
import { BreadboardCircuit } from './components/BreadboardCircuit';
import { DigitalKeypad } from './components/DigitalKeypad';
import { DisplayInspector } from './components/DisplayInspector';
import { TruthTable } from './components/TruthTable';
import { EducationalGuide } from './components/EducationalGuide';
import { sounds } from './utils/audio';
import { Cpu, Eye, Table as TableIcon, Sparkles, Cloud, Check, Copy, X } from 'lucide-react';

export default function App() {
  // Initial state: Start at digit 0 (where Pin 10 [G] is eliminated) to immediately showcase the feature
  const [currentDigit, setCurrentDigit] = useState<number | null>(0);
  const [activeSegments, setActiveSegments] = useState<SegmentId[]>(DIGIT_PRESETS[0].activeSegments);
  const [eliminatedPins, setEliminatedPins] = useState<number[]>(DIGIT_PRESETS[0].eliminatedPins);
  const [eliminationMode, setEliminationMode] = useState<EliminationMode>('remove_pin');
  const [ledColor, setLedColor] = useState<LedColor>('red');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'both' | 'table' | 'inspector'>('both');
  const [showRenderModal, setShowRenderModal] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Apply a digit configuration
  const handleSelectDigit = (digit: number) => {
    setCurrentDigit(digit);
    const preset = DIGIT_PRESETS[digit];
    if (preset) {
      setActiveSegments(preset.activeSegments);
      setEliminatedPins(preset.eliminatedPins);
    }
  };

  // Toggle a physical pin on the breadboard directly
  const handleTogglePin = (pinNumber: number) => {
    const pin = DISPLAY_PINS.find((p) => p.pinNumber === pinNumber);
    if (!pin || pin.segment === 'com') return; // Cannot toggle COM cathode pin

    let newEliminated: number[];
    let newSegments: SegmentId[];

    if (eliminatedPins.includes(pinNumber)) {
      // Re-connect the pin
      newEliminated = eliminatedPins.filter((p) => p !== pinNumber);
      newSegments = activeSegments.includes(pin.segment)
        ? activeSegments
        : [...activeSegments, pin.segment];
    } else {
      // Eliminate/disconnect the pin
      newEliminated = [...eliminatedPins, pinNumber];
      newSegments = activeSegments.filter((s) => s !== pin.segment);
    }

    setEliminatedPins(newEliminated);
    setActiveSegments(newSegments);

    // Check if this pattern matches any known digit
    const matched = Object.entries(DIGIT_PRESETS).find(([_, preset]) => {
      const segsMatch =
        preset.activeSegments.length === newSegments.filter((s) => s !== 'dp').length &&
        preset.activeSegments.every((s) => newSegments.includes(s));
      return segsMatch;
    });

    if (matched) {
      setCurrentDigit(Number(matched[0]));
    } else {
      setCurrentDigit(null); // Custom pattern
    }
  };

  // Toggle a segment on the 7-segment display
  const handleToggleSegment = (seg: SegmentId) => {
    const pin = DISPLAY_PINS.find((p) => p.segment === seg);
    if (pin) {
      handleTogglePin(pin.pinNumber);
    }
  };

  // Auto-cycle through digits 0 to 9
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentDigit((prev) => {
          const next = prev === null || prev >= 9 ? 0 : prev + 1;
          const preset = DIGIT_PRESETS[next];
          setActiveSegments(preset.activeSegments);
          setEliminatedPins(preset.eliminatedPins);
          sounds.playClick();
          return next;
        });
      }, 1600);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    }

    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying]);

  const handleNext = () => {
    const next = currentDigit === null || currentDigit >= 9 ? 0 : currentDigit + 1;
    handleSelectDigit(next);
  };

  const handlePrev = () => {
    const prev = currentDigit === null || currentDigit <= 0 ? 9 : currentDigit - 1;
    handleSelectDigit(prev);
  };

  const handleReset = () => {
    // Reset to digit 8 where all pins are connected
    handleSelectDigit(8);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 flex items-center justify-center shadow-lg shadow-sky-500/20 ring-1 ring-white/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-xl font-extrabold text-white tracking-wide font-sans">
                  DOJOROBOT
                </h1>
                <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-md shadow-sm">
                  Profesora: Bere
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase hidden sm:inline-block">
                  Display 7 Segmentos
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block mt-0.5">
                Simulador de display en protoboard • Desconexión física de patitas no conectadas
              </p>
            </div>
          </div>

          {/* Quick status badge & Render button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowRenderModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-semibold shadow-sm transition-all active:scale-95"
              title="Ver configuración para publicar en Render (onrender.com)"
            >
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span>Publicar en Render</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Patitas retiradas:</span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                {eliminatedPins.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Section 1: Digital Keypad Panel */}
        <section aria-label="Selector de dígitos">
          <DigitalKeypad
            currentDigit={currentDigit}
            onSelectDigit={handleSelectDigit}
            activeSegments={activeSegments}
            eliminatedPins={eliminatedPins}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onReset={handleReset}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </section>

        {/* Section 2: Breadboard Circuit Simulation */}
        <section aria-label="Circuito en protoboard" className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-semibold text-slate-200">
                Montaje en Protoboard (Tinkercad Circuits)
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Haz clic en cualquier patita o resistencia para desconectarla manualmente
            </span>
          </div>

          <BreadboardCircuit
            activeSegments={activeSegments}
            eliminatedPins={eliminatedPins}
            color={ledColor}
            eliminationMode={eliminationMode}
            onTogglePin={handleTogglePin}
            interactive={true}
          />
        </section>

        {/* Section 3: Detailed Inspector & Truth Table */}
        <section aria-label="Detalles y tabla lógica" className="flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h2 className="text-sm font-semibold text-slate-200">
              Análisis Lógico y Ajustes del Display
            </h2>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('both')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === 'both' ? 'bg-slate-800 text-sky-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Ambos
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('table')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === 'table' ? 'bg-slate-800 text-sky-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TableIcon className="w-3 h-3" />
                <span>Tabla</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('inspector')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === 'inspector' ? 'bg-slate-800 text-sky-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Display</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {(activeTab === 'both' || activeTab === 'table') && (
              <div className={activeTab === 'both' ? 'lg:col-span-7' : 'lg:col-span-12'}>
                <TruthTable
                  currentDigit={currentDigit}
                  onSelectDigit={handleSelectDigit}
                />
              </div>
            )}

            {(activeTab === 'both' || activeTab === 'inspector') && (
              <div className={activeTab === 'both' ? 'lg:col-span-5' : 'lg:col-span-12'}>
                <DisplayInspector
                  activeSegments={activeSegments}
                  eliminatedPins={eliminatedPins}
                  color={ledColor}
                  onChangeColor={setLedColor}
                  eliminationMode={eliminationMode}
                  onChangeEliminationMode={setEliminationMode}
                  onToggleSegment={handleToggleSegment}
                  soundEnabled={soundEnabled}
                  onToggleSound={() => setSoundEnabled(!soundEnabled)}
                />
              </div>
            )}
          </div>
        </section>

        {/* Section 4: Educational Guide */}
        <section aria-label="Guía educativa">
          <EducationalGuide />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-center text-xs text-slate-500">
        DOJOROBOT • Profesora: Bere • Simulador de LED de 7 Segmentos con Desconexión Física de Patitas en Protoboard
      </footer>

      {/* Modal de Configuración para Render */}
      {showRenderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Configuración para Render (onrender.com)</h3>
                  <p className="text-xs text-slate-400">Parámetros listos para crear tu Static Site gratuito</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRenderModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                El proyecto ya incluye <code className="text-emerald-400 font-mono">render.yaml</code>, <code className="text-emerald-400 font-mono">.nvmrc</code> (Node 20) y <code className="text-emerald-400 font-mono">_redirects</code>. Si lo creas manualmente en Render, utiliza estos valores:
              </p>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2.5 font-mono">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-sans">Tipo de Servicio:</span>
                    <span className="text-white font-semibold">Static Site (Sitio Estático)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-sans">100% Gratis</span>
                </div>

                <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-sans">Build Command:</span>
                    <span className="text-amber-300 font-semibold">npm install &amp;&amp; npm run build</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('npm install && npm run build');
                      setCopiedField('build');
                      setTimeout(() => setCopiedField(null), 2000);
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Copiar comando"
                  >
                    {copiedField === 'build' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-sans">Publish Directory:</span>
                    <span className="text-sky-300 font-semibold">dist</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('dist');
                      setCopiedField('dist');
                      setTimeout(() => setCopiedField(null), 2000);
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Copiar directorio"
                  >
                    {copiedField === 'dist' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-sans">Variable de Entorno (Recomendada):</span>
                    <span className="text-purple-300 font-semibold">NODE_VERSION = 20.18.0</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('20.18.0');
                      setCopiedField('node');
                      setTimeout(() => setCopiedField(null), 2000);
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Copiar versión Node"
                  >
                    {copiedField === 'node' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-sky-950/30 border border-sky-800/40 rounded-xl text-sky-200 leading-relaxed text-[11px]">
                💡 <strong>Consejo rápido:</strong> Si conectas tu repositorio a Render y seleccionas <strong>Blueprint</strong>, Render leerá el archivo <code className="font-mono">render.yaml</code> y aplicará todos estos ajustes en un solo clic.
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowRenderModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
