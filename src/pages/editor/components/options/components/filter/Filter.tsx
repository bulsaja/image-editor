import styles from './filter.module.less';
import Item from '../item';
import { editor } from '@stores/editor';
import { ImageLayer } from '@pages/editor/core/types/data';

import { observer } from 'mobx-react';
import { list } from './mock';
import classNames from 'classnames';
import { useReducer } from 'react';

/**
 type BlendMode =
  | 'pass-through' // Pass through
  | 'normal' // Normal
  | 'multiply' // Multiply---
  | 'darken' // Darken
  | 'color-burn' // Color burn
  | 'lighten' // Lighten---
  | 'color-dodge' // Color dodge
  | 'screen' // Screen
  | 'overlay' // Overlay---
  | 'hard-light' // Hard light
  | 'soft-light' // Soft light
  | 'difference' // Difference---
  | 'exclusion' // Exclusion
  | 'hue' // Hue ---
  | 'saturation' // Saturation
  | 'color' // Color
  | 'luminosity' // Luminosity
 */

export interface IProps {}

function Filter(props: IProps) {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const elementData = editor.getElementData() as ImageLayer;
  editor.updateKey;
  if (!elementData.blendMode) {
    elementData.blendMode = 'normal';
  }
  return (
    <Item title="">
      <div className={styles.opacity}>
        {list.map(d => {
          return (
            <section
              key={d.val}
              onClick={() => {
                elementData.blendMode = d.val as any;
                editor.updateCanvas();
                forceUpdate();
              }}
              className={classNames(styles.item, {
                [styles.active]: elementData.blendMode === d.val,
              })}
            >
              {d.name}
            </section>
          );
        })}
      </div>
    </Item>
  );
}

export default observer(Filter);
