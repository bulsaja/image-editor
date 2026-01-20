import type { BaseLayer } from '@core/types/data';

// QR Code
export interface QrcodeLayer extends BaseLayer {
  type: 'qrcode';
  // Mirror flip, vertical, horizontal
  flipx: boolean;
  flipy: boolean;
  width: number;
  height: number;
  content: string; // QR code content
  lightcolor: string; // Background color
  darkcolor: string; // Dark color
  cornerRadius: [number, number, number, number]; // Corner radius
}
