import Source from '@pages/editor/common/source';
import styles from './styles.module.less';
import { addImageItem } from '../addItem';
import { config } from '@config/index';
import { editor } from '@stores/editor';
import { Tabs, TabPane } from '@douyinfe/semi-ui';
import BackgroundColor from './BackgroundColor';
import BackgroundImage from './BackgroundImage';
import { language } from '@language';

export interface IProps {
  show: boolean;
}

// Check if loaded, only load once
let hasRender = false;

export default function Background(props: IProps) {
  if (!hasRender) {
    if (props.show) {
      hasRender = true;
    } else {
      return null;
    }
  }

  return (
    <div style={{ height: '100%', display: props.show ? 'block' : 'none' }}>
      <Tabs className={styles.tabs} type="line">
        <TabPane tab={language.val('background_color_tab')} itemKey="projects">
          <BackgroundColor />
        </TabPane>
        <TabPane tab={language.val('background_image_tab')} itemKey="pages">
          <BackgroundImage />
        </TabPane>
      </Tabs>
    </div>
  );
}
