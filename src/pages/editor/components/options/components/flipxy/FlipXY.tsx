import styles from './styles.module.less';
import Item from '../item';
import { Tooltip } from '@douyinfe/semi-ui';
import { observer } from 'mobx-react';
import { editor } from '@stores/editor';
import { useReducer } from 'react';
import { util } from '@utils/index';
import { pubsub } from '@utils/pubsub';
import {
  FlipHorizontally,
  FlipVertically,
  Lock,
  Unlock,
  DeleteOne,
  PreviewOpen,
  Ungroup,
  Copy,
  PreviewCloseOne,
  Cutting,
} from '@icon-park/react';
import CropperImage from './CropperImage';
import { GroupLayer, ImageLayer } from '@pages/editor/core/types/data';
import { language } from '@language';

export interface IProps {}

function FlipXY(props: IProps) {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const elementData = editor.getElementData() as ImageLayer;

  editor.updateKey;
  if (!elementData) {
    return null;
  }
  return (
    <Item title={language.val('fast_operations')}>
      {/* <div>Border, Shadow, Crop, Layer, Move Down, Move Up, Bring to Front, Send to Back</div> */}
      <div className={styles.position}>
        {(elementData as any).type === 'image' && <CropperImage />}
        <Tooltip content={language.val('tooltip_flip_horizontal')}>
          <a
            onClick={() => {
              elementData.flipx = !elementData.flipx;
              editor.updateCanvas();
            }}
          >
            <FlipHorizontally size={20} color="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={language.val('tooltip_flip_vertical')}>
          <a
            onClick={() => {
              elementData.flipy = !elementData.flipy;
              editor.updateCanvas();
            }}
          >
            <FlipVertically size={20} color="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={language.val('tooltip_lock_unlock')}>
          <a
            onClick={() => {
              console.log('Lock');
              elementData._lock = !elementData._lock;
              editor.updateCanvas();
              forceUpdate();
            }}
          >
            {!elementData._lock ? (
              <Unlock size={20} color="var(--theme-icon)" />
            ) : (
              <Lock size={20} color="var(--theme-icon)" />
            )}
          </a>
        </Tooltip>
        <Tooltip content={language.val('tooltip_visible_hidden')}>
          <a
            onClick={() => {
              console.log('Visible');
              elementData._hide = !elementData._hide;
              editor.updateCanvas();
              forceUpdate();
            }}
          >
            {elementData._hide ? (
              <PreviewCloseOne size={20} color="var(--theme-icon)" />
            ) : (
              <PreviewOpen size={20} color="var(--theme-icon)" />
            )}
          </a>
        </Tooltip>
        <Tooltip content={language.val('tooltip_copy')}>
          <a
            onClick={() => {
              console.log('Copy');
              editor.copyElementData();
              // editor.updateCanvas();
            }}
          >
            <Copy size={20} color="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={language.val('tooltip_delete')}>
          <a
            onClick={() => {
              console.log('Delete');
              editor.store.deleteLayers([elementData.id]);
              editor.store.emitControl([]);
              editor.setSelectedElementIds([]);
              editor.updateCanvas();
            }}
          >
            <DeleteOne size={20} color="var(--theme-icon)" />
          </a>
        </Tooltip>
        {(elementData as any).type === 'group' && (
          <Tooltip content={language.val('tooltip_ungroup')}>
            <a
              onClick={() => {
                console.log('Ungroup to parent layer');
                const ids = editor.store.unGroupData(elementData.id);
                editor.setSelectedElementIds([ids[0]]);
                editor.store.emitControl([ids[0]]);
                editor.updateCanvasKey = util.createID();
              }}
            >
              <Ungroup size={20} color="var(--theme-icon)" />
            </a>
          </Tooltip>
        )}
      </div>
    </Item>
  );
}

export default observer(FlipXY);
