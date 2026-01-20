import { util } from '@utils/index';

/**
 * Preprocess data before upload
 */
export async function getUploadBeforeData(
  url: string,
  type?: 'image' | 'image/svg' | 'image/gif' | null,
  uploadBase64?: (params: {
    content: string;
    name: string;
    file_type?: 'image' | 'json' | 'txt' | 'font';
  }) => Promise<any>, // Interface for uploading base64
) {
  switch (type) {
    case 'image':
    case 'image/svg': {
      // Get cover image
      // Get file size, actual dimensions
      const info = (await imageThumb(url, 200)) as any;
      if (uploadBase64) {
        const [res] = await uploadBase64({
          content: info._base64,
          name: util.createID() + '.png',
          file_type: 'image',
        });
        return { ...info, thumb: res.storage_path };
      } else {
        return { ...info, _localURL: util.base642URL(info._base64) };
      }
    }
    case 'image/gif': {
      // Get cover image
      // Get gif frame images
      // Get file size, actual dimensions
      const info = (await imageThumb(url, 200)) as any;
      let thumb = '';
      if (uploadBase64) {
        thumb = await uploadBase64({
          content: info._base64,
          name: util.createID() + '.png',
          file_type: 'image',
        }).then(res => {
          return res[0]?.storage_path;
        });
      }
      return { ...info, thumb };
    }
    default:
      throw new Error('Unknown file type: ' + url);
  }
}

/**
 * Get image thumbnail
 * @param url
 */
export function imageThumb(
  url: string,
  limitWidth: number,
): Promise<{
  _base64: string;
  naturalWidth: number;
  naturalHeight: number;
}> {
  return new Promise(resolve => {
    const img = new Image();
    img.src = url;
    img.onload = async () => {
      const width = limitWidth;
      const height = (img.height / img.width) * limitWidth;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      // Draw thumbnail on canvas
      ctx.drawImage(img, 0, 0, width, height);
      resolve({
        _base64: canvas.toDataURL(),
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
    };
  });
}

/**
 * Draw base64 gif decomposed images into frame images
 * @param params { gifArr: string[]; delayFrame: number; totalFrame: number }
 * @param aspectRatio Aspect ratio
 * @param frameHeight
 * @returns
 */
export async function gifArr2FrameImage(
  params: { gifArr: string[]; delayFrame: number; totalFrame: number },
  aspectRatio: number,
  frameHeight: number = 50,
) {
  const { gifArr, delayFrame, totalFrame } = params;
  const canvas = document.createElement('canvas');
  const frameWidth = aspectRatio * frameHeight;
  const ctx = canvas.getContext('2d');
  const totalTime = Math.ceil(totalFrame * delayFrame);
  canvas.height = frameHeight;
  canvas.width = frameWidth * totalTime;
  // Extract one frame per second from gif
  for (let i = 0; i < totalTime; i++) {
    // Calculate which frame
    const index = Math.round(i / delayFrame);
    const _img = (await lazyBase64(gifArr[index])) as HTMLImageElement;
    ctx.drawImage(_img, i * frameWidth, 0, frameWidth, frameHeight);
  }
  return canvas.toDataURL('image/jpeg', 0.7);
}

export function lazyBase64(base64: string) {
  return new Promise(resolve => {
    const _img = new Image();
    _img.src = base64;
    _img.onload = () => {
      resolve(_img);
    };
  });
}
