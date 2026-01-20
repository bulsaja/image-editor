import { editor } from '@stores/editor';
import { theme } from '@theme';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Menu, Item, Separator, Submenu, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import styles from './styles.module.less';
import { util } from '@utils/index';
import { Toast } from '@douyinfe/semi-ui';
import { GroupLayer } from '@pages/editor/core/types/data';
import { language } from '@language';

export interface IProps {}

// context_menus

function ContextMenu(props: IProps) {
  const MENU_ID = 'context_menus';
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  useEffect(() => {
    editor.showContextMenu = (event: any, props: Record<string, any>) => {
      console.log('ee', event, props);
      show({
        event,
        props,
      });
    };
  }, []);

  const handleItemClick = ({ id, event, props }: any) => {
    const ids = props.layers.map(d => d.id) || [];
    switch (id) {
      case 'cut':
        editor.cutElement(ids);
        break;
      case 'copy':
        editor.copyElement(ids);
        break;
      case 'lock':
        {
          props.layers.forEach(elementData => {
            elementData._lock = !elementData._lock;
          });
          editor.updateCanvas();
        }
        break;
      case 'hide':
        {
          props.layers.forEach(elementData => {
            elementData._hide = !elementData._hide;
          });
          editor.updateCanvas();
        }
        break;
      case 'up1':
        editor.upOneElement(ids);
        break;
      case 'down1':
        editor.downOneElement(ids);
        break;
      case 'moveTop':
        editor.moveTopElement(ids);
        break;
      case 'ungroup':
        {
          const elementData = editor.getElementData();
          const ids = editor.store.unGroupData(elementData.id);
          editor.setSelectedElementIds([ids[0]]);
          editor.store.emitControl([ids[0]]);
          editor.updateCanvasKey = util.createID();
        }
        break;
      case 'group':
        {
          // Merge data
          const g = editor.store.groupData([...editor.selectedElementIds]);
          editor.setSelectedElementIds([g.id]);
          editor.store.emitControl([g.id]);
        }
        break;
      case 'moveBottom':
        editor.moveBottomElement(ids);
        break;
      case 'clearCopyTempData':
        {
          editor.copyTempData = null;
          (window as any).clipboardData = null;
          Toast.info(language.val('toast_cleanup_success'));
        }
        break;
      //etc...
    }
  };

  let group = null;
  let ungroup = null;
  if (editor.selectedElementIds.length > 1) {
    group = {
      id: 'group',
      name: language.val('context_group'),
      extra: 'Ctrl + G',
    };
  } else {
    const layer = editor.getElementData() as GroupLayer;
    if (layer && layer.type === 'group') {
      ungroup = {
        id: 'ungroup',
        name: language.val('context_ungroup'),
        extra: 'Ctrl + Shift + G',
      };
    }
  }

  const menus = [
    {
      id: 'up1',
      name: language.val('shortcut_move_up'),
      extra: 'Ctrl + ]',
    },
    {
      id: 'down1',
      name: language.val('shortcut_move_down'),
      extra: 'Ctrl + [',
    },
    {
      id: 'moveTop',
      name: language.val('shortcut_move_top'),
      extra: 'Ctrl + Shift + ]',
    },
    {
      id: 'moveBottom',
      name: language.val('shortcut_move_bottom'),
      extra: 'Ctrl + Shift + [',
    },
    {
      id: 'sp1',
      name: 'Separator',
    },
    group,
    ungroup,
    {
      id: 'cut',
      name: language.val('shortcut_cut'),
      extra: 'Ctrl + X',
    },
    {
      id: 'copy',
      name: language.val('shortcut_copy'),
      extra: 'Ctrl + C',
    },
    // {
    //   id: 'paste',
    //   name: 'Paste',
    //   extra: 'Ctrl + V',
    // },
    {
      id: 'lock',
      name: language.val('context_lock_unlock'),
      extra: '',
    },
    {
      id: 'hide',
      name: language.val('context_show_hide'),
      extra: '',
    },
    {
      id: 'clearCopyTempData',
      name: language.val('context_clear_clipboard'),
    },
  ].filter(d => d);

  editor.themeUpdateKey;
  return (
    <>
      <Menu id={MENU_ID} theme={theme.getTheme()}>
        {menus.map(d => {
          if (d.name === 'Separator') {
            return <Separator key={d.id} />;
          }
          return (
            <Item id={d.id} key={d.id} onClick={handleItemClick}>
              <div className={styles.item}>
                <span>{d.name}</span>
                <i>{d.extra}</i>
              </div>
            </Item>
          );
        })}
        {/* <Submenu label="Foobar">
          <Item id="reload" onClick={handleItemClick}>
            Reload
          </Item>
          <Item id="something" onClick={handleItemClick}>
            Do something else
          </Item>
        </Submenu> */}
      </Menu>
    </>
  );
}

export default observer(ContextMenu);
