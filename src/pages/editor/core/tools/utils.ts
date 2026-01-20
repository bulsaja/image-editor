import { IUI } from '@leafer-ui/interface';
import { nanoid } from 'nanoid';
import { BaseLayer, GroupLayer, BasePage } from '../types/data';

/**
 * Generate a unique ID
 * @returns
 */
export function createID(n?: number): string {
  return nanoid(n ? n : 10);
}

export function setURL(url: string, resourceHost: string) {
  if (/(http:\/\/|https:\/\/)/.test(url)) {
    return url;
  } else {
    return resourceHost + url;
  }
}

/**
 * Get file extension from URL
 * @param filePath
 * @returns
 */
export function getFileExtension(filePath: string) {
  // Split file path and get the last part
  const fileName = filePath.split('/').pop();
  // Split file name again and get the last part as extension
  const extension = fileName.split('.').pop();
  // Return the extension
  return extension.split('?')[0];
}

export function replaceSveColor(svgString: string, newColor: string | string[]) {
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgString, 'image/svg+xml').querySelector('svg');

  // Get all path elements
  const elements = svg.querySelectorAll('[fill], [stroke]');
  // Replace fill and stroke color
  console.log('elements>>', elements);
  let index = 0;
  elements.forEach(element => {
    const fill = element.getAttribute('fill');
    const stroke = element.getAttribute('stroke');
    console.log('stroke', { stroke, fill });
    if (typeof newColor === 'string') {
      if (fill && fill !== 'none') {
        element.setAttribute('fill', newColor || '#000000');
      }
      if (stroke && stroke !== 'none') {
        element.setAttribute('stroke', newColor || '#000000');
      }
      index++;
    } else {
      if (fill && fill !== 'none') {
        element.setAttribute('fill', newColor[index] || '#000000');
        index++;
      }
      if (stroke && stroke !== 'none') {
        element.setAttribute('stroke', newColor[index] || '#000000');
        index++;
      }
    }
  });

  // Serialize XML
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
}

/**
 * Random
 * @param randomLength
 * @returns
 */
export function randomID(randomLength = 8): string {
  return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36);
}

/**
 * Keep only n decimal places, truncate without rounding
 * @param val
 * @param n
 * @returns
 */
export function toIntNum(val: number, n: number) {
  const num = Math.pow(10, n);
  return ~~(val * num) / num;
}

export function toJS(obj: Record<string, any> | any[]) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (err) {
    console.error('toJS data error', err, obj);
  }
}

function cloneDataLoop(layers: BaseLayer[]) {
  layers.forEach(layer => {
    layer._dirty = randomID();
    if ((layer as GroupLayer).childs) {
      cloneDataLoop((layer as GroupLayer).childs);
    }
  });
}
export function cloneData(data: BasePage) {
  const newData = toJS(data) as BasePage;
  cloneDataLoop(newData.layers);
  return newData;
}

export function getIdsFromUI(target: IUI | IUI[]) {
  if (target instanceof Array) {
    return target.map(d => d.id);
  } else {
    return [target.id];
  }
}

/**
 * Object data copy
 * Copy data from obj1 to obj2
 */
export function objectCopyValue(obj1: Record<string, any>, obj2: Record<string, any>) {
  for (const key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (typeof obj1[key] === 'object' && !Array.isArray(obj1[key])) {
        // If current property is an object (not array), recursively call copyValues
        obj2[key] = objectCopyValue(obj1[key], obj2[key] || {});
      } else {
        // Otherwise copy value directly
        obj2[key] = obj1[key];
      }
    }
  }
  return obj2;
}

/**
 * Load font
 * @param fontFamily
 * @param url
 */
if (!(window as any)._hasLoadFonts) {
  (window as any)._hasLoadFonts = {};
}
export async function loadFont(fontFamily: string, url: string) {
  if ((window as any)._hasLoadFonts[fontFamily]) {
    console.log('Font already loaded', fontFamily);
    return true;
  }
  (window as any)._hasLoadFonts[fontFamily] = true;

  if (fontFamily && !url) {
    url = `/assets/fonts/${fontFamily}/font.woff`;
  }
  console.log('url', url);
  if (url) {
    const prefont = new FontFace(fontFamily, `url("${url}")`);
    try {
      const res = await prefont.load();
      document.fonts.add(res);
      return true;
    } catch (err) {
      console.error('Font resource loading error', url);
    }
  } else {
    console.error('Font resource file does not exist');
  }
  return false;
}

/**
 * Get parent element object by id
 * @param arr
 * @param id
 * @returns
 */
export function findParentById(arr: GroupLayer[], id: string) {
  for (let i = 0; i < arr.length; i++) {
    const currentElement = arr[i];

    // Check if current element contains child elements
    if (currentElement.childs && currentElement.childs.length > 0) {
      // Recursive call to find if child elements contain the specified id
      const childResult = findParentById(currentElement.childs as GroupLayer[], id);

      // If found, return current element as parent
      if (childResult) {
        return currentElement;
      }
    }

    // Check if current element is the target element
    if (currentElement.id === id) {
      return null; // If current element is the target, it has no parent, return null
    }
  }

  return null; // If no matching element found, return null
}

/**
 * Calculate the maximum full centered display size of an image
 * @param size
 * @returns
 */
export function calcSizeAndPosition(
  itemSize: { width: number; height: number },
  boxSize: { width: number; height: number },
): { width: number; height: number; x: number; y: number } {
  const res = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };

  const divWidth = boxSize.width;
  const divHeight = boxSize.height;

  const imgWidth = itemSize.width;
  const imgHeight = itemSize.height;

  // Calculate the maximum full centered display size of the image
  let maxWidth: number, maxHeight: number;
  const divRatio = divWidth / divHeight;
  const imgRatio = imgWidth / imgHeight;

  if (divRatio > imgRatio) {
    maxHeight = divHeight;
    maxWidth = maxHeight * imgRatio;
  } else {
    maxWidth = divWidth;
    maxHeight = maxWidth / imgRatio;
  }

  if (maxWidth > imgWidth) {
    maxWidth = imgWidth;
  }
  if (maxHeight > imgHeight) {
    maxHeight = imgHeight;
  }

  res.width = maxWidth;
  res.height = maxHeight;
  res.x = (divWidth - maxWidth) / 2;
  res.y = (divHeight - maxHeight) / 2;

  // Center
  res.x += res.width / 2;
  res.y += res.height / 2;

  return res;
}

/**
 * Round to integer
 */
export function toNum(n: number, m?: number) {
  if (m === undefined) {
    m = 0;
  }
  if (n === null || n === undefined) {
    n = 0;
  }
  try {
    let v = Number(n.toFixed(m));
    if (isNaN(v)) {
      v = 0;
    }
    return v;
  } catch (err) {
    console.error(err);
    return 0;
  }
}

/**
 * Get corresponding DOM element by element id
 * @param ids
 * @returns
 */
export function getTargetByIds(ids: string[]) {
  // Element selection
  const targets = [] as HTMLElement[];
  ids.forEach(id => {
    const target = document.querySelector(`[data-elementid="${id}"]`) as HTMLElement;
    if (target) {
      // console.dir(target);
      targets.push(target);
    }
  });
  return targets;
}
