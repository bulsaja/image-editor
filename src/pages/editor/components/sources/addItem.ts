import { util } from '@utils/index';
import { editor } from '@stores/editor';
// import { Toast } from '@douyinfe/semi-ui';
import { ImageData, GroupData, TextData } from '../../core';
import { ImageLayer } from '@pages/editor/core/types/data';

// Add element: image, video, audio
export const addImageItem = async (item: any, dropPos?: { x: number; y: number }) => {
  console.log('Add element', item);
  const img = editor.store.helper.createLayer('image') as ImageLayer;
  img.url = item.urls.url;
  // Image size should not exceed canvas size
  const autoSize = editor.store.utils.calcSizeAndPosition(
    {
      width: item.attrs.naturalWidth || item.attrs.width,
      height: item.attrs.naturalHeight || item.attrs.height,
    },
    {
      width: editor.pageData.width,
      height: editor.pageData.height,
    },
  );
  img.naturalWidth = item.attrs.naturalWidth || item.attrs.width;
  img.naturalHeight = item.attrs.naturalHeight || item.attrs.height;
  img.width = autoSize.width;
  img.height = autoSize.height;

  if (dropPos) {
    img.x = dropPos.x;
    img.y = dropPos.y;
  }
  editor.pageData.layers.unshift(img);
  editor.updateCanvas();
  // Save history record
  editor.record({
    type: 'create',
    desc: 'Add element ' + img.id,
  });

  return img;
};

export const addTextItem = async (item: any, dropPos?: { x: number; y: number }) => {
  console.log('Add element', item);
  const tstyle = item.attrs;
  if (tstyle.fontFamily === 'Default') {
    tstyle.fill = '#000';
  }
  const text = new TextData({
    x: editor.pageData.width / 2,
    y: editor.pageData.height / 2 - tstyle.fontSize / 4,
    fontFamilyURL: `https://cdn.h5ds.com/assets/fonts/${tstyle.fontFamily}/font.woff`,
    textStyle: {
      fontSize: tstyle.fontSize / 2,
      fontFamily: tstyle.fontFamily,
      textAlign: tstyle.align,
      fill: typeof tstyle.fill === 'object' ? tstyle.fill[0] : tstyle.fill,
      stroke: tstyle.stroke,
      strokeWidth: tstyle.strokeThickness / 4,
    },
  });
  if (dropPos) {
    text.x = dropPos.x;
    text.y = dropPos.y;
  }
  console.log('text', text);
  editor.pageData.layers.unshift(text);
  editor.updateCanvas();
  // Save history record
  editor.record({
    type: 'create',
    desc: 'Add element ' + text.id,
  });

  return text;
};

export async function addItem(item: any, pos?: { x: number; y: number }) {
  switch (item.type) {
    case 'image':
      await addImageItem(item, pos);
      break;
    case 'text':
      await addTextItem(item, pos);
      break;
  }
}
