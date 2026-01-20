import '@icon-park/react/styles/index.css';
import styles from './sidebar.module.less';
import logo1 from '@images/logo1.png';
import logo2 from '@images/logo2.png';
import { UploadOne, PictureOne, Stickers, Mosaic, MoreTwo, Text, Page } from '@icon-park/react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { editor } from '@stores/editor';
import KeyboardModal from './KeyboardModal';
// import { Button } from '@douyinfe/semi-ui';
import { theme } from '@theme';
import { language } from '@language';

export interface ISideBarProps {}

function SideBar(props: ISideBarProps) {
  const fill = 'var(--theme-icon)';
  editor.themeUpdateKey;
  return (
    <div className={styles.sidebar}>
      <span className={styles.logo}>
        <a target="_blank" href="/">
          <img src={theme.getTheme() === 'dark' ? logo1 : logo2} alt="" />
        </a>
      </span>
      <div className={styles.menus + ' scroll'}>
        <ul>
          {[
            {
              icon: <Page theme="outline" size="24" fill={fill} />,
              type: 'template',
              name: language.val('sidebar_template'),
            },
            {
              icon: <UploadOne theme="outline" size="24" fill={fill} />,
              type: 'my',
              name: language.val('sidebar_my'),
            },
            {
              icon: <PictureOne theme="outline" size="24" fill={fill} />,
              type: 'image',
              name: language.val('sidebar_image'),
            },
            {
              icon: <Text theme="outline" size="24" fill={fill} />,
              type: 'text',
              name: language.val('sidebar_text'),
            },
            {
              icon: <Mosaic theme="outline" size="24" fill={fill} />,
              type: 'background',
              name: language.val('sidebar_background'),
            },
            {
              icon: <Stickers theme="outline" size="24" fill={fill} />,
              type: 'svg',
              name: language.val('sidebar_sticker'),
            },
            {
              icon: <MoreTwo theme="outline" size="24" fill={fill} />,
              type: 'more',
              name: language.val('sidebar_more'),
            },
          ].map((d, i) => {
            return (
              <li
                onClick={() => {
                  editor.setSourceType(d.type as any);
                }}
                key={d.type}
                className={classNames(d.type === editor.sourceType ? styles.active : '')}
              >
                <i>{d.icon}</i>
                <p>{d.name}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.bottom}>
        <KeyboardModal />
      </div>
    </div>
  );
}

export default observer(SideBar);
