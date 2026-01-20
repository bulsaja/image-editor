import React, { useReducer } from 'react';
import Item from '@options/item';
import { editor } from '@stores/editor';
import { util } from '@utils/index';
import { observer } from 'mobx-react';
import SetColor from '@options/set-color';
import { BarcodeLayer } from './types';
import useUpdate from '@options/useUpdate';
import { TextArea, Toast } from '@douyinfe/semi-ui';
import tinycolor from 'tinycolor2';

export interface IProps {}

function BarOption(props: IProps) {
  const elementData = editor.getElementData() as BarcodeLayer;
  const [forceUpdate] = useUpdate();
  return (
    <>
      <Item title="Barcode Content">
        <TextArea
          value={elementData.content}
          onChange={e => {
            if (/^[a-zA-Z0-9-]+$/.test(e)) {
              elementData.content = e;
              editor.updateCanvas();
              forceUpdate();
            } else {
              Toast.error('Please enter numbers, letters, or hyphens');
            }
          }}
          autosize
          maxCount={1000}
          onBlur={() => {
            editor.record({
              type: 'update',
              desc: 'Update barcode text content',
            });
          }}
        />
      </Item>
      <Item title="Color">
        <SetColor
          list={true}
          color={{
            type: 'solid',
            color: elementData.color,
          }}
          onChange={(v: any) => {
            elementData.color = tinycolor(v.color).toHex();
            editor.updateCanvas();
            forceUpdate();
            editor.record({
              type: 'update',
              desc: 'Update barcode color',
            });
          }}
        />
      </Item>
    </>
  );
}

export default observer(BarOption);
