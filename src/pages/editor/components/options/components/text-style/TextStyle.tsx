import styles from './textstyle.module.less';
import Item from '../item';
import { Select, InputNumber, Toast } from '@douyinfe/semi-ui';
import {
  TextBold,
  TextItalic,
  RowHeight,
  AutoLineWidth,
  AlignTextLeft,
  TextUnderline,
  AlignTextCenter,
  AlignTextRight,
  SortFour,
  DividingLine,
  Erase,
} from '@icon-park/react';
// import Color from '../color';
// import GradualColor from '../gradual-color';
import classNames from 'classnames';
import { useState } from 'react';
import { observer } from 'mobx-react';
import { useReducer } from 'react';
import { editor } from '@stores/editor';
import { fontFamilys } from './mock';
import { util } from '@utils/index';
import { TextLayer } from '@pages/editor/core/types/data';
import { IPaint, ITextAlign } from '@leafer-ui/interface';
import { loadFont } from '@pages/editor/core/tools/utils';
import SetColor from '../set-color';
import { language } from '@language';

export interface IProps {}
function TextStyle(props: IProps) {
  const elementData = editor.getElementData() as TextLayer;
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  editor.updateKey;

  const changeAlign = (key: ITextAlign) => {
    const { textAlign } = elementData.textStyle;
    if (textAlign !== key) {
      elementData.textStyle.textAlign = key;
    }
    elementData.textStyle = { ...elementData.textStyle };
    editor.updateCanvas();
    forceUpdate();
    editor.record({
      type: 'update',
      desc: '텍스트 정렬' + key,
    });
  };

  const changeNumber = (key: string, val: number) => {
    if (['lineHeight', 'letterSpacing'].includes(key)) {
      elementData.textStyle[key].value = val;
    } else {
      elementData.textStyle[key] = val;
    }
    elementData.textStyle = { ...elementData.textStyle };
    editor.updateCanvas();
    forceUpdate();
  };

  if (!elementData.textStyle.lineHeight) {
    elementData.textStyle.lineHeight = { type: 'percent', value: 150 };
  }
  if (!elementData.textStyle.letterSpacing) {
    elementData.textStyle.letterSpacing = { type: 'percent', value: 0 };
  }

  return (
    <>
      <div className={styles.texts}>
        <div className={styles.fontSpace}>
          <Select
            onChange={e => {
              const fontFamily = fontFamilys.find(d => d.name === e);
              elementData.textStyle.fontFamily = fontFamily.name;
              elementData.fontFamilyURL = fontFamily.url;

              Toast.info({
                content: language.val('toast_font_loading'),
                duration: 99999,
              });
              loadFont(fontFamily.name, fontFamily.url).then(() => {
                editor.updateCanvas();
                forceUpdate();
                Toast.destroyAll();
                editor.record({
                  type: 'update',
                  desc: '폰트 수정',
                });
              });
            }}
            value={elementData.textStyle.fontFamily || language.val('text_default_font')}
          >
            {fontFamilys.map(item => {
              return (
                <Select.Option key={item.name} value={item.name}>
                  {item.thumb ? <img style={{ height: 24 }} src={item.thumb} alt="" /> : item.name}
                </Select.Option>
              );
            })}
          </Select>
          <InputNumber
            onChange={e => changeNumber('fontSize', util.toNum(Number(e)))}
            value={util.toNum(elementData.textStyle.fontSize)}
            innerButtons
            suffix="px"
            onBlur={() => {
              editor.record({
                type: 'update',
                desc: '텍스트 크기 수정',
              });
            }}
          />
        </div>
        <div className={styles.styleSpace}>
          <a
            className={classNames({
              [styles.active]: elementData.textStyle.fontWeight === 'bold',
            })}
            onClick={() => {
              const { fontWeight } = elementData.textStyle;
              if (fontWeight === 'bold') {
                elementData.textStyle.fontWeight = 'normal';
              } else {
                elementData.textStyle.fontWeight = 'bold';
              }
              elementData.textStyle = { ...elementData.textStyle };
              editor.updateCanvas();
              forceUpdate();
              editor.record({
                type: 'update',
                desc: '굵게',
              });
            }}
          >
            <TextBold theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
          <a
            className={classNames({
              [styles.active]: elementData.textStyle.italic === true,
            })}
            onClick={() => {
              const { italic } = elementData.textStyle;
              if (italic) {
                elementData.textStyle.italic = false;
              } else {
                elementData.textStyle.italic = true;
              }
              elementData.textStyle = { ...elementData.textStyle };
              editor.updateCanvas();
              forceUpdate();
              editor.record({
                type: 'update',
                desc: '기울임',
              });
            }}
          >
            <TextItalic theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
          <a
            className={classNames({
              [styles.active]:
                elementData.textStyle.textDecoration === 'under' || !elementData.textStyle.textDecoration,
            })}
            onClick={() => {
              const { textDecoration = 'none' } = elementData.textStyle;
              if (textDecoration !== 'none') {
                elementData.textStyle.textDecoration = 'none';
              } else {
                elementData.textStyle.textDecoration = 'under';
              }
              elementData.textStyle = { ...elementData.textStyle };
              editor.updateCanvas();
              forceUpdate();
              editor.record({
                type: 'update',
                desc: '밑줄',
              });
            }}
          >
            <TextUnderline theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
          <a
            className={classNames({
              [styles.active]: elementData.textStyle.textAlign === 'left' || !elementData.textStyle.textAlign,
            })}
            onClick={() => changeAlign('left')}
          >
            <AlignTextLeft theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
          <a
            className={classNames({
              [styles.active]: elementData.textStyle.textAlign === 'center',
            })}
            onClick={() => changeAlign('center')}
          >
            <AlignTextCenter theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
          <a
            className={classNames({
              [styles.active]: elementData.textStyle.textAlign === 'right',
            })}
            onClick={() => changeAlign('right')}
          >
            <AlignTextRight theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </div>
        <div className={styles.textSpace}>
          <InputNumber
            onChange={e => changeNumber('lineHeight', util.toNum(Number(e)))}
            value={util.toNum((elementData.textStyle.lineHeight as any).value as number)}
            suffix="%"
            prefix={
              <span className={styles.prefixIco}>
                <RowHeight theme="filled" size="16" fill="var(--theme-icon)" />
              </span>
            }
            innerButtons
            onBlur={() => {
              editor.record({
                type: 'update',
                desc: '행 높이 수정',
              });
            }}
          />
          <InputNumber
            onChange={e => changeNumber('letterSpacing', util.toNum(Number(e)))}
            value={util.toNum((elementData.textStyle.letterSpacing as any).value as number)}
            suffix="%"
            prefix={
              <span className={styles.prefixIco}>
                <AutoLineWidth theme="filled" size="16" fill="var(--theme-icon)" />
              </span>
            }
            innerButtons
            onBlur={() => {
              editor.record({
                type: 'update',
                desc: '자간 수정',
              });
            }}
          />
        </div>
      </div>
      <Item title={language.val('text_color')}>
        <SetColor
          gradual={true}
          list={true}
          color={elementData.textStyle.fill as IPaint}
          onChange={v => {
            console.log('vvv', v);
            elementData.textStyle.fill = v;
            elementData.textStyle = { ...elementData.textStyle };
            editor.updateCanvas();
          }}
        />
      </Item>
      {/* <Item title="Text Background"></Item> */}
      <Item title={language.val('text_stroke')}>
        <div className={styles.textSpace}>
          <InputNumber
            min={0}
            value={elementData.textStyle.strokeWidth as number}
            onChange={e => changeNumber('strokeWidth', util.toNum(Number(e)))}
            suffix="px"
            prefix={
              <span className={styles.prefixIco}>
                <DividingLine theme="filled" size="16" fill="var(--theme-icon)" />
              </span>
            }
            innerButtons
            onBlur={() => {
              editor.record({
                type: 'update',
                desc: '텍스트 테두리 수정',
              });
            }}
          />
          <SetColor
            gradual={false}
            list={false}
            color={(elementData.textStyle.stroke as IPaint) || { color: 'rgba(0,0,0,1)', type: 'solid' }}
            onChange={v => {
              // console.log('vvv', v);
              elementData.textStyle.stroke = v;
              elementData.textStyle = { ...elementData.textStyle };
              editor.updateCanvas();
              editor.record({
                type: 'update',
                desc: '텍스트 테두리 색상 수정',
              });
            }}
          />
        </div>
      </Item>
      {/* <Item title="Background">
        <div className={styles.backgrounds}>
          <Color />
          <a className={styles.clearColor}>
            <Erase theme="filled" size="20" fill="var(--theme-icon)" />
          </a>
        </div>
      </Item> */}
    </>
  );
}

export default observer(TextStyle);
