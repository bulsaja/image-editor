import type { IImagePaintMode, IText, IPointData, IShadowEffect, IBlendMode, IPaint } from '@leafer-ui/interface';

export type ENV = 'editor' | 'preview';

/**
 * Data description:
 * x, y are positioned relative to the element center point
 */

/**
 * Overall data
 */
export interface ViewData {
  name: string; // Name
  desc: string; // Description
  version: string; // Version number
  thumb: string; // Cover image
  selectPageId: string; // Selected page ID
  createTime: number; // Creation time (timestamp)
  updateTime: number; // Update time (timestamp)
  pages: BasePage[]; // Support multiple pages
}

export interface ExLayerConfig {
  pid: string; // Plugin ID
  version: string; // Version number
}

// export { Layer, LayerData, Options, config };
// export type { types };
export interface ExLayer {
  Layer: JSX.Element;
  Options: JSX.Element;
  LayerData: BaseLayer;
  config: ExLayerConfig;
}

/**
 * Single image data
 */
export interface BasePage {
  id: string; // Identifier
  name: string; // Page name
  desc: string; // Page description
  width: number;
  height: number;
  thumb?: string; // Cover image
  background: IPaint;
  layers: BaseLayer[]; // Elements
}

export type LayerType = 'image' | 'text' | 'shape' | 'group' | string; // Other

/**
 * Layer
 */
export interface BaseLayer {
  id: string;
  name: string;
  desc: string;
  x: number;
  y: number;
  type: LayerType;
  blur: number; // Blur
  border: {
    stroke: string; // Border color
    dashPattern?: number[];
    dashOffset?: number;
    strokeWidth: number;
    visible: boolean;
  };
  blendMode: IBlendMode; // Blend mode
  opacity: number;
  rotation: number; // Rotation 0~360
  shadow: IShadowEffect; // Shadow
  _unKeepRatio?: boolean; // Controller does not keep aspect ratio
  _ratio?: number;
  _dirty: string; // For view update
  _lock: boolean; // Is locked
  _hide: boolean; // Is hidden
  extend?: any; // Extended field
}

/**
 * Layer: image, text, shape & line, group, QR code, chart, table, code, container
 */

// Image
export interface ImageLayer extends BaseLayer {
  type: 'image';
  width: number;
  height: number;
  naturalHeight: number;
  naturalWidth: number;
  // Mirror flip, vertical, horizontal
  flipx: boolean;
  flipy: boolean;
  cropSize?: { x: number; y: number; width: number; height: number }; // Crop
  svgColors?: string[]; // SVG color values
  svgColorType?: 'one' | 'more'; // Single color, multiple colors
  url: string; // Image URL
  cornerRadius: [number, number, number, number]; // Corner radius
}

// Text
export interface TextLayer extends BaseLayer {
  type: 'text';
  width: number;
  height: number;
  // Text style
  fontFamilyURL: string; // Font path
  text: string; // Content
  fill: string; // Text container color
  textStyle: Partial<IText>; // Text style
}

// Shape: rectangle, circle, line, polygon, star
export interface ShapeRectLayer extends BaseLayer {
  type: 'shape';
  shape: 'rect';
  width: number;
  height: number;
  cornerRadius: [number, number, number, number]; // Corner radius
}
export interface ShapeEllipseLayer extends BaseLayer {
  type: 'shape';
  shape: 'ellipse';
  width: number;
  height: number;
  startAngle: number; // Arc start angle, range -180 ~ 180
  endAngle: number; // Arc end angle, range -180 ~ 180
  innerRadius: number; // Inner radius ratio, range 0.0 ~ 1.0
}
export interface ShapeLineLayer extends BaseLayer {
  type: 'shape';
  shape: 'line';
  width: number;
  rotation: number;
  toPoint: IPointData;
  cornerRadius: number; // Corner radius size, makes polyline corners smooth
  points?: number[]; // Draw polyline through coordinate array [ x1,y1, x2,y2, ...]
  curve?: boolean | number; // Convert to smooth path, default false. Can set 0 ~ 1 to control curvature, default 0.5
}
export interface ShapePolygonLayer extends BaseLayer {
  type: 'shape';
  shape: 'polygon';
  width: number;
  height: number;
  sides: number; // Number of polygon sides, range >= 3. Internal logic: take a point every (360 / sides) degrees on a circle, connect points to form a regular polygon
  cornerRadius: number; // Corner radius size, makes polyline corners smooth
  points?: number[]; // Draw polyline through coordinate array [ x1,y1, x2,y2, ...]
  curve?: boolean | number; // Convert to smooth path, default false. Can set 0 ~ 1 to control curvature, default 0.5
}
export interface ShapeStarLayer extends BaseLayer {
  type: 'shape';
  shape: 'star';
  width: number;
  height: number;
  corners: number; // Number of star corners, range >= 3. Internal logic: take a point every (360 / corners) degrees on inner and outer circles, connect points to form a multi-pointed star
  innerRadius: number; // Inner radius ratio, default 0.382, range 0.0 ~ 1.0
  cornerRadius: number; // Corner radius size, makes polyline corners smooth
}

export type ShapeLayer = ShapeEllipseLayer | ShapeLineLayer | ShapePolygonLayer | ShapeRectLayer | ShapeStarLayer;

// Group
export interface GroupLayer extends BaseLayer {
  type: 'group';
  childs: BaseLayer[];
}

// Chart
export interface ChartLayer extends BaseLayer {
  width: number;
  height: number;
  data: Record<string, any>; // Chart data
  options: Record<string, any>; // Chart options
}
