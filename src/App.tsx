import React, { useState, useEffect, useRef } from 'react';
import { DIGIT_PRESETS, DISPLAY_PINS } from './data/pinout';
import { EliminationMode, LedColor, SegmentId } from './types';
import { BreadboardCircuit } from './components/BreadboardCircuit';
import { DigitalKeypad } from './components/DigitalKeypad';
import { DisplayInspector } from './components/DisplayInspector';
import { TruthTable } from './components/TruthTable';
import { EducationalGuide } from './components/EducationalGuide';
import { sounds } from './utils/audio';
import { Cpu, Eye, Table as TableIcon, Sparkles } from 'lucide-react';

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

          {/* Quick status badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
              <span className="text-xs text-slate-400 font-medium">Patitas retiradas:</span>
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
    </div>
  );
}
