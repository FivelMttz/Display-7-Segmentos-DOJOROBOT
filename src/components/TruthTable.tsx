import React from 'react';
import { DIGIT_PRESETS, DISPLAY_PINS } from '../data/pinout';
import { SegmentId } from '../types';
import { Table, Check, X } from 'lucide-react';

interface TruthTableProps {
  currentDigit: number | null;
  onSelectDigit: (digit: number) => void;
}

export const TruthTable: React.FC<TruthTableProps> = ({ currentDigit, onSelectDigit }) => {
  const segments: SegmentId[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Tabla de Verdad y Patitas del Display
            </h3>
            <p className="text-xs text-slate-400">
              Estado lógico de cada segmento y patitas eliminadas para cada número
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
              <th className="py-2.5 px-3 font-semibold text-slate-300">Dígito</th>
              {segments.map((seg) => {
                const pin = DISPLAY_PINS.find((p) => p.segment === seg);
                return (
                  <th key={seg} className="py-2.5 px-2 text-center">
                    <div className="font-bold text-slate-200">{seg.toUpperCase()}</div>
                    <div className="text-[10px] text-slate-500 font-mono">P{pin?.pinNumber}</div>
                  </th>
                );
              })}
              <th className="py-2.5 px-3 font-semibold text-slate-300">
                Patitas a Eliminar / Desconectar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {digits.map((d) => {
              const preset = DIGIT_PRESETS[d];
              const isSelected = currentDigit === d;
              return (
                <tr
                  key={d}
                  onClick={() => onSelectDigit(d)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-sky-500/15 text-white font-semibold'
                      : 'hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <td className="py-2 px-3 font-bold text-sm text-amber-400">
                    {d}
                  </td>
                  {segments.map((seg) => {
                    const isConnected = preset.activeSegments.includes(seg);
                    return (
                      <td key={seg} className="py-2 px-2 text-center">
                        {isConnected ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-500/20 text-emerald-400">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-red-500/20 text-red-400">
                            <X className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="py-2 px-3 text-xs">
                    {preset.eliminatedPins.length === 0 ? (
                      <span className="text-emerald-400 font-sans">Ninguna (todas conectadas)</span>
                    ) : (
                      <span className="text-red-400 font-medium">
                        {preset.eliminatedPins
                          .map((p) => {
                            const pinObj = DISPLAY_PINS.find((dp) => dp.pinNumber === p);
                            return `Pin ${p} (${pinObj?.segment.toUpperCase()})`;
                          })
                          .join(', ')}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
