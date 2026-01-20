import type { BaseLayer } from '@core/types/data';

// Barcode
export interface BarcodeLayer extends BaseLayer {
  type: 'barcode';
  // Mirror flip, vertical, horizontal
  flipx: boolean;
  flipy: boolean;
  width: number;
  height: number;
  content: string; // Barcode content
  color: string; // Background color
  cornerRadius: [number, number, number, number]; // Corner radius
}
