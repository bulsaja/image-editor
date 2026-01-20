import styles from './header.module.less';
import { Popover, Button, Avatar, Toast, Tooltip } from '@douyinfe/semi-ui';
import { observer } from 'mobx-react';
import { LinkCloudSucess, LoadingFour, ViewList, Return, FolderCodeOne, Layers } from '@icon-park/react';
import { editor } from '@stores/editor';
import Export from './Export';
import User from './User';
import { user } from '@stores/user';
import Login from '@components/login';
import { useEffect, useReducer, useState } from 'react';
import { pubsub } from '@utils/pubsub';
import { util } from '@utils/index';
import { server } from '../../server';
import { IconSun, IconMoon } from '@douyinfe/semi-icons';
import { ViewData } from '@pages/editor/core/types/data';
import { theme, ThemeName } from '@theme';
import { language } from '@language';

export interface IProps {}

function Header(props: IProps) {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  editor.layoutKeys.header;
  const [saveLoading, setSaveLoading] = useState(false);

  const undo = () => {
    const isok = editor.store.record.undo();
    if (isok) {
      forceUpdate();
      editor.recordUpdateTestKey = +new Date();
      editor.updateComponent('options');
    } else {
      Toast.error(language.val('toast_undo_limit'));
    }
  };

  const redo = () => {
    const isok = editor.store.record.redo();
    if (isok) {
      forceUpdate();
      editor.recordUpdateTestKey = +new Date();
      editor.updateComponent('options');
    } else {
      Toast.error(language.val('toast_redo_limit'));
    }
  };

  const saveApp = async (callback?: () => void, noToast?: boolean) => {
    console.log(JSON.stringify(editor.data));

    if (!user.info && !noToast) {
      // pubsub.publish('showLoginModal');
      Toast.error(language.val('toast_login_required'));
      return;
    }
    const ndataStr = JSON.stringify(editor.data);
    const ndata = util.toJS(editor.data) as ViewData;

    if (editor.lastUpdateAppData === ndataStr) {
      console.log('Data unchanged, no update needed');
      return;
    }

    setSaveLoading(true);
    const res = await editor.store.capture({
      // scale: util.toNum(160 / editor.pageData.height, 2),
    });

    // Resize image
    const minBase = await util.scaleBase64(res.data, util.toNum(160 / editor.pageData.height, 2));

    console.log('res', res);
    const [ires] = await server.uploadBase64({
      content: minBase,
      name: util.createID() + '.png',
    });
    console.log('xxx', ires.storage_path);

    // Update page
    editor.pageData.thumb = ires.storage_path;

    editor.lastUpdateAppData = ndataStr;
    // If no appid exists during save, create one first
    if (!editor.appid) {
      const [res, err] = await server.createApp({
        source_id: '', // Source ID
        category_id: 0, // Category ID
        name: ndata.name || language.val('unnamed'), // Name
        description: ndata.desc || language.val('unnamed'), // Description
        width: ndata.pages[0].width, // Width
        height: ndata.pages[0].height, // Height
        thumb: ires.storage_path, // Thumbnail URL
        data: ndata,
      });
      if (err) {
        return Toast.error(err);
      }
      editor.appid = res.id;
      // Set URL
      window.history.pushState(null, null, '/editor/' + res.id);
    } else {
      const [res, err] = await server.updateApp({
        thumb: ires.storage_path,
        id: editor.appid,
        name: ndata.name,
        data: ndata,
        width: ndata.pages[0].width, // Width
        height: ndata.pages[0].height, // Height
      });
      if (err) {
        return Toast.error(err);
      }
    }
    setSaveLoading(false);

    if (callback) {
      callback();
    }
  };

  useEffect(() => {
    pubsub.subscribe('keyboardSaveApp', (_msg, callback) => {
      saveApp(callback);
    });
    pubsub.subscribe('keyboardUndo', undo);
    pubsub.subscribe('keyboardRedo', redo);

    // Auto save every 30 seconds
    const timer = setInterval(() => {
      saveApp(undefined, true);
    }, 1000 * 30);

    return () => {
      clearInterval(timer);
      pubsub.unsubscribe('keyboardSaveApp');
      pubsub.unsubscribe('keyboardUndo');
      pubsub.unsubscribe('keyboardRedo');
    };
  }, []);

  return (
    <>
      <div className={styles.header}>
        <section className={styles.left}>
          <Tooltip content={language.val('header_project_list')}>
            <a onClick={() => editor.setSourceType('projects')}>
              <FolderCodeOne theme="outline" size="20" fill="var(--theme-icon)" />
            </a>
          </Tooltip>
          <Tooltip content={language.val('header_multi_page')}>
            <a onClick={() => editor.setSourceType('pages')}>
              <ViewList theme="outline" size="20" fill="var(--theme-icon)" />
            </a>
          </Tooltip>
          <Tooltip content={language.val('header_layer_list')}>
            <a onClick={() => editor.setSourceType('layers')}>
              <Layers theme="outline" size="20" fill="var(--theme-icon)" />
            </a>
          </Tooltip>
          <Tooltip content={language.val('header_save')}>
            <a style={{ pointerEvents: saveLoading ? 'none' : 'initial' }} onClick={() => saveApp()}>
              {saveLoading ? (
                <LoadingFour className={styles.loadingAnimate} theme="outline" size="20" fill="var(--theme-icon)" />
              ) : (
                <LinkCloudSucess theme="outline" size="20" fill="var(--theme-icon)" />
              )}
            </a>
          </Tooltip>
          <Tooltip content={language.val('header_undo')}>
            <a onClick={undo}>
              <Return theme="outline" size="20" fill="var(--theme-icon)" />
            </a>
          </Tooltip>
          <Tooltip content={language.val('header_redo')}>
            <a onClick={redo}>
              <Return style={{ transform: `scaleX(-1)` }} theme="outline" size="20" fill="var(--theme-icon)" />
            </a>
          </Tooltip>
          <input
            placeholder={language.val('header_project_untitled')}
            className={styles.title}
            type="text"
            value={editor.data.name}
            onChange={e => {
              editor.data.name = e.target.value;
              forceUpdate();
            }}
          />
        </section>
        {/* <section className={styles.center}></section> */}
        <section className={styles.right}>
          <a
            className={styles.git}
            onClick={() => {
              if (theme.getTheme() === 'dark') {
                theme.setTheme(ThemeName.LIGHT);
                if (editor.ruler) {
                  editor.ruler.changeTheme('light');
                }
              } else {
                theme.setTheme(ThemeName.DARK);
                if (editor.ruler) {
                  editor.ruler.changeTheme('dark2');
                }
              }
              editor.themeUpdateKey = theme.getTheme();
            }}
          >
            {theme.getTheme() === 'light' ? (
              <IconMoon style={{ color: 'var(--theme-icon)' }} size="extra-large" />
            ) : (
              <IconSun style={{ color: 'var(--theme-icon)' }} size="extra-large" />
            )}
          </a>
          <Export />
          {user.info ? (
            <Popover content={<User />} position="bottomRight" trigger="click">
              <Avatar src={user.info.avatar} size="small" color="red" alt="Lisa LeBlanc">
                {user.info.nick_name}
              </Avatar>
            </Popover>
          ) : (
            <Login>
              <Button theme="solid" className={styles.login}>
                {language.val('header_login_register')}
              </Button>
            </Login>
          )}
        </section>
      </div>
      {/* {config.env === 'dev' && <RecordTest />} */}
    </>
  );
}

export default observer(Header);
