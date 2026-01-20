import dayjs from 'dayjs';
import simpleQueryString from 'simple-query-string';
import { nanoid } from 'nanoid';

/**
 * Generate a unique ID
 * @returns
 */
export function createID(n?: number): string {
  return nanoid(n ? n : 16);
}

// Check if string is SVG format
export function isSVGString(str: string): boolean {
  // Use DOMParser to try parsing the string
  var parser = new DOMParser();
  var doc = parser.parseFromString(str, 'image/svg+xml');

  // Check if the parsed document contains a valid SVG element
  return doc.documentElement.tagName.toLowerCase() === 'svg';
}

export function base642URL(base64: string) {
  return URL.createObjectURL(dataURLtoBlob(base64));
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min); // Ensure min is an integer
  max = Math.floor(max); // Ensure max is an integer
  return Math.floor(Math.random() * (max - min + 1)) + min; // Return an integer between min and max
}

// Base64 to Blob
export function dataURLtoBlob(dataurl: string): Blob {
  const arr: string[] = dataurl.split(','),
    //@ts-ignore
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]);
  let n: number = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export function scaleBase64(base64: string, scale: number): Promise<string> {
  return new Promise(resolve => {
    // Create an Image object
    let img = new Image();
    img.src = base64;

    // Wait for image to load
    img.onload = function () {
      // Calculate scaled width and height
      let newWidth = img.width * 0.5;
      let newHeight = img.height * 0.5;

      // Create a Canvas element
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');

      // Set Canvas size
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw scaled image on Canvas
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Convert Canvas to base64 image
      const resizedBase64 = canvas.toDataURL('image/png');

      // Output scaled base64 image
      resolve(resizedBase64);
    };
  });
}

/**
 * Async load media resource
 * @param src
 * @param type
 * @returns
 */
export function mediaLazy(
  src: string,
  time?: number,
  type?: 'video' | 'audio',
): Promise<HTMLVideoElement | HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const media = document.createElement(type || 'video');
    media.preload = 'auto';
    media.crossOrigin = 'Anonymous';
    media.autoplay = false;
    media.src = src;
    media.setAttribute('playsinline', '');
    media.setAttribute('webkit-playsinline', '');
    if (time !== undefined) {
      media.currentTime = time;
    }
    media.onerror = err => {
      console.error('Media resource failed', src, err);
      reject();
    };
    media.oncanplaythrough = () => {
      console.log('Load success');
      resolve(media);
    };
  });
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

const dateFormatPreset: Record<string, string> = {
  datetime: 'YYYY/MM/DD HH:mm:ss',
  date: 'YYYY/MM/DD',
  time: 'HH:mm:ss',
};

/**
 * Collision detection, check if box1 and box2 collide
 */
export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}
export function crashRects(box1: Box, box2: Box): boolean {
  const { x: x1, y: y1, width: width1, height: height1 } = box1;
  let { x: x2, y: y2, width: width2, height: height2 } = box2;
  let isCrash = true;
  if (x1 + width1 < x2 || x2 + width2 < x1 || y1 + height1 < y2 || y2 + height2 < y1) {
    isCrash = false;
  }
  return isCrash;
}

// Convert normal time format to seconds
export const timeToSec = (time: string): number => {
  const timeArr = time.split(':');
  const hour = Number(timeArr[0]);
  const minute = Number(timeArr[1]);
  const sec = timeArr[2];
  return Number(3600 * hour) + Number(60 * minute) + Number(sec);
};

export function reJSON(data: any) {
  if (typeof data === 'string') {
    return JSON.parse(data);
  } else {
    return data;
  }
}

/**
 * Get file extension
 */
export function getFileExtension(url: string) {
  url = url.split('?')[0];
  const pathArray = url.split('.');
  if (pathArray.length > 1) {
    return pathArray.pop().toLowerCase();
  } else {
    return null; // No extension
  }
}

/**
 * Get file type: audio, video, image
 */
export function getFileTypeByURL(url: string, ext?: string) {
  if (!ext) {
    ext = getFileExtension(url);
  }
  if (ext) {
    switch (ext.toLocaleLowerCase()) {
      case 'png':
      case 'jpeg':
      case 'jpg':
        return 'image';
      case 'gif':
        return 'image/gif';
      case 'svg':
        return 'image/svg';
      case 'aac':
      case 'wav':
      case 'mp3':
        return 'audio';
      case 'mp4':
        return 'video';
      default:
        return null;
    }
  } else {
    return null;
  }
}

/**
 * Draw video frame, return base64
 * @param video
 * @param limitWidth
 */
export async function drawVideoFrame(video: HTMLVideoElement, limitWidth: number, time?: number) {
  video = video.cloneNode() as any;
  video.muted = true;
  video.currentTime = time || 1;
  await video.play();
  video.pause();
  const canvas = document.createElement('canvas'),
    width = video.videoWidth, // Canvas size same as image
    height = video.videoHeight;
  const scale = limitWidth / width;
  canvas.width = limitWidth;
  canvas.height = Math.floor(height * scale);
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height); // Draw canvas
  const thumb = canvas.toDataURL('image/jpeg');
  return thumb;
}

/**
 * Group array into chunks of chunkSize elements [1,2,3,4,5] = 3 => [[1,2,3], [4,5]]
 * @param arr
 * @param chunkSize
 * @returns
 */
export function splitArray(arr: any[], chunkSize: number) {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}

// Convert seconds to normal time
export const secToTime = (totalSeconds: number, format = 'hh:mm:ss:ms', min?: 'min1'): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const [zs, xs = '0'] = totalSeconds.toString().split('.');
  const milliseconds = xs;

  let formatTokens: any = {
    hh: hours.toString().padStart(2, '0'),
    'h?': hours.toString().padStart(2, '0'),
    h: hours.toString(),
    mm: minutes.toString().padStart(2, '0'),
    m: minutes.toString(),
    ss: seconds.toString().padStart(2, '0'),
    s: seconds.toString(),
    ms: milliseconds.padEnd(2, '0').slice(0, 2),
    mss: milliseconds.padEnd(3, '0').slice(0, 3),
  };

  const str: any[] = [];
  format.split(':').forEach(k => {
    if (k.indexOf('?') !== -1) {
      if (formatTokens[k] !== '00') {
        str.push(formatTokens[k]);
      } else {
        // ...
      }
    } else {
      str.push(formatTokens[k]);
    }
  });
  let val = str.join(':');
  if (min === 'min1' && val === '00:00') {
    return '00:01';
  }
  return val;
};

export function randomNum(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export const toTime = (s: number): string => {
  const hour: number = parseInt(s / 3600 + '');
  const minute: number = parseInt((s - hour * 3600) / 60 + '');
  const sec: number = s - hour * 3600 - minute * 60;
  const H: number | string = hour > 9 ? hour : '0' + hour;
  const M: number | string = minute > 9 ? minute : '0' + minute;
  const S: number | string = sec > 9 ? parseInt(sec + '') : '0' + parseInt(sec + '');
  let MS: number | string;
  if ((s + '').indexOf('.') > -1) {
    MS = Number((s + '').substring((s + '').indexOf('.'))) * 1000;
  } else {
    MS = 0;
  }
  MS = parseInt(MS + '', 10);
  MS = MS > 10 ? MS : '0' + MS;
  if (s < 3600) {
    return M + ':' + S + ':' + MS;
  } else {
    return H + ':' + M + ':' + S + ':' + MS;
  }
};

export const getPlatform = (): string => {
  const isWin: boolean = navigator.platform == 'Win32' || navigator.platform == 'Windows';
  if (isWin) return 'Win';
  const isMac: boolean =
    navigator.platform == 'Mac68K' ||
    navigator.platform == 'MacPPC' ||
    navigator.platform == 'Macintosh' ||
    navigator.platform == 'MacIntel';
  if (isMac) return 'Mac';
  return '';
};

/**
 * Convert seconds to mm:ss time
 */
export const secondToTime = (t: number): string => {
  let m: number | string = Math.floor(t / 60);
  if (m < 10) {
    m = '0' + m;
  }
  return m + ':' + ((t % 60) / 100).toFixed(2).slice(-2);
};

export const formatTime = (time: number): string => {
  time = parseInt(time + '', 10);
  let mm: number | string = parseInt(time / 60 + '', 10);
  let ss: number | string = time - mm * 60;
  if (mm < 10) {
    mm = '0' + mm;
  }
  if (ss < 10) {
    ss = '0' + ss;
  }
  return `${mm}:${ss}`;
};

/**
 * Layer sorting. From [0,1,2,3,4,5] drag from 3 to 0
 */
export const sortArray = (elements: any[], from: number, to: number): void => {
  // Insert from to the position of to
  const fromData = elements[from];
  elements.splice(from, 1); // Delete
  elements.splice(to, 0, fromData);
};

/**
 * Convert object to querystring, e.g., {a: 1, b: 2} to a=1&b=2
 * @param {object} data Query object
 * @returns querystring string
 */
export const data2QueryString = (data: any[]): string => {
  const str: any[] = [];
  if (data) {
    for (const key in data) {
      str.push(`${key}=${data[key]}`);
    }
  }
  return str.join('&');
};

/**
 * Get QueryString value, if name is not provided, return entire query object
 * @param {string} name querystring name to query
 */
export const getUrlQuery = (name?: string): string | { [key: string]: any } => {
  const params: { [key: string]: any } = simpleQueryString.parse(location.href);
  return name ? params[name] : params;
};

/**
 * Delete URL parameter
 * @param {*} paramKey
 */
export const delUrlParam = (paramKey: string): string => {
  let url = window.location.href; // Page URL
  const urlParam: string = window.location.search.substr(1); // Page parameters
  let nextUrl = '';
  const arr = [];
  if (urlParam != '') {
    const urlParamArr = urlParam.split('&'); // Split parameters by &
    for (let i = 0; i < urlParamArr.length; i++) {
      const paramArr = urlParamArr[i].split('='); // Split parameter key and value
      // If key doesn't match the one to delete, add to parameters
      if (paramArr[0] != paramKey) {
        arr.push(urlParamArr[i]);
      }
    }
  }
  if (arr.length > 0) {
    nextUrl = '?' + arr.join('&');
  }
  url = nextUrl;
  return url;
};

/**
 *
 * @desc   Check if string is URL
 * @param  {String} str
 * @return {Boolean}
 */
export const isUrl = (str: string): boolean => {
  return /https?:\/\/.+/i.test(str);
};

/**
 *
 * @desc   Check if string is phone number
 * @param  {String|Number} str
 * @return {Boolean}
 */
export const isPhoneNum = (str: string): boolean => {
  return /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(str);
};

/**
 * @desc Array deduplication
 */
export const uniq = (arr: any[], param: any): any[] => {
  return uniq(arr, param);
};

/**
 * Deep clone object
 * @param {*} value Object to clone
 */
export const cloneDeep = (value: any): any => {
  return cloneDeep(value);
};

export const clearSleep = (): void => {
  const _window = window as any;
  if (!_window['CORE_UTILS_SLEEPS']) {
    return;
  }
  _window['CORE_UTILS_SLEEPS'].forEach((d: any) => {
    clearTimeout(d);
  });
  _window['CORE_UTILS_SLEEPS'] = [];
};

export const sleep = (time: number) => {
  const _window = window as any;
  if (!_window['CORE_UTILS_SLEEPS']) {
    _window['CORE_UTILS_SLEEPS'] = [];
  }
  return new Promise<void>(resolve => {
    const timer = setTimeout(() => {
      resolve();
    }, time);
    _window['CORE_UTILS_SLEEPS'].push(timer);
  });
};

export const toJS = (obj: { [key: string]: any } | []) => {
  return JSON.parse(JSON.stringify(obj));
};

export const onlyNumber = (value: string): string => {
  const reg = /[0-9]/g;
  if (reg.test(value)) {
    return value;
  } else {
    return '';
  }
};

export const loadSource = (type: 'video' | 'audio', url: string): Promise<HTMLElement> => {
  return new Promise((resolve, reject) => {
    const source = document.createElement(type);
    source.src = url;
    source.addEventListener('loadedmetadata', function () {
      resolve(source);
    });
    source.onerror = () => {
      reject(source);
    };
  });
};

export const imgLazy = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function () {
      console.error('Image load failed', src, img);
      reject(img);
    };
  });
};

/**
 * Random
 * @param randomLength
 * @returns
 */
export function randomID(randomLength = 8): string {
  return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36);
}

export const formatDate = (date: string | number | Date = new Date(), format = 'datetime') => {
  return dayjs(date).format(dateFormatPreset[format] || format);
};

export async function download(url: string, name: string) {
  // let response = await fetch(url); // Convert content to blob URL
  // let blob = await response.blob();  // Create hidden downloadable link
  // let objectUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  a.remove();
}

// /**
//  * Check if elements overlap
//  */
// interface CheckElementCrashParams {
//   startTime: number;
//   duration: number;
//   speed: number;
// }
// export function checkElementCrash(elem1: CheckElementCrashParams, elem2: CheckElementCrashParams) {
//   if(elem2.startTime > elem1.startTime && elem2.startTime < elem1.startTime + elem1.duration) {}
// }
