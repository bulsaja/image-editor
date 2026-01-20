import styles from './pageoption.module.less';
import React, { useReducer } from 'react';
import Item from './components/item';
import { observer } from 'mobx-react';
import { DeleteOne, Copy } from '@icon-park/react';
import { Tooltip, Input, InputNumber, Toast, Modal } from '@douyinfe/semi-ui';
import { editor } from '@stores/editor';
import SetColor from './components/set-color';
import { pageSize } from '@pages/editor/core/config/config';
import remove from 'lodash/remove';
import { util } from '@utils/index';
import { transaction } from 'mobx';
import { language } from '@language';

export interface IProps {}

function PageOption(props: IProps) {
  const pageData = editor.pageData;
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  return (
    <div className={styles.page + ' scroll'}>
      <Item title={language.val('page_name')}>
        <Input
          value={pageData.name}
          onChange={e => {
            pageData.name = e;
            forceUpdate();
          }}
        />
      </Item>
      <Item title={language.val('page_quick_actions')}>
        <div className={styles.space}>
          <Tooltip content={language.val('page_copy_canvas')}>
            <a
              onClick={() => {
                const nPage = util.toJS(editor.pageData);
                nPage.id = util.createID();
                editor.data.pages.push(nPage);
                editor.selectPageId = nPage.id;
                Toast.success(language.val('toast_copied'));
              }}
            >
              <Copy size={20} color="var(--theme-icon)" />
            </a>
          </Tooltip>
          <Tooltip content={language.val('page_delete_canvas')}>
            <a
              onClick={() => {
                transaction(() => {
                  if (editor.data.pages.length > 1) {
                    remove(editor.data.pages, d => d.id === editor.selectPageId);
                    editor.selectPageId = editor.data.pages[0].id;
                    editor.data.selectPageId = editor.data.pages[0].id;
                    editor.updateCanvasKey = util.createID();
                  } else {
                    Toast.error(language.val('toast_keep_one_page'));
                  }
                });
                // editor.updateCanvas();
              }}
            >
              <DeleteOne size={20} color="var(--theme-icon)" />
            </a>
          </Tooltip>
        </div>
      </Item>
      <Item title={language.val('page_background_color')}>
        <SetColor
          gradual={true}
          list={true}
          color={{ type: 'solid', color: '#ffffff' }}
          onChange={v => {
            console.log('vvv', v);
            pageData.background = v;
            editor.updateCanvas();
          }}
        />
      </Item>
      <Item
        title={language.val('page_resize')}
        // extra={
        //   <span style={{ opacity: 0.5 }}>
        //     {pageData.width}px * {pageData.height}px
        //   </span>
        // }
      >
        <div className={styles.position}>
          <InputNumber
            value={pageData.width}
            innerButtons
            prefix="W"
            onBlur={e => {
              pageData.width = Number(e.target.value);
              forceUpdate();
              editor.store.autoViewSize();
              editor.updateCanvas();
            }}
          />
          <InputNumber
            value={pageData.height}
            innerButtons
            prefix="H"
            onBlur={e => {
              pageData.height = Number(e.target.value);
              forceUpdate();
              editor.store.autoViewSize();
              editor.updateCanvas();
            }}
          />
        </div>
        <div className={styles.moreSize}>
          {pageSize.map(d => {
            return (
              <section
                key={d.name}
                onClick={() => {
                  Modal.confirm({
                    title: language.val('page_resize_confirm_title'),
                    content: language.val('page_resize_confirm_content'),
                    okText: '확인',
                    cancelText: '취소',
                    onOk: () => {
                      pageData.height = d.height;
                      pageData.width = d.width;
                      forceUpdate();
                      editor.store.autoViewSize();
                      editor.updateCanvas();
                    },
                  });
                }}
              >
                {/* <span className={styles.name}>{d.icon}</span> */}
                <span className={styles.name}>{d.name}</span>
                <span className={styles.size}>
                  {d.width}
                  {d.unit} x {d.height}
                  {d.unit}
                </span>
              </section>
            );
          })}
        </div>
      </Item>
    </div>
  );
}
export default observer(PageOption);
