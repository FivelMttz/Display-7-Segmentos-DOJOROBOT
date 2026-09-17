import React, { useState } from 'react';
import { DISPLAY_PINS } from '../data/pinout';
import { EliminationMode, LedColor, SegmentId } from '../types';
import { sounds } from '../utils/audio';

interface BreadboardCircuitProps {
  activeSegments: SegmentId[];
  eliminatedPins: number[];
  color?: LedColor;
  eliminationMode: EliminationMode;
  onTogglePin?: (pinNumber: number) => void;
  interactive?: boolean;
}

export const BreadboardCircuit: React.FC<BreadboardCircuitProps> = ({
  activeSegments,
  eliminatedPins,
  color = 'red',
  eliminationMode,
  onTogglePin,
  interactive = true,
}) => {
  const [hoveredPin, setHoveredPin] = useState<number | null>(null);

  // SVG coordinate calculations for breadboard grid:
  // 30 columns, spaced by 28px
  // Board width: 30 * 28 + 140 = 980px
  // Rails:
  // Top power rail: y = 35 (+), y = 60 (-)
  // Top rows: j = 100, i = 120, h = 140, g = 160, f = 180
  // Center gutter / divider: y = 205
  // Bottom rows: e = 230, d = 250, c = 270, b = 290, a = 310
  // Bottom power rail: y = 350 (-), y = 375 (+)
  // Board height: 410px
  // Battery pack on the right side: x = 990, y = 50, w = 240, h = 330
  // Total viewBox: 0 0 1260 420

  const colX = (col: number) => 50 + (col - 1) * 28;

  const rowY: Record<string, number> = {
    topPlus: 36,
    topMinus: 62,
    j: 100,
    i: 122,
    h: 144,
    g: 166,
    f: 188,
    e: 228,
    d: 250,
    c: 272,
    b: 294,
    a: 316,
    bottomMinus: 354,
    bottomPlus: 380,
  };

  const isPinEliminated = (pinNumber: number) => eliminatedPins.includes(pinNumber);

  // Glow color scheme
  const glowColors: Record<LedColor, string> = {
    red: '#ef4444',
    green: '#22c55e',
    blue: '#3b82f6',
    amber: '#f59e0b',
    white: '#f8fafc',
  };
  const activeColor = glowColors[color] || '#ef4444';

  const handlePinClick = (pinNum: number) => {
    if (!interactive || !onTogglePin) return;
    sounds.playDisconnect();
    onTogglePin(pinNum);
  };

  return (
    <div className="w-full overflow-x-auto bg-slate-950/80 p-2 sm:p-4 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="min-w-[960px] max-w-[1260px] mx-auto select-none">
        <svg
          viewBox="0 0 1260 420"
          className="w-full h-auto drop-shadow-md font-sans"
        >
          <defs>
            {/* Protoboard subtle pattern */}
            <linearGradient id="bb-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e4e6ea" />
              <stop offset="50%" stopColor="#dde0e5" />
              <stop offset="100%" stopColor="#d5d8de" />
            </linearGradient>

            {/* Battery body gradient */}
            <linearGradient id="batt-teal" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e8185" />
              <stop offset="50%" stopColor="#22b2b8" />
              <stop offset="100%" stopColor="#1a6e71" />
            </linearGradient>

            {/* Resistor ceramic body */}
            <linearGradient id="resistor-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#edd8b0" />
              <stop offset="50%" stopColor="#f8e7c9" />
              <stop offset="100%" stopColor="#d8be91" />
            </linearGradient>

            {/* LED display glow filter */}
            <filter id="circuit-led-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ======================================================== */}
          {/* 1. PROTOBOARD BODY                                        */}
          {/* ======================================================== */}
          <rect
            x="20"
            y="12"
            width="930"
            height="394"
            rx="12"
            fill="url(#bb-body)"
            stroke="#b0b5be"
            strokeWidth="3"
          />

          {/* Central divider trough */}
          <rect x="22" y="202" width="926" height="12" fill="#bac0cb" />
          <line x1="22" y1="202" x2="948" y2="202" stroke="#9da4b1" strokeWidth="1" />
          <line x1="22" y1="214" x2="948" y2="214" stroke="#9da4b1" strokeWidth="1" />

          {/* Power rail colored lines */}
          {/* Top Plus (Red) */}
          <line x1="45" y1="26" x2="925" y2="26" stroke="#ef4444" strokeWidth="2.5" />
          <text x="32" y="30" fill="#ef4444" fontSize="18" fontWeight="bold" textAnchor="middle">+</text>
          <text x="938" y="30" fill="#ef4444" fontSize="18" fontWeight="bold" textAnchor="middle">+</text>

          {/* Top Minus (Blue) */}
          <line x1="45" y1="74" x2="925" y2="74" stroke="#3b82f6" strokeWidth="2.5" />
          <text x="32" y="77" fill="#3b82f6" fontSize="22" fontWeight="bold" textAnchor="middle">-</text>
          <text x="938" y="77" fill="#3b82f6" fontSize="22" fontWeight="bold" textAnchor="middle">-</text>

          {/* Bottom Minus (Blue) */}
          <line x1="45" y1="342" x2="925" y2="342" stroke="#3b82f6" strokeWidth="2.5" />
          <text x="32" y="346" fill="#3b82f6" fontSize="22" fontWeight="bold" textAnchor="middle">-</text>
          <text x="938" y="346" fill="#3b82f6" fontSize="22" fontWeight="bold" textAnchor="middle">-</text>

          {/* Bottom Plus (Red) */}
          <line x1="45" y1="392" x2="925" y2="392" stroke="#ef4444" strokeWidth="2.5" />
          <text x="32" y="396" fill="#ef4444" fontSize="18" fontWeight="bold" textAnchor="middle">+</text>
          <text x="938" y="396" fill="#ef4444" fontSize="18" fontWeight="bold" textAnchor="middle">+</text>

          {/* Row letters on the left & right */}
          {(['j', 'i', 'h', 'g', 'f'] as const).map((r) => (
            <React.Fragment key={r}>
              <text x="35" y={rowY[r] + 4} fill="#6b7280" fontSize="12" fontFamily="monospace" textAnchor="middle">{r}</text>
              <text x="935" y={rowY[r] + 4} fill="#6b7280" fontSize="12" fontFamily="monospace" textAnchor="middle">{r}</text>
            </React.Fragment>
          ))}
          {(['e', 'd', 'c', 'b', 'a'] as const).map((r) => (
            <React.Fragment key={r}>
              <text x="35" y={rowY[r] + 4} fill="#6b7280" fontSize="12" fontFamily="monospace" textAnchor="middle">{r}</text>
              <text x="935" y={rowY[r] + 4} fill="#6b7280" fontSize="12" fontFamily="monospace" textAnchor="middle">{r}</text>
            </React.Fragment>
          ))}

          {/* Column numbers across 1 to 30 */}
          {Array.from({ length: 30 }, (_, i) => i + 1).map((col) => {
            const x = colX(col);
            return (
              <React.Fragment key={col}>
                {col % 5 === 0 || col === 1 ? (
                  <text x={x} y="87" fill="#6b7280" fontSize="10" fontFamily="monospace" textAnchor="middle">
                    {col}
                  </text>
                ) : null}
                {col % 5 === 0 || col === 1 ? (
                  <text x={x} y="331" fill="#6b7280" fontSize="10" fontFamily="monospace" textAnchor="middle">
                    {col}
                  </text>
                ) : null}
              </React.Fragment>
            );
          })}

          {/* Breadboard contact holes (Tie Points) */}
          {Array.from({ length: 30 }, (_, i) => i + 1).map((col) => {
            const x = colX(col);
            return (
              <g key={`holes-${col}`}>
                {/* Power rails */}
                <circle cx={x} cy={rowY.topPlus} r="2.8" fill="#1e293b" />
                <circle cx={x} cy={rowY.topMinus} r="2.8" fill="#1e293b" />
                <circle cx={x} cy={rowY.bottomMinus} r="2.8" fill="#1e293b" />
                <circle cx={x} cy={rowY.bottomPlus} r="2.8" fill="#1e293b" />

                {/* Rows j..f */}
                <circle cx={x} cy={rowY.j} r="2.8" fill="#2d3748" />
                <circle cx={x} cy={rowY.i} r="2.8" fill="#2d3748" />
                <circle cx={x} cy={rowY.h} r="2.8" fill="#2d3748" />
                <circle cx={x} cy={rowY.g} r="2.8" fill="#2d3748" />
                <circle cx={x} cy={rowY.f} r="2.8" fill="#2d3748" />

                {/* Rows e..a */}
                <circle cx={x} cy={rowY.e} r="2.8" fill="#2d3748" />
                <circle cx={x} cy={rowY.d} r="2.8" fill="#2d3748" />
                <circle cx={x} cy={rowY.c} r="2.8" fill="#2d3748" />
                <circle cx={x} cy={rowY.b} r="2.8" fill="#2d3748" />
                <circle cx={x} cy={rowY.a} r="2.8" fill="#2d3748" />
              </g>
            );
          })}

          {/* ======================================================== */}
          {/* 2. BRIDGING JUMPERS ON LEFT (Top rail to Bottom rail)     */}
          {/* ======================================================== */}
          {/* Jumper 1: Col 1 connects Bottom Minus to Top Minus */}
          <path
            d={`M ${colX(1)} ${rowY.bottomMinus} C ${colX(1) - 15} 250, ${colX(1) - 15} 160, ${colX(1)} ${rowY.topMinus}`}
            fill="none"
            stroke="#15803d"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Jumper 2: Col 2 connects Bottom Plus to Top Plus */}
          <path
            d={`M ${colX(2)} ${rowY.bottomPlus} C ${colX(2) - 15} 270, ${colX(2) - 15} 140, ${colX(2)} ${rowY.topPlus}`}
            fill="none"
            stroke="#16a34a"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* ======================================================== */}
          {/* 3. BATTERY PACK ON THE RIGHT (3x AA 1.5V = 4.5V)          */}
          {/* ======================================================== */}
          <g transform="translate(980, 40)">
            {/* Outer battery box */}
            <rect
              x="0"
              y="0"
              width="250"
              height="340"
              rx="12"
              fill="#181d22"
              stroke="#2c333c"
              strokeWidth="4"
            />
            {/* Battery slot 1 */}
            <rect x="15" y="20" width="65" height="300" rx="6" fill="#0d1117" />
            <rect x="20" y="30" width="55" height="180" rx="3" fill="url(#batt-teal)" />
            <rect x="20" y="210" width="55" height="100" rx="3" fill="#21262d" />
            <text x="47" y="160" fill="#ffffff" fontSize="16" fontWeight="bold" transform="rotate(-90, 47, 160)" textAnchor="middle">AA 1.5V</text>

            {/* Battery slot 2 */}
            <rect x="92" y="20" width="65" height="300" rx="6" fill="#0d1117" />
            <rect x="97" y="30" width="55" height="110" rx="3" fill="#21262d" />
            <rect x="97" y="140" width="55" height="170" rx="3" fill="url(#batt-teal)" />
            <text x="124" y="160" fill="#ffffff" fontSize="16" fontWeight="bold" transform="rotate(90, 124, 160)" textAnchor="middle">AA 1.5V</text>

            {/* Battery slot 3 */}
            <rect x="170" y="20" width="65" height="300" rx="6" fill="#0d1117" />
            <rect x="175" y="30" width="55" height="180" rx="3" fill="url(#batt-teal)" />
            <rect x="175" y="210" width="55" height="100" rx="3" fill="#21262d" />
            <text x="202" y="160" fill="#ffffff" fontSize="16" fontWeight="bold" transform="rotate(-90, 202, 160)" textAnchor="middle">AA 1.5V</text>

            {/* Battery box top terminals */}
            <rect x="110" y="0" width="14" height="8" rx="2" fill="#374151" />
            <circle cx="106" cy="12" r="7" fill="#111827" stroke="#374151" strokeWidth="2" />
            <circle cx="128" cy="12" r="7" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
            <text x="106" y="16" fill="#e2e8f0" fontSize="12" fontWeight="bold" textAnchor="middle">-</text>
            <text x="128" y="16" fill="#e2e8f0" fontSize="12" fontWeight="bold" textAnchor="middle">+</text>
          </g>

          {/* Battery wires connecting to top power rails */}
          {/* Negative Wire (to Top Minus at col 28) */}
          <path
            d={`M 1086 52 C 1050 50, 950 40, ${colX(28)} ${rowY.topMinus}`}
            fill="none"
            stroke="#15803d"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Positive Wire (to Top Plus at col 29) */}
          <path
            d={`M 1108 52 C 1080 30, 950 20, ${colX(29)} ${rowY.topPlus}`}
            fill="none"
            stroke="#16a34a"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* ======================================================== */}
          {/* 4. SEVEN SEGMENT DISPLAY (Center, Cols 13 to 17)          */}
          {/* ======================================================== */}
          {/* Display socket body sitting over the center trough */}
          <g transform="translate(365, 130)">
            {/* Display outer bezel */}
            <rect
              x="0"
              y="0"
              width="155"
              height="155"
              rx="6"
              fill="#1e2229"
              stroke="#2e3540"
              strokeWidth="2.5"
            />
            {/* Display recessed LED face */}
            <rect
              x="8"
              y="8"
              width="139"
              height="139"
              rx="4"
              fill="#13161b"
            />

            {/* Display Segments rendered inside circuit! */}
            <g transform="translate(24, 12) scale(0.96)">
              {/* Segment A */}
              <polygon
                points="22,14 30,6 70,6 78,14 70,22 30,22"
                fill={activeSegments.includes('a') ? activeColor : '#251212'}
                filter={activeSegments.includes('a') ? 'url(#circuit-led-glow)' : undefined}
                className="transition-colors duration-200"
              />
              {/* Segment B */}
              <polygon
                points="79,16 87,24 87,68 79,76 71,68 71,24"
                fill={activeSegments.includes('b') ? activeColor : '#251212'}
                filter={activeSegments.includes('b') ? 'url(#circuit-led-glow)' : undefined}
                className="transition-colors duration-200"
              />
              {/* Segment C */}
              <polygon
                points="79,78 87,86 87,130 79,138 71,130 71,86"
                fill={activeSegments.includes('c') ? activeColor : '#251212'}
                filter={activeSegments.includes('c') ? 'url(#circuit-led-glow)' : undefined}
                className="transition-colors duration-200"
              />
              {/* Segment D */}
              <polygon
                points="22,139 30,131 70,131 78,139 70,147 30,147"
                fill={activeSegments.includes('d') ? activeColor : '#251212'}
                filter={activeSegments.includes('d') ? 'url(#circuit-led-glow)' : undefined}
                className="transition-colors duration-200"
              />
              {/* Segment E */}
              <polygon
                points="21,78 29,86 29,130 21,138 13,130 13,86"
                fill={activeSegments.includes('e') ? activeColor : '#251212'}
                filter={activeSegments.includes('e') ? 'url(#circuit-led-glow)' : undefined}
                className="transition-colors duration-200"
              />
              {/* Segment F */}
              <polygon
                points="21,16 29,24 29,68 21,76 13,68 13,24"
                fill={activeSegments.includes('f') ? activeColor : '#251212'}
                filter={activeSegments.includes('f') ? 'url(#circuit-led-glow)' : undefined}
                className="transition-colors duration-200"
              />
              {/* Segment G */}
              <polygon
                points="22,77 30,69 70,69 78,77 70,85 30,85"
                fill={activeSegments.includes('g') ? activeColor : '#251212'}
                filter={activeSegments.includes('g') ? 'url(#circuit-led-glow)' : undefined}
                className="transition-colors duration-200"
              />
              {/* Segment DP */}
              <circle
                cx="93"
                cy="139"
                r="5"
                fill={activeSegments.includes('dp') ? activeColor : '#251212'}
                filter={activeSegments.includes('dp') ? 'url(#circuit-led-glow)' : undefined}
                className="transition-colors duration-200"
              />
            </g>
          </g>

          {/* ======================================================== */}
          {/* 5. COMMON PIN CATHODE (PIN 3) MAGENTA WIRE TO NEGATIVE    */}
          {/* ======================================================== */}
          {/* Pin 3 is at col 14, row e. Magenta wire goes straight down to row bottomMinus */}
          <g>
            <path
              d={`M ${colX(14)} ${rowY.e} L ${colX(14)} ${rowY.bottomMinus}`}
              fill="none"
              stroke="#ec4899"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Terminal pin points */}
            <circle cx={colX(14)} cy={rowY.e} r="3.5" fill="#f472b6" />
            <circle cx={colX(14)} cy={rowY.bottomMinus} r="3.5" fill="#f472b6" />
            <text
              x={colX(14) + 6}
              y={(rowY.e + rowY.bottomMinus) / 2}
              fill="#f472b6"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
            >
              GND (COM)
            </text>
          </g>

          {/* ======================================================== */}
          {/* 6. PIN WIRING, RESISTORS, JUMPERS & ELIMINATED STATUS     */}
          {/* ======================================================== */}
          {/*
            Each of the segment pins has:
            - A connection from the display leg at row f (top) or row e (bottom).
            - A resistor bridging to an adjacent column.
            - A jumper wire going to the Positive (+) rail!
            
            Let's render them with explicit visual feedback when ELIMINATED!
          */}

          {DISPLAY_PINS.filter((p) => p.segment !== 'com').map((pin) => {
            const isTop = pin.position === 'top';
            const eliminated = isPinEliminated(pin.pinNumber);
            const isHovered = hoveredPin === pin.pinNumber;

            // Coordinates for pin hole on display row:
            const pinX = colX(pin.colIndex);
            const pinHoleY = isTop ? rowY.f : rowY.e;

            // Resistor connects from pin column to adjacent column:
            // For pins on left (col 10, 12), bridges to col-1 (9, 11)
            // For pins on right (col 16, 18), bridges to col+1 (17, 19)
            const bridgeCol = pin.colIndex <= 14 ? pin.colIndex - 1 : pin.colIndex + 1;
            const bridgeX = colX(bridgeCol);

            // Resistor Y positions:
            // Top resistors sit around row h/i (y = 135 to 155)
            // Bottom resistors sit around row c/b (y = 260 to 280)
            const resY = isTop ? 135 : 280;
            const railY = isTop ? rowY.topPlus : rowY.bottomPlus;

            // Wire styling depending on elimination mode
            const showPhysicalPin = !eliminated || eliminationMode !== 'remove_pin';
            const showResistorAndWire = !eliminated || eliminationMode !== 'cut_wire';

            return (
              <g
                key={pin.pinNumber}
                id={`circuit-pin-group-${pin.pinNumber}`}
                className={interactive ? 'cursor-pointer' : ''}
                onClick={() => handlePinClick(pin.pinNumber)}
                onMouseEnter={() => setHoveredPin(pin.pinNumber)}
                onMouseLeave={() => setHoveredPin(null)}
              >
                {/* 6.1 DISPLAY PIN LEG ("PATITA") */}
                {eliminated && eliminationMode === 'remove_pin' ? (
                  // ELIMINATED: Patita has been physically removed!
                  <g className="transition-all duration-300">
                    {/* Empty breadboard hole with red outline / indicator */}
                    <circle
                      cx={pinX}
                      cy={pinHoleY}
                      r="7"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeDasharray="2,2"
                    />
                    <line
                      x1={pinX - 4}
                      y1={pinHoleY - 4}
                      x2={pinX + 4}
                      y2={pinHoleY + 4}
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                    <line
                      x1={pinX + 4}
                      y1={pinHoleY - 4}
                      x2={pinX - 4}
                      y2={pinHoleY + 4}
                      stroke="#ef4444"
                      strokeWidth="2"
                    />

                    {/* Small badge saying 'PATITA ELIMINADA' */}
                    <g transform={`translate(${pinX - 35}, ${isTop ? pinHoleY - 26 : pinHoleY + 14})`}>
                      <rect
                        x="0"
                        y="0"
                        width="70"
                        height="15"
                        rx="3"
                        fill="#450a0a"
                        stroke="#ef4444"
                        strokeWidth="1"
                      />
                      <text
                        x="35"
                        y="11"
                        fill="#fca5a5"
                        fontSize="7"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        RETIRADA ❌
                      </text>
                    </g>
                  </g>
                ) : (
                  // CONNECTED (or ghost mode): Metal pin leg inserted into hole
                  <g className={eliminated ? 'opacity-30' : ''}>
                    {/* Metal leg extending from display */}
                    <line
                      x1={pinX}
                      y1={isTop ? 180 : 235}
                      x2={pinX}
                      y2={pinHoleY}
                      stroke="#94a3b8"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* Hole entry contact */}
                    <circle cx={pinX} cy={pinHoleY} r="3.5" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                  </g>
                )}

                {/* 6.2 RESISTOR & WIRING */}
                {showResistorAndWire ? (
                  <g className={`transition-opacity duration-300 ${eliminated ? 'opacity-25' : 'opacity-100'}`}>
                    {/* Trace from pin hole to resistor pin (on breadboard column) */}
                    <line
                      x1={pinX}
                      y1={pinHoleY}
                      x2={pinX}
                      y2={resY}
                      stroke="#16a34a"
                      strokeWidth="2.5"
                    />

                    {/* Ceramic Resistor Body bridging pinX to bridgeX */}
                    <g>
                      {/* Resistor lead wires */}
                      <line x1={pinX} y1={resY} x2={bridgeX} y2={resY} stroke="#94a3b8" strokeWidth="2" />
                      {/* Body */}
                      <rect
                        x={Math.min(pinX, bridgeX) + 4}
                        y={resY - 6}
                        width={Math.abs(bridgeX - pinX) - 8}
                        height="12"
                        rx="4"
                        fill="url(#resistor-body)"
                        stroke="#8c6c44"
                        strokeWidth="1"
                      />
                      {/* Resistor color bands (330 Ohm: Orange, Orange, Brown, Gold) */}
                      {(() => {
                        const minX = Math.min(pinX, bridgeX) + 4;
                        const w = Math.abs(bridgeX - pinX) - 8;
                        return (
                          <>
                            <rect x={minX + w * 0.2} y={resY - 6} width="2" height="12" fill="#f97316" />
                            <rect x={minX + w * 0.4} y={resY - 6} width="2" height="12" fill="#f97316" />
                            <rect x={minX + w * 0.6} y={resY - 6} width="2" height="12" fill="#78350f" />
                            <rect x={minX + w * 0.8} y={resY - 6} width="2" height="12" fill="#fbbf24" />
                          </>
                        );
                      })()}
                    </g>

                    {/* Jumper wire from bridgeX to Power Rail (+) */}
                    <line
                      x1={bridgeX}
                      y1={resY}
                      x2={bridgeX}
                      y2={railY}
                      stroke={eliminated ? '#64748b' : '#22c55e'}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx={bridgeX} cy={railY} r="3.5" fill="#16a34a" />
                  </g>
                ) : (
                  // CUT WIRE MODE (unplugged wire)
                  <g className="transition-all duration-300">
                    <line
                      x1={bridgeX}
                      y1={railY}
                      x2={bridgeX}
                      y2={isTop ? railY + 25 : railY - 25}
                      stroke="#ef4444"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="4,3"
                    />
                    <text
                      x={bridgeX}
                      y={isTop ? railY + 40 : railY - 30}
                      fill="#ef4444"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      CABLE RETIRADO
                    </text>
                  </g>
                )}

                {/* 6.3 PIN NUMBER & SEGMENT LABEL OVERLAY */}
                <g transform={`translate(${pinX}, ${isTop ? 105 : 305})`}>
                  <rect
                    x="-18"
                    y="-9"
                    width="36"
                    height="18"
                    rx="4"
                    fill={eliminated ? '#1e293b' : isHovered ? '#0284c7' : '#0f172a'}
                    stroke={eliminated ? '#ef4444' : '#38bdf8'}
                    strokeWidth={isHovered ? 2 : 1}
                  />
                  <text
                    x="0"
                    y="3"
                    fill={eliminated ? '#f87171' : '#ffffff'}
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {pin.segment.toUpperCase()} #{pin.pinNumber}
                  </text>
                </g>
              </g>
            );
          })}

          {/* ======================================================== */}
          {/* 7. TITLE & HARDWARE STATS OVERLAY                         */}
          {/* ======================================================== */}
          <g transform="translate(45, 400)">
            <text x="0" y="0" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
              Circuito Protoboard: Display 7 Segmentos Cátodo Común (5V / 4.5V Pack AA)
            </text>
          </g>
        </svg>
      </div>

      {/* Circuit Legend & Quick Status Bar below the board */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-slate-300 font-medium">Patita Conectada (Activa)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 border border-red-400"></span>
            <span className="text-red-300 font-medium">Patita Eliminada / Desconectada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span>
            <span className="text-pink-300 font-medium">GND Común (Pin 3 a Riel -)</span>
          </div>
        </div>

        <div className="text-slate-400 font-mono">
          {eliminatedPins.length === 0 ? (
            <span className="text-emerald-400 font-semibold">Todas las patitas conectadas (Dígito 8)</span>
          ) : (
            <span>
              Patitas eliminadas:{' '}
              <span className="text-red-400 font-bold">
                {eliminatedPins
                  .map((p) => {
                    const found = DISPLAY_PINS.find((dp) => dp.pinNumber === p);
                    return `Pin ${p} (${found?.segment.toUpperCase() || '?'})`;
                  })
                  .join(', ')}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
