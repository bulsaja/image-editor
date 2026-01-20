import styles from './opacity.module.less';
import Item from '../item';
import SliderInput from '../slider-input';
import { useMemo, useReducer } from 'react';
import { observer } from 'mobx-react';
import { editor } from '@stores/editor';
import { util } from '@utils/index';
import { pubsub } from '@utils/pubsub';
import { language } from '@language';

export interface IProps {}

function Opacity(props: IProps) {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const elementData = editor.getElementData() as any;

  let opacity = elementData.opacity;
  // If alpha parameter is not set, default is 1
  if (opacity === undefined) {
    opacity = 1;
  }
  return (
    <Item title={language.val('prop_opacity')}>
      <div className={styles.opacity}>
        <SliderInput
          step={1}
          value={util.toNum(opacity * 100)}
          onChange={v => {
            elementData._dirty = util.randomID();
            elementData.opacity = util.toNum(v / 100, 2);
            forceUpdate();
            editor.updateCanvas();
          }}
          onAfterChange={() => {
            editor.record({
              type: 'update',
              desc: '투명도 설정',
            });
          }}
        />
      </div>
    </Item>
  );
}

export default observer(Opacity);
