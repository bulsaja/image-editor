import { Toast, Notification } from '@douyinfe/semi-ui';
import { editor } from '@stores/editor';
import { util } from '@utils/index';
import { pubsub } from '@utils/pubsub';
import { observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import type { HotkeysEvent } from 'react-hotkeys-hook/src/types';
import { server } from '@pages/editor/components/sources/my/server';
import { addImageItem } from './components/sources/addItem';
import { user } from '@stores/user';

export interface IProps {}

function HotKeys(props: IProps) {
  const mouseXY = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = e => {
      // console.log(e.pageX, e.pageY);
      mouseXY.current.x = e.pageX;
      mouseXY.current.y = e.pageY;
    };
    document.addEventListener('mousemove', onMove);

    const pasteFuntion = async event => {
      event.stopPropagation();
      if (editor.copyTempData) {
        console.log('Paste element');
        // if (!editor.copyTempData) {
        //   Toast.error('Please use Ctrl + C to copy first');
        //   return;
        // }
        const elems = editor.cloneElements(editor.copyTempData);
        editor.pageData.layers.unshift(...elems);
        editor.updateCanvas();
        editor.setSelectedElementIds(elems.map(d => d.id));
        editor.store.emitControl(elems.map(d => d.id));
      } else {
        // If not logged in, need to login first
        if (!user.info) {
          // pubsub.publish('showLoginModal');
          Toast.error('Please login first');
          return;
        }

        const clipdata = event.clipboardData || (window as any).clipboardData;
        // console.log('clipdata', clipdata, item.getAsFile());
        const item = clipdata.items[0];
        const svgString = clipdata.getData('text/plain');
        let svgFile = null;
        if (svgString && util.isSVGString(svgString)) {
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
          svgFile = new File([svgBlob], 'image.svg', { type: 'image/svg+xml' });
        }

        // Only take the latest from clipboard
        if ((item && item.kind == 'file' && item.type.match(/^image\//i)) || svgFile) {
          const tid = Toast.info('File uploading...');
          // File upload
          const [res, err] = await server.formUpdate({
            files: svgFile ? [svgFile] : [item.getAsFile()],
            filename: `${util.createID()}.${svgFile ? 'svg' : 'png'}`,
            file_type: 'image', // file-regular file, image-image file, audio-audio file, video-video file
            app_id: editor.appid,
          });
          Toast.close(tid);

          // // Save to material library
          // const [item, err] = await server.createUserMaterial({
          //   app_id: editor.appid,
          //   name: name,
          //   urls: { url, thumb },
          //   attrs,
          // });

          const _img = await util.imgLazy(res.url);
          const imgLayer = await addImageItem({
            urls: { url: res.storage_path },
            attrs: {
              naturalWidth: _img.naturalWidth,
              naturalHeight: _img.naturalHeight,
            },
          });
          editor.setSelectedElementIds([imgLayer.id]);
          editor.store.emitControl([imgLayer.id]);

          Notification.open({
            title: 'File upload successful!',
            content: 'Supports SVG, JPEG, PNG, GIF image formats',
            duration: 3,
            position: 'bottomRight',
          });
          return;
        }
      }
    };

    window.addEventListener('paste', pasteFuntion);

    return () => {
      window.removeEventListener('paste', pasteFuntion);
      document.removeEventListener('mousemove', onMove);
    };
  }, []);

  useHotkeys(
    [
      'ctrl+c', // Copy
      'ctrl+v', // Paste
      'ctrl+s', // Save project
      'ctrl+x', // Cut selected element
      'ctrl+-', // Zoom out canvas centered
      'ctrl+=', // Zoom in canvas centered
      'ctrl+0', // Fit canvas to screen size
      'ctrl+a', // Select all
      'ctrl+d', // Deselect
      'ctrl+z', // Undo
      'ctrl+shift+z', // Redo
      'ctrl+]', // Move selected layer up one level
      'ctrl+shift+}', // Move selected layer to top
      'ctrl+[', // Move selected layer down one level
      'ctrl+shift+{', // Move selected layer to bottom
      'shift+up', // Move up 10px
      'shift+down', // Move down 10px
      'shift+left', // Move left 10px
      'shift+right', // Move right 10px
      'up', // Move up 1px
      'down', // Move down 1px
      'left', // Move left 1px
      'right', // Move right 1px
      'delete', // Delete selected element
      'backspace', // Delete selected element
    ],
    (event: KeyboardEvent, handler: HotkeysEvent) => {
      console.log('Hotkey handling--->', event, handler, handler.keys);

      if (handler.ctrl && handler.keys.join('') !== 'v') {
        event.preventDefault();
      }

      if (handler.ctrl && handler.shift) {
        // ctrl + shift + *
        switch (handler.keys.join('')) {
          case 'z':
            console.log('Redo');
            pubsub.publish('keyboardRedo');
            break;
          case '}':
            console.log('Move selected layer to top');
            editor.moveTopElement();
            break;
          case '{':
            console.log('Move selected layer to bottom');
            editor.moveBottomElement();
            break;
        }
      } else if (handler.ctrl) {
        // ctrl + *
        switch (handler.keys.join('')) {
          case ']':
            editor.upOneElement();
            break;
          case '[':
            editor.downOneElement();
            break;
          case 'z':
            console.log('Undo');
            pubsub.publish('keyboardUndo');
            break;
          case 'a':
            console.log('Select all');
            editor.setContorlAndSelectedElemenent(editor.pageData.layers.map(layer => layer.id));
            break;
          case 'd':
            console.log('Deselect');
            editor.setContorlAndSelectedElemenent([]);
            break;
          case '0':
            console.log('Fit canvas to screen');
            pubsub.publish('keyboardSetViewSize', 'fit');
            break;
          case '-':
            console.log('Zoom out canvas');
            pubsub.publish('keyboardSetViewSize', 'zoomIn');
            break;
          case '=':
            console.log('Zoom in canvas');
            pubsub.publish('keyboardSetViewSize', 'zoomOut');
            break;
          case 'c':
            editor.copyElement();
            break;
          case 'x':
            editor.cutElement();
            break;
          case 'v':
            // Handled above
            break;
          case 's':
            console.log('Save project manually');
            pubsub.publish('keyboardSaveApp');
            break;
        }
      } else if (handler.shift) {
        // shfit + *
        switch (handler.keys.join('')) {
          case 'up':
            {
              console.log('Move up 10px');
              const elems = editor.getElementDataByIds([...editor.selectedElementIds]);
              elems.forEach(el => {
                el.y -= 10;
              });
              editor.updateCanvas();
            }
            break;
          case 'down':
            {
              console.log('Move down 10px');
              const elems = editor.getElementDataByIds([...editor.selectedElementIds]);
              elems.forEach(el => {
                el.y += 10;
              });
              editor.updateCanvas();
            }
            break;
          case 'left':
            {
              console.log('Move left 10px');
              const elems = editor.getElementDataByIds([...editor.selectedElementIds]);
              elems.forEach(el => {
                el.x -= 10;
              });
              editor.updateCanvas();
            }
            break;
          case 'right':
            {
              console.log('Move right 10px');
              const elems = editor.getElementDataByIds([...editor.selectedElementIds]);
              elems.forEach(el => {
                el.x += 10;
              });
              editor.updateCanvas();
            }
            break;
        }
      } else {
        // Normal
        switch (handler.keys.join('')) {
          case 'up':
            {
              console.log('Move up 1px');
              const elems = editor.getElementDataByIds([...editor.selectedElementIds]);
              elems.forEach(el => {
                el.y -= 1;
              });
              editor.updateCanvas();
            }
            break;
          case 'down':
            {
              console.log('Move down 1px');
              const elems = editor.getElementDataByIds([...editor.selectedElementIds]);
              elems.forEach(el => {
                el.y += 1;
              });
              editor.updateCanvas();
            }
            break;
          case 'left':
            {
              console.log('Move left 1px');
              const elems = editor.getElementDataByIds([...editor.selectedElementIds]);
              elems.forEach(el => {
                el.x -= 1;
              });
              editor.updateCanvas();
            }
            break;
          case 'right':
            {
              console.log('Move right 1px');
              const elems = editor.getElementDataByIds([...editor.selectedElementIds]);
              elems.forEach(el => {
                el.x += 1;
              });
              editor.updateCanvas();
            }
            break;
          case 'delete':
          case 'backspace':
            {
              console.log('Delete', [...editor.selectedElementIds]);
              editor.store.deleteLayers([...editor.selectedElementIds]);
              editor.updateCanvas();
              editor.store.emitControl([]);
              editor.record();
            }
            break;
        }
      }
    },
  );
  return null;
}

export default observer(HotKeys);
