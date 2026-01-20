import styles from './colour.module.less';
import Item from '../item';
import SliderInput from '../slider-input';
// import { Switch } from '@douyinfe/semi-ui';
import { useCallback, useEffect, useState } from 'react';
// import Color from '../color';
// import { Select, InputNumber } from '@douyinfe/semi-ui';
import { useReducer } from 'react';
import { editor } from '@stores/editor';
import { observer } from 'mobx-react';
import { util } from '@utils/index';

export interface IProps {}
function Colour(props: IProps) {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const elementData = editor.getElementData() as any;

  const getValue = useCallback(
    (name: string): number => {
      if (!elementData.filters) {
        elementData.filters = [];
      }
      const filter = elementData.filters.find(d => d.name === name);
      if (filter) {
        return filter.params.value;
      }
      return 0;
    },
    [elementData.filters],
  );

  const changeValue = useCallback(
    (v: number, name: string, defaultValue?: number) => {
      if (!elementData.filters) {
        elementData.filters = [];
      }
      if (defaultValue === undefined) {
        defaultValue = 0;
      }
      v = Number(v);
      const filter = elementData.filters.find(d => d.name === name);
      if (filter) {
        filter.params.value = v;
        filter.enabled = v === defaultValue ? false : true;
      } else {
        elementData.filters.push({
          name,
          enabled: v === defaultValue ? false : true,
          params: { value: v },
        });
      }
      elementData._filtersDirty = util.createID();
      editor.updateCanvas();
      forceUpdate();
    },
    [elementData.filters],
  );

  // saturation: true, // Saturation
  // tint: true, // Tint
  // hue: true, // Hue
  // brightness: true, // Brightness
  // exposure: true, // Exposure
  // contrast: true, // Contrast
  // highlights: true, // Highlights
  // sharpen: true, // Sharpen
  // clarity: true, // Clarity
  // smooth: true, // Smooth
  // blur: true, // Blur
  // grain: true, // Grain
  // vignetteWhite: true, // White vignette
  // vignetteBlack: true, // Black vignette
  // fill: true, // Fill
  return (
    <div className={styles.colour + ' scroll'}>
      {/* <Item title="Saturation">
        <SliderInput
          min={-1}
          max={1}
          value={getValue('Saturation')}
          onChange={v => changeValue(v, 'Saturation')}
          step={0.01}
        />
      </Item> */}
      <Item title="Tint">
        <SliderInput value={getValue('Tint')} onChange={v => changeValue(v, 'Tint')} min={-1} max={1} step={0.01} />
      </Item>
      {/* <Item title="Hue">
        <SliderInput value={getValue('Hue')} onChange={v => changeValue(v, 'Hue')} min={-1} max={1} step={0.01} />
      </Item> */}
      {/* <Item title="Brightness">
        <SliderInput
          value={getValue('Brightness')}
          onChange={v => changeValue(v, 'Brightness')}
          min={-1}
          max={1}
          step={0.01}
        />
      </Item> */}
      <Item title="Exposure">
        <SliderInput
          value={getValue('Exposure')}
          onChange={v => changeValue(v, 'Exposure')}
          min={-1}
          max={1}
          step={0.01}
        />
      </Item>
      {/* <Item title="Contrast">
        <SliderInput
          value={getValue('Contrast')}
          onChange={v => changeValue(v, 'Contrast')}
          min={-1}
          max={1}
          step={0.01}
        />
      </Item> */}
      <Item title="Highlights">
        <SliderInput
          value={getValue('Highlights')}
          onChange={v => changeValue(v, 'Highlights')}
          min={-1}
          max={1}
          step={0.01}
        />
      </Item>
      <Item title="Sharpen">
        <SliderInput
          value={getValue('Sharpen')}
          onChange={v => changeValue(v, 'Sharpen')}
          min={0}
          max={1}
          step={0.01}
        />
      </Item>
      <Item title="Clarity">
        <SliderInput
          value={getValue('Clarity')}
          onChange={v => changeValue(v, 'Clarity')}
          min={-1}
          max={1}
          step={0.01}
        />
      </Item>
      <Item title="Smooth">
        <SliderInput min={0} max={1} value={getValue('Smooth')} onChange={v => changeValue(v, 'Smooth')} step={0.01} />
      </Item>
      <Item title="Grain">
        <SliderInput min={0} max={1} value={getValue('Grain')} onChange={v => changeValue(v, 'Grain')} step={0.01} />
      </Item>
      {/* <Item title="Vignette">
        <SliderInput
          min={0}
          max={1}
          value={getValue('VignetteWhite')}
          onChange={v => changeValue(v, 'VignetteWhite')}
          step={0.01}
        />
        <div className={styles.fillOption}>
          <Select defaultValue="VignetteWhite" style={{ width: '100%' }}>
            <Select.Option value="vignetteBlack">Black</Select.Option>
            <Select.Option value="VignetteWhite">White</Select.Option>
          </Select>
        </div>
      </Item> */}
      {/* <Item title="Color Fill">
        <SliderInput min={0} max={1} value={getValue('Fill')} onChange={v => changeValue(v, 'Fill')} step={0.01} />
        <div className={styles.fillOption}>
          <Color value="#ff0" onChange={() => {}} />
          <Select defaultValue="default" style={{ width: 'calc(50% - 3px)' }}>
            <Select.Option value="default">Default</Select.Option>
            <Select.Option value="ulikecam">Multiply</Select.Option>
            <Select.Option value="jianying">Enhance</Select.Option>
            <Select.Option value="xigua">Reduce</Select.Option>
          </Select>
        </div>
      </Item> */}
    </div>
  );
}

export default observer(Colour);
