import { editor } from '@stores/editor';
import { observer } from 'mobx-react';
import {
  Align,
  Opacity,
  Rotation,
  TextContent,
  TextStyle,
  Position,
  Filter,
  Border,
  FlipXY,
  Shadow,
  Radius,
} from '../components';
import { Tabs, TabPane } from '@douyinfe/semi-ui';
import { language } from '@language';

export interface IProps {
  element: any;
}

function TextOptions(props: IProps) {
  return (
    <Tabs
      className="optionTabs"
      activeKey={editor.elementOptionType}
      onChange={e => {
        editor.elementOptionType = e as any;
      }}
    >
      <TabPane tab={language.val('options_basic')} itemKey="basic">
        <div className="scroll scrollBox">
          {/* <Align /> */}
          <FlipXY />
          <TextContent />
          <TextStyle />
          <Shadow />
          {/* <Border /> */}
          {/* <Radius /> */}
          <Opacity />
          <Position />
          <Rotation />
        </div>
      </TabPane>
      <TabPane tab={language.val('options_blend_mode')} itemKey="colour">
        <Filter />
      </TabPane>
    </Tabs>
  );
}

export default observer(TextOptions);
