import React from 'react';
import { DISPLAY_PINS } from '../data/pinout';
import { SegmentId } from '../types';
import { sounds } from '../utils/audio';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Zap, Info } from 'lucide-react';

interface DigitalKeypadProps {
  currentDigit: number | null;
  onSelectDigit: (digit: number) => void;
  activeSegments: SegmentId[];
  eliminatedPins: number[];
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const DigitalKeypad: React.FC<DigitalKeypadProps> = ({
  currentDigit,
  onSelectDigit,
  activeSegments,
  eliminatedPins,
  isPlaying,
  onTogglePlay,
  onReset,
  onNext,
  onPrev,
}) => {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleDigitClick = (num: number) => {
    sounds.playClick();
    onSelectDigit(num);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
      {/* Header bar with status */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 tracking-wide">
              Panel de Botones Digitales
            </h2>
            <p className="text-xs text-slate-400">
              Selecciona un número para configurar el display y retirar patitas
            </p>
          </div>
        </div>

        {/* Selected digit pill */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-700/60 rounded-xl px-3 py-1.5">
          <span className="text-xs text-slate-400 font-medium">Valor:</span>
          <span className="font-mono text-lg font-bold text-amber-400">
            {currentDigit !== null ? currentDigit : 'MANUAL'}
          </span>
        </div>
      </div>

      {/* Primary 10 Digital Buttons (0 to 9) */}
      <div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {digits.map((num) => {
            const isSelected = currentDigit === num;
            return (
              <button
                key={num}
                id={`digital-btn-${num}`}
                type="button"
                onClick={() => handleDigitClick(num)}
                className={`group relative flex flex-col items-center justify-center py-3 px-2 rounded-xl font-mono transition-all duration-150 active:scale-95 ${
                  isSelected
                    ? 'bg-sky-500 text-white font-bold shadow-[0_0_16px_rgba(14,165,233,0.5)] ring-2 ring-sky-400 border border-sky-300'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 hover:border-slate-500'
                }`}
              >
                <span className="text-xl sm:text-2xl font-bold">{num}</span>
                <span className={`text-[10px] uppercase font-sans mt-0.5 tracking-wider ${
                  isSelected ? 'text-sky-100' : 'text-slate-400'
                }`}>
                  Dígito {num}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Playback & Step Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-prev-digit"
            onClick={() => {
              sounds.playClick();
              onPrev();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 active:scale-95 transition-all"
            title="Dígito anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Anterior</span>
          </button>

          <button
            type="button"
            id="btn-next-digit"
            onClick={() => {
              sounds.playClick();
              onNext();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 active:scale-95 transition-all"
            title="Dígito siguiente"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            id="btn-autoplay-digits"
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
              isPlaying
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>Pausar Secuencia</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auto-Secuencia (0-9)</span>
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          id="btn-reset-circuit"
          onClick={() => {
            sounds.playClick();
            onReset();
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-700/60 active:scale-95 transition-all"
          title="Restablecer circuito"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer (Dígito 8)</span>
        </button>
      </div>

      {/* Explanatory callout for selected digit and eliminated pins */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-slate-200">
              {currentDigit !== null ? (
                <>Para formar el número <span className="text-amber-400 font-bold">{currentDigit}</span>:</>
              ) : (
                <>Configuración personalizada libre:</>
              )}
            </div>
            <div className="text-slate-400 mt-0.5">
              {eliminatedPins.length === 0 ? (
                <span>No se elimina ninguna patita; todos los 7 segmentos permanecen alimentados.</span>
              ) : (
                <span>
                  Se debe <strong className="text-red-400">eliminar la conexión</strong> de las siguientes patitas del display para que sus LEDs queden apagados:{' '}
                  <strong className="text-slate-200 font-mono">
                    {eliminatedPins
                      .map((p) => {
                        const pinObj = DISPLAY_PINS.find((dp) => dp.pinNumber === p);
                        return `Pin ${p} (seg ${pinObj?.segment.toUpperCase()})`;
                      })
                      .join(', ')}
                  </strong>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
          <span className="text-[11px] text-slate-400">Segmentos activos:</span>
          <div className="flex gap-1 font-mono font-bold text-xs">
            {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((s) => {
              const active = activeSegments.includes(s as SegmentId);
              return (
                <span
                  key={s}
                  className={`w-5 h-5 flex items-center justify-center rounded ${
                    active
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-500 border border-slate-700/50'
                  }`}
                >
                  {s.toUpperCase()}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
