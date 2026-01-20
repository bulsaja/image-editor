import styles from './styles.module.less';
import Item from '../item';
import { Tooltip } from '@douyinfe/semi-ui';
import {
  AlignLeft,
  AlignHorizontally,
  AlignRight,
  AlignTop,
  AlignVertically,
  AlignBottom,
  DistributeHorizontalSpacing,
  DistributeVerticalSpacing,
  Group,
} from '@icon-park/react';
import { observer } from 'mobx-react';
import { editor } from '@stores/editor';
// import { GroupLayer } from '@pages/editor/core/types/data';
// import { util } from '@utils/index';

export interface IProps {}

function GroupAlign(props: IProps) {
  const elements = editor.getGroupElementData() as any[];
  const { width, height } = editor.pageData;
  return (
    <Item title="정렬 방식">
      <div className={styles.align}>
        <Tooltip content={'왼쪽 정렬'}>
          <a
            onClick={() => {
              const minx = Math.min(...elements.map(d => d.x));
              elements.forEach(elem => {
                elem.x = minx;
              });
              editor.updateCanvas();
              editor.store.emitControl(elements.map(d => d.id));
              editor.updateOption();
            }}
          >
            <AlignLeft theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={'수평 정렬'}>
          <a
            onClick={() => {
              // 중앙 계산
              const miny = Math.min(...elements.map(d => d.y));
              const maxy = Math.max(...elements.map(d => d.y + d.height));
              const center = (maxy + miny) / 2;
              elements.forEach(elem => {
                elem.y = center - elem.height / 2;
              });
              editor.updateCanvas();
              editor.store.emitControl(elements.map(d => d.id));
              editor.updateOption();
            }}
          >
            <AlignHorizontally theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={'오른쪽 정렬'}>
          <a
            onClick={() => {
              const maxx = Math.max(...elements.map(d => d.x + d.width));
              elements.forEach(elem => {
                elem.x = maxx - elem.width;
              });
              editor.updateCanvas();
              editor.store.emitControl(elements.map(d => d.id));
              editor.updateOption();
            }}
          >
            <AlignRight theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={'상단 정렬'}>
          <a
            onClick={() => {
              const miny = Math.min(...elements.map(d => d.y));
              elements.forEach(elem => {
                elem.y = miny;
              });
              editor.updateCanvas();
              editor.store.emitControl(elements.map(d => d.id));
              editor.updateOption();
            }}
          >
            <AlignTop theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={'수직 정렬'}>
          <a
            onClick={() => {
              const minx = Math.min(...elements.map(d => d.x));
              const maxx = Math.max(...elements.map(d => d.x + d.width));
              const center = (maxx + minx) / 2;
              elements.forEach(elem => {
                elem.x = center - elem.width / 2;
              });
              editor.updateCanvas();
              editor.store.emitControl(elements.map(d => d.id));
              editor.updateOption();
            }}
          >
            <AlignVertically theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={'하단 정렬'}>
          <a
            onClick={() => {
              const maxy = Math.max(...elements.map(d => d.y + d.height));
              elements.forEach(elem => {
                elem.y = maxy - elem.height;
              });
              editor.updateCanvas();
              editor.store.emitControl(elements.map(d => d.id));
              editor.updateOption();
            }}
          >
            <AlignBottom theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={'수평 간격 분배'}>
          <a
            onClick={() => {
              // 간격 계산
              const minx = Math.min(...elements.map(d => d.x - d.width / 2));
              const maxx = Math.max(...elements.map(d => d.x + d.width / 2));
              const elementsSort = [...elements].sort((a, b) => {
                return a.x - b.x;
              });
              const totalWidth = elements.reduce((a, b) => {
                return a + b.width;
              }, 0);
              const space = (maxx - minx - totalWidth) / (elements.length - 1);
              let prevx = elementsSort[0].x + elementsSort[0].width / 2;
              elementsSort.forEach((elem, index) => {
                if (index !== 0) {
                  elem.x = prevx + space + elem.width / 2;
                  prevx = elem.x + elem.width / 2;
                }
              });
              editor.updateCanvas();
              editor.store.emitControl(elements.map(d => d.id));
              editor.updateOption();
            }}
          >
            <DistributeHorizontalSpacing theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip>
        <Tooltip content={'수직 간격 분배'}>
          <a
            onClick={() => {
              // 간격 계산
              const miny = Math.min(...elements.map(d => d.y - d.height / 2));
              const maxy = Math.max(...elements.map(d => d.y + d.height / 2));
              const elementsSort = [...elements].sort((a, b) => {
                return a.y - b.y;
              });
              const totalHeight = elements.reduce((a, b) => {
                return a + b.height;
              }, 0);
              const space = (maxy - miny - totalHeight) / (elements.length - 1);
              let prevy = elementsSort[0].y + elementsSort[0].height / 2;
              elementsSort.forEach((elem, index) => {
                if (index !== 0) {
                  elem.y = prevy + space + elem.height / 2;
                  prevy = elem.y + elem.height / 2;
                }
              });
              editor.updateCanvas();
              editor.store.emitControl(elements.map(d => d.id));
              editor.updateOption();
            }}
          >
            <DistributeVerticalSpacing theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </Tooltip>
      </div>

      {/* <div className={styles.spaces}>
        <a
          onClick={() => {
            console.log([...editor.selectedElementIds]);
            // 데이터 병합
            const g = editor.store.groupData([...editor.selectedElementIds]);
            editor.setSelectedElementIds([g.id]);
            editor.store.emitControl([g.id]);
          }}
        >
          <Group theme="filled" size="20" fill="var(--theme-icon)" />
        </a>
        <a>삭제</a>
        <a>복사</a>
        <a>수직 간격</a>
        <a>수평 간격</a>
      </div> */}
    </Item>
  );
}

export default observer(GroupAlign);
