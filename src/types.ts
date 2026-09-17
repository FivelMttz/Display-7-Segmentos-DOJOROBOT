export type SegmentId = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'dp';

export interface PinDefinition {
  pinNumber: number; // 1 to 10
  segment: SegmentId | 'com';
  label: string; // e.g. "Seg A", "COM", "Seg B"
  position: 'top' | 'bottom';
  colIndex: number; // breadboard column index (approx 10 to 19)
  description: string;
}

export interface DigitConfig {
  value: number;
  label: string;
  activeSegments: SegmentId[];
  eliminatedPins: number[]; // Pin numbers (1-10) that are disconnected/eliminated
}

export type EliminationMode = 'remove_pin' | 'cut_wire' | 'ghost';

export type DisplayType = 'common_cathode' | 'common_anode';

export type LedColor = 'red' | 'green' | 'blue' | 'amber' | 'white';
