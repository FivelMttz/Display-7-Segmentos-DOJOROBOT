import React from 'react';
import { SegmentId, LedColor } from '../types';

interface SevenSegmentLedProps {
  activeSegments: SegmentId[];
  color?: LedColor;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLabels?: boolean;
  onToggleSegment?: (segment: SegmentId) => void;
  interactive?: boolean;
}

const COLOR_MAP: Record<LedColor, { on: string; glow: string; off: string; border: string }> = {
  red: {
    on: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.75)',
    off: '#2e1212',
    border: '#451a1a',
  },
  green: {
    on: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.75)',
    off: '#0f2918',
    border: '#144624',
  },
  blue: {
    on: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.75)',
    off: '#0f1f38',
    border: '#1a335a',
  },
  amber: {
    on: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.75)',
    off: '#2a1e0b',
    border: '#453011',
  },
  white: {
    on: '#f8fafc',
    glow: 'rgba(248, 250, 252, 0.75)',
    off: '#252930',
    border: '#3c434f',
  },
};

export const SevenSegmentLed: React.FC<SevenSegmentLedProps> = ({
  activeSegments,
  color = 'red',
  size = 'md',
  showLabels = false,
  onToggleSegment,
  interactive = false,
}) => {
  const theme = COLOR_MAP[color] || COLOR_MAP.red;

  const isSegmentActive = (seg: SegmentId) => activeSegments.includes(seg);

  // Dimension scaling
  const dimensions = {
    sm: { w: 80, h: 120 },
    md: { w: 120, h: 180 },
    lg: { w: 160, h: 240 },
    hero: { w: 220, h: 320 },
  }[size];

  // SVG viewBox coordinates: 0 0 100 150
  // Segments geometry (faceted hex polygons):
  // A: Top horizontal
  // B: Top-right vertical
  // C: Bottom-right vertical
  // D: Bottom horizontal
  // E: Bottom-left vertical
  // F: Top-left vertical
  // G: Middle horizontal
  // DP: Bottom-right dot

  const segmentsData: { id: SegmentId; path: string; labelX: number; labelY: number }[] = [
    {
      id: 'a',
      path: 'M 22,14 L 30,6 L 70,6 L 78,14 L 70,22 L 30,22 Z',
      labelX: 50,
      labelY: 15,
    },
    {
      id: 'b',
      path: 'M 79,16 L 87,24 L 87,68 L 79,76 L 71,68 L 71,24 Z',
      labelX: 80,
      labelY: 46,
    },
    {
      id: 'c',
      path: 'M 79,78 L 87,86 L 87,130 L 79,138 L 71,130 L 71,86 Z',
      labelX: 80,
      labelY: 108,
    },
    {
      id: 'd',
      path: 'M 22,139 L 30,131 L 70,131 L 78,139 L 70,147 L 30,147 Z',
      labelX: 50,
      labelY: 140,
    },
    {
      id: 'e',
      path: 'M 21,78 L 29,86 L 29,130 L 21,138 L 13,130 L 13,86 Z',
      labelX: 20,
      labelY: 108,
    },
    {
      id: 'f',
      path: 'M 21,16 L 29,24 L 29,68 L 21,76 L 13,68 L 13,24 Z',
      labelX: 20,
      labelY: 46,
    },
    {
      id: 'g',
      path: 'M 22,77 L 30,69 L 70,69 L 78,77 L 70,85 L 30,85 Z',
      labelX: 50,
      labelY: 78,
    },
  ];

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      <svg
        width={dimensions.w}
        height={dimensions.h}
        viewBox="0 0 110 156"
        className="overflow-visible"
        style={{
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))',
        }}
      >
        <defs>
          <filter id={`glow-${color}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Display bezel / casing */}
        <rect
          x="3"
          y="0"
          width="104"
          height="154"
          rx="8"
          fill="#1c1f26"
          stroke="#333842"
          strokeWidth="1.5"
        />

        {/* Inner recessed surface */}
        <rect
          x="7"
          y="4"
          width="96"
          height="146"
          rx="5"
          fill="#14171d"
        />

        {/* Segments */}
        {segmentsData.map((seg) => {
          const active = isSegmentActive(seg.id);
          return (
            <g
              key={seg.id}
              onClick={() => interactive && onToggleSegment && onToggleSegment(seg.id)}
              className={interactive ? 'cursor-pointer transition-transform hover:opacity-90' : ''}
              id={`segment-btn-${seg.id}`}
            >
              <path
                d={seg.path}
                fill={active ? theme.on : theme.off}
                stroke={active ? theme.on : theme.border}
                strokeWidth="1"
                strokeLinejoin="round"
                filter={active ? `url(#glow-${color})` : undefined}
                className="transition-colors duration-200"
              />
              {showLabels && (
                <text
                  x={seg.labelX}
                  y={seg.labelY + 3}
                  textAnchor="middle"
                  fill={active ? '#ffffff' : '#64748b'}
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="monospace"
                  pointerEvents="none"
                >
                  {seg.id.toUpperCase()}
                </text>
              )}
            </g>
          );
        })}

        {/* Decimal Point (DP) */}
        <g
          onClick={() => interactive && onToggleSegment && onToggleSegment('dp')}
          className={interactive ? 'cursor-pointer' : ''}
          id="segment-btn-dp"
        >
          <circle
            cx="93"
            cy="139"
            r="5"
            fill={isSegmentActive('dp') ? theme.on : theme.off}
            stroke={isSegmentActive('dp') ? theme.on : theme.border}
            strokeWidth="1"
            filter={isSegmentActive('dp') ? `url(#glow-${color})` : undefined}
            className="transition-colors duration-200"
          />
          {showLabels && (
            <text
              x="93"
              y="130"
              textAnchor="middle"
              fill={isSegmentActive('dp') ? '#ffffff' : '#64748b'}
              fontSize="6"
              fontWeight="bold"
              fontFamily="monospace"
              pointerEvents="none"
            >
              DP
            </text>
          )}
        </g>
      </svg>
    </div>
  );
};
