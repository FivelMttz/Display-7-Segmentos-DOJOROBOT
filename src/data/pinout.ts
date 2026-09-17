import { PinDefinition, SegmentId } from '../types';

/**
 * Standard 10-pin 7-Segment Display Pinout (DIP package)
 * Looking at display with DP at bottom-right:
 * 
 * Top pins (left to right: 10, 9, 8, 7, 6):
 * Pin 10: Segment G
 * Pin 9:  Segment F
 * Pin 8:  Common (Cathode/Anode) [Top COM]
 * Pin 7:  Segment A
 * Pin 6:  Segment B
 * 
 * Bottom pins (left to right: 1, 2, 3, 4, 5):
 * Pin 1:  Segment E
 * Pin 2:  Segment D
 * Pin 3:  Common (Cathode/Anode) [Bottom COM - wired to rail via magenta wire]
 * Pin 4:  Segment C
 * Pin 5:  Decimal Point (DP)
 */

export const DISPLAY_PINS: PinDefinition[] = [
  // Bottom pins (1 to 5)
  {
    pinNumber: 1,
    segment: 'e',
    label: 'Pin 1 (e)',
    position: 'bottom',
    colIndex: 10,
    description: 'Segmento E (inferior izquierdo)',
  },
  {
    pinNumber: 2,
    segment: 'd',
    label: 'Pin 2 (d)',
    position: 'bottom',
    colIndex: 12,
    description: 'Segmento D (base inferior)',
  },
  {
    pinNumber: 3,
    segment: 'com',
    label: 'Pin 3 (COM)',
    position: 'bottom',
    colIndex: 14,
    description: 'Común Cátodo/Ánodo (cable rosa a riel negativo/positivo)',
  },
  {
    pinNumber: 4,
    segment: 'c',
    label: 'Pin 4 (c)',
    position: 'bottom',
    colIndex: 16,
    description: 'Segmento C (inferior derecho)',
  },
  {
    pinNumber: 5,
    segment: 'dp',
    label: 'Pin 5 (DP)',
    position: 'bottom',
    colIndex: 18,
    description: 'Punto Decimal (DP)',
  },

  // Top pins (10 to 6)
  {
    pinNumber: 10,
    segment: 'g',
    label: 'Pin 10 (g)',
    position: 'top',
    colIndex: 10,
    description: 'Segmento G (barra central)',
  },
  {
    pinNumber: 9,
    segment: 'f',
    label: 'Pin 9 (f)',
    position: 'top',
    colIndex: 12,
    description: 'Segmento F (superior izquierdo)',
  },
  {
    pinNumber: 8,
    segment: 'com',
    label: 'Pin 8 (COM)',
    position: 'top',
    colIndex: 14,
    description: 'Común alternativo (no conectado si se usa Pin 3)',
  },
  {
    pinNumber: 7,
    segment: 'a',
    label: 'Pin 7 (a)',
    position: 'top',
    colIndex: 16,
    description: 'Segmento A (barra superior)',
  },
  {
    pinNumber: 6,
    segment: 'b',
    label: 'Pin 6 (b)',
    position: 'top',
    colIndex: 18,
    description: 'Segmento B (superior derecho)',
  },
];

export const DIGIT_PRESETS: Record<number, { activeSegments: SegmentId[]; eliminatedPins: number[] }> = {
  0: {
    activeSegments: ['a', 'b', 'c', 'd', 'e', 'f'],
    eliminatedPins: [10, 5], // g and dp
  },
  1: {
    activeSegments: ['b', 'c'],
    eliminatedPins: [7, 2, 1, 9, 10, 5], // a, d, e, f, g, dp
  },
  2: {
    activeSegments: ['a', 'b', 'g', 'e', 'd'],
    eliminatedPins: [4, 9, 5], // c, f, dp
  },
  3: {
    activeSegments: ['a', 'b', 'g', 'c', 'd'],
    eliminatedPins: [1, 9, 5], // e, f, dp
  },
  4: {
    activeSegments: ['f', 'g', 'b', 'c'],
    eliminatedPins: [7, 2, 1, 5], // a, d, e, dp
  },
  5: {
    activeSegments: ['a', 'f', 'g', 'c', 'd'],
    eliminatedPins: [6, 1, 5], // b, e, dp
  },
  6: {
    activeSegments: ['a', 'c', 'd', 'e', 'f', 'g'],
    eliminatedPins: [6, 5], // b, dp
  },
  7: {
    activeSegments: ['a', 'b', 'c'],
    eliminatedPins: [2, 1, 9, 10, 5], // d, e, f, g, dp
  },
  8: {
    activeSegments: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    eliminatedPins: [5], // dp (or none if DP used)
  },
  9: {
    activeSegments: ['a', 'b', 'c', 'd', 'f', 'g'],
    eliminatedPins: [1, 5], // e, dp
  },
};

export const SEGMENT_NAMES: Record<SegmentId, string> = {
  a: 'Segmento A (Superior)',
  b: 'Segmento B (Sup. Derecho)',
  c: 'Segmento C (Inf. Derecho)',
  d: 'Segmento D (Inferior)',
  e: 'Segmento E (Inf. Izquierdo)',
  f: 'Segmento F (Sup. Izquierdo)',
  g: 'Segmento G (Centro)',
  dp: 'Punto Decimal (DP)',
};
