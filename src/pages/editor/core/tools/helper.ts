import React from 'react';
import Store from '../stores/Store';
import { BaseLayer, LayerType, GroupLayer, TextLayer, ImageLayer } from '../types/data';
import type { InjectParams } from '../types/helper';
import * as util from './utils';

/**
 * Inject data into child components
 * @param children
 * @param params
 * @returns
 */
export function childrenInjectProps(params?: InjectParams, children?: JSX.Element | JSX.Element[]) {
  if (children instanceof Array) {
    return children.map(child => {
      return React.Children.toArray(child).map((element: any) => React.cloneElement(element, { ...params }));
    });
  } else {
    return React.Children.toArray(children).map((element: any) => React.cloneElement(element, { ...params }));
  }
}

export function bindSelf(_target: any, _key: any, descriptor: any) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any) {
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

export function syncControlToElement(elementId: string, store: Store) {}

/**
 * Create element
 */
export function createLayer<T extends LayerType>(type: T): BaseLayer {
  const base = {
    type: type,
    id: util.createID(),
    name: 'Unnamed',
    desc: '',
    x: 0,
    y: 0,
    blur: 0,
    border: {
      stroke: '',
      strokeWidth: 0,
      visible: false,
    },
    blendMode: 'normal',
    opacity: 1,
    rotation: 0,
    shadow: undefined,
    _dirty: '',
    _lock: false,
    _hide: false,
  };
  switch (type) {
    case 'group':
      return {
        ...base,
        name: 'Group Element',
        childs: [],
      } as GroupLayer;
    case 'text':
      return {
        ...base,
        name: 'Text Element',
        fontFamilyURL: '', // Font path
        text: 'Enter text', // Content
        fill: '', // Text container color
        textStyle: {
          fontSize: 24,
          fill: '#000',
        }, // Text style
      } as TextLayer;
    case 'image':
      return {
        ...base,
        name: 'Image Element',
        width: 0,
        height: 0,
        naturalWidth: 0,
        naturalHeight: 0,
        // Mirror flip, vertical, horizontal
        flipx: false,
        flipy: false,
        cropSize: null, // Crop
        url: '', // Image URL
        cornerRadius: [0, 0, 0, 0], // Corner radius
      } as ImageLayer;
    default:
      console.error('Unknown type');
      return null;
  }
}
