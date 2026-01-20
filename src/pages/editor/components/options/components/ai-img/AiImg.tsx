import styles from './style.module.less';
import Item from '../item';
import { Modal, Toast } from '@douyinfe/semi-ui';
// import {
//   AlignLeft,
//   AlignHorizontally,
//   AlignRight,
//   AlignTop,
//   AlignVertically,
//   AlignBottom,
//   // DistributeHorizontalSpacing,
//   // DistributeVerticalSpacing,
// } from '@icon-park/react';
import { observer } from 'mobx-react';
import { editor } from '@stores/editor';
import { pubsub } from '@utils/pubsub';
import * as aiIco from './icon';
import { language } from '@language';

export interface IProps {}

function Align(props: IProps) {
  const elementData = editor.getElementData() as any;
  // const { width, height } = editor.data;
  return (
    <Item title={language.val('ai_features')}>
      <div className={styles.btns}>
        <a
          onClick={() => {
            Toast.warning(language.val('toast_wait_contribution'));
          }}
        >
          <aiIco.AiBg color="#fff" />
          {language.val('ai_remove_bg')}
        </a>
        <a
          onClick={() => {
            Toast.warning(language.val('toast_visit_official'));
          }}
        >
          <aiIco.AiKouTu color="#fff" />
          {language.val('ai_matting')}
        </a>
      </div>
      <div className={styles.btns}>
        <a
          onClick={() => {
            Toast.warning(language.val('toast_wait_contribution'));
          }}
        >
          <aiIco.AiQingXi color="#fff" />
          {language.val('ai_enhance')}
        </a>
        <a
          onClick={() => {
            Toast.warning(language.val('toast_wait_contribution'));
          }}
        >
          <aiIco.AiTuMo color="#fff" />
          {language.val('ai_inpaint')}
        </a>
      </div>
    </Item>
  );
}

export default observer(Align);
