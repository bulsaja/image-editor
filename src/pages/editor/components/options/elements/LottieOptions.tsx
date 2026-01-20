import { editor } from '@stores/editor';
import { observer } from 'mobx-react';
import { Align, Opacity, Rotation, Size, Position, Animation, Colour } from '../components';
import { Tabs, TabPane } from '@douyinfe/semi-ui';

export interface IProps {
  element: any;
}

export default function EffectOptions(props: IProps) {
  return (
    <Tabs className="optionTabs" defaultActiveKey={'lottie'}>
      <TabPane tab="Basic" itemKey="basic">
        <div className={'scroll scrollBox'}>
          <Align />
          <Position />
          <Size />
          <Opacity />
          <Rotation />
          {/* <BlendMode /> */}
        </div>
      </TabPane>
      <TabPane tab="Animation" itemKey="animation">
        <Animation />
      </TabPane>
      <TabPane tab="Filter" itemKey="colour">
        <Colour />
      </TabPane>
    </Tabs>
  );
}
