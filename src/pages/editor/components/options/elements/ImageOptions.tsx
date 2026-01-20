import { editor } from '@stores/editor';
import { observer } from 'mobx-react';
import {
  Align,
  Opacity,
  Rotation,
  Size,
  Position,
  Filter,
  AiImg,
  FlipXY,
  Shadow,
  SvgColors,
  Radius,
  Border,
} from '../components';
import { Tabs, TabPane } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { language } from '@language';

export interface IProps {
  element: any;
}

function ImageOptions(props: IProps) {
  return (
    <Tabs
      className="optionTabs"
      activeKey={editor.elementOptionType}
      onChange={e => {
        editor.elementOptionType = e as any;
      }}
    >
      <TabPane tab={language.val('options_element_settings')} itemKey="basic">
        <div className={'scroll scrollBox'}>
          <AiImg />
          <FlipXY />
          <SvgColors />
          <Opacity />
          {/* <Blur /> */}
          <Shadow />
          <Border />
          <Radius />
          {/* <Align /> */}
          <Position />
          <Size />
          <Rotation />
        </div>
      </TabPane>
      <TabPane tab={language.val('options_blend_mode')} itemKey="colour">
        <Filter />
      </TabPane>
    </Tabs>
  );
}

export default observer(ImageOptions);
