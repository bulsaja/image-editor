import styles from './align.module.less';
import Item from '../item';
import { Tooltip } from '@douyinfe/semi-ui';
import {
  AlignLeft,
  AlignHorizontally,
  AlignRight,
  AlignTop,
  AlignVertically,
  AlignBottom,
  // DistributeHorizontalSpacing,
  // DistributeVerticalSpacing,
} from '@icon-park/react';
import { observer } from 'mobx-react';
import { editor } from '@stores/editor';
import { pubsub } from '@utils/pubsub';

export interface IProps {}

function Align(props: IProps) {
  const elementData = editor.getElementData() as any;
  const { width, height } = editor.pageData;

  return (
    <Item title="Alignment">
      <div className={styles.align}>
        <Tooltip content={'Align Left'}>
          <a
            onClick={() => {
              elementData.x = 0;
              editor.updateOption();
              editor.updateCanvas();
              editor.record({
                type: 'update',
                desc: '왼쪽 정렬',
              });
            }}
          >
            <AlignLeft theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={'Align Horizontal'}>
          <a
            onClick={() => {
              elementData.x = width / 2 - elementData.width / 2;
              editor.updateCanvas();
              editor.updateOption();
              editor.record({
                type: 'update',
                desc: '수평 정렬',
              });
            }}
          >
            <AlignHorizontally theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={'Align Right'}>
          <a
            onClick={() => {
              elementData.x = width - elementData.width;
              editor.updateCanvas();
              editor.updateOption();
              editor.record({
                type: 'update',
                desc: '오른쪽 정렬',
              });
            }}
          >
            <AlignRight theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={'Align Top'}>
          <a
            onClick={() => {
              elementData.y = 0;
              editor.updateOption();
              editor.updateCanvas();
              editor.record({
                type: 'update',
                desc: '상단 정렬',
              });
            }}
          >
            <AlignTop theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={'Align Vertical'}>
          <a
            onClick={() => {
              elementData.y = height / 2 - elementData.height / 2;
              editor.updateOption();
              editor.updateCanvas();
              editor.record({
                type: 'update',
                desc: '수직 정렬',
              });
            }}
          >
            <AlignVertically theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={'Align Bottom'}>
          <a
            onClick={() => {
              elementData.y = height - elementData.height;
              editor.updateOption();
              editor.updateCanvas();
              editor.record({
                type: 'update',
                desc: '하단 정렬',
              });
            }}
          >
            <AlignBottom theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip>
        {/* <Tooltip content={'Distribute Horizontal Spacing'}>
          <a href="#">
            <DistributeHorizontalSpacing theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={'Distribute Vertical Spacing'}>
          <a href="#">
            <DistributeVerticalSpacing theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip> */}
      </div>
    </Item>
  );
}

export default observer(Align);
