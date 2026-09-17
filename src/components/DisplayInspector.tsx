import React from 'react';
import { DISPLAY_PINS } from '../data/pinout';
import { EliminationMode, LedColor, SegmentId } from '../types';
import { SevenSegmentLed } from './SevenSegmentLed';
import { Settings, Eye, Sliders, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../utils/audio';

interface DisplayInspectorProps {
  activeSegments: SegmentId[];
  eliminatedPins: number[];
  color: LedColor;
  onChangeColor: (color: LedColor) => void;
  eliminationMode: EliminationMode;
  onChangeEliminationMode: (mode: EliminationMode) => void;
  onToggleSegment: (segment: SegmentId) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const DisplayInspector: React.FC<DisplayInspectorProps> = ({
  activeSegments,
  eliminatedPins,
  color,
  onChangeColor,
  eliminationMode,
  onChangeEliminationMode,
  onToggleSegment,
  soundEnabled,
  onToggleSound,
}) => {
  const colors: { id: LedColor; label: string; bg: string }[] = [
    { id: 'red', label: 'Rojo', bg: 'bg-red-500' },
    { id: 'green', label: 'Verde', bg: 'bg-emerald-500' },
    { id: 'blue', label: 'Azul', bg: 'bg-blue-500' },
    { id: 'amber', label: 'Ámbar', bg: 'bg-amber-500' },
    { id: 'white', label: 'Blanco', bg: 'bg-slate-100' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Detalle del Display y Pines
            </h3>
            <p className="text-xs text-slate-400">
              Visualización aumentada y control de visualización
            </p>
          </div>
        </div>

        {/* Sound toggle */}
        <button
          type="button"
          onClick={() => {
            sounds.enabled = !soundEnabled;
            onToggleSound();
          }}
          className={`p-2 rounded-lg border transition-all ${
            soundEnabled
              ? 'bg-slate-800 border-slate-700 text-sky-400 hover:text-sky-300'
              : 'bg-slate-800/50 border-slate-800 text-slate-500'
          }`}
          title={soundEnabled ? 'Sonidos de interruptores activados' : 'Sonidos desactivados'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Display & Pin diagram side-by-side or stacked */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        {/* Left: Interactive 7-Segment LED */}
        <div className="flex flex-col items-center">
          <SevenSegmentLed
            activeSegments={activeSegments}
            color={color}
            size="lg"
            showLabels={true}
            interactive={true}
            onToggleSegment={onToggleSegment}
          />
          <span className="text-[11px] text-slate-400 mt-2">
            Haz clic en los segmentos para encender/apagar
          </span>
        </div>

        {/* Right: Quick Pin Status List */}
        <div className="w-full sm:w-64 flex flex-col gap-2 text-xs">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5 pb-1 border-b border-slate-800">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span>Estado de Patitas (Pines 1 - 10)</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 font-mono">
            {DISPLAY_PINS.map((pin) => {
              const isEliminated = eliminatedPins.includes(pin.pinNumber);
              const isCommon = pin.segment === 'com';

              return (
                <div
                  key={pin.pinNumber}
                  className={`p-1.5 rounded-lg border flex items-center justify-between ${
                    isCommon
                      ? 'bg-pink-950/30 border-pink-800/40 text-pink-300'
                      : isEliminated
                      ? 'bg-red-950/40 border-red-800/50 text-red-300'
                      : 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                  }`}
                >
                  <span className="font-bold">P{pin.pinNumber}: {pin.segment.toUpperCase()}</span>
                  <span className="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded bg-slate-900">
                    {isCommon ? 'COM (GND)' : isEliminated ? 'ELIMINADA' : 'CONECTADA'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simulator Options */}
      <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Visual Mode */}
        <div>
          <label className="block text-slate-400 font-medium mb-1.5">
            Efecto visual al eliminar patita:
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => onChangeEliminationMode('remove_pin')}
              className={`px-2 py-1.5 rounded-lg font-medium border text-center transition-all ${
                eliminationMode === 'remove_pin'
                  ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Retirar Patita
            </button>
            <button
              type="button"
              onClick={() => onChangeEliminationMode('cut_wire')}
              className={`px-2 py-1.5 rounded-lg font-medium border text-center transition-all ${
                eliminationMode === 'cut_wire'
                  ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Quitar Cable
            </button>
            <button
              type="button"
              onClick={() => onChangeEliminationMode('ghost')}
              className={`px-2 py-1.5 rounded-lg font-medium border text-center transition-all ${
                eliminationMode === 'ghost'
                  ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Atenuar
            </button>
          </div>
        </div>

        {/* LED Color Picker */}
        <div>
          <label className="block text-slate-400 font-medium mb-1.5">
            Color de iluminación LED:
          </label>
          <div className="flex items-center gap-2">
            {colors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onChangeColor(c.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${
                  color === c.id
                    ? 'bg-slate-800 border-slate-400 text-slate-100 ring-1 ring-slate-400'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${c.bg}`}></span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
