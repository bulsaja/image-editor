import React, { useEffect, useState, useReducer, useCallback, useRef } from 'react';
import styles from './projects.module.less';
import { server } from './server';
import { Toast, Popover, Modal, Pagination, Button, SplitButtonGroup, Dropdown } from '@douyinfe/semi-ui';
import { More } from '@icon-park/react';
import { IconTreeTriangleDown } from '@douyinfe/semi-icons';
import { getInitData } from './initData';
import { pageSize } from '@pages/editor/core/config/config';
import { config } from '@config/index';
import { editor } from '@stores/editor';

export interface IProps {}

export default function Projects(props: IProps) {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const projectRef = useRef<HTMLDivElement>();
  const currentName = useRef<string>();
  const params = useRef({
    page: 1,
    page_size: 20,
    keyword: '',
    category_id: '0',
  });

  // Get materials
  const getList = async () => {
    const [res, err] = await server.getDraftList({ ...params.current }); //('draft', params.current, items, server.getDraftList);
    setTotal(res.total);
    setItems(res.data);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div ref={projectRef} className={styles.projects + ' scroll'}>
      <div className={styles.add}>
        <SplitButtonGroup style={{ marginRight: 10, width: '100%', overflow: 'hidden', borderRadius: 4 }}>
          <Button
            onClick={async () => {
              Modal.confirm({
                title: 'Create new project?',
                content: 'Please save current project before creating a new one',
                okText: '확인',
                cancelText: '취소',
                onOk: async () => {
                  const ndata = getInitData();
                  const [res, err] = await server.createVideo({
                    source_id: '', // Source ID
                    category_id: 0, // Category ID
                    name: ndata.name || 'Untitled', // Name
                    description: ndata.desc || 'No description', // Description
                    width: ndata.pages[0].width, // Width
                    height: ndata.pages[0].height, // Height
                    thumb: '', // Thumbnail URL
                    data: ndata,
                  });
                  if (err) {
                    Toast.error(err);
                    return;
                  }
                  location.href = `/editor/${res.id}`;
                },
              });
            }}
            theme="solid"
            type="primary"
            style={{ width: 'calc(100% - 34px)' }}
          >
            New Project
          </Button>
          <Dropdown
            contentClassName={styles.dropdown}
            //@ts-ignore
            menu={pageSize.map(d => {
              return {
                node: 'item',
                name: (
                  <section className={styles.section}>
                    {/* <span className={styles.name}>{d.icon}</span> */}
                    <span className={styles.name}>{d.name}</span>
                    <span className={styles.size}>
                      {d.width}
                      {d.unit} x {d.height}
                      {d.unit}
                    </span>
                  </section>
                ),
                onClick: async () => {
                  Modal.confirm({
                    title: 'Create new project?',
                    content: 'Please save current project before creating a new one',
                    okText: '확인',
                    cancelText: '취소',
                    onOk: async () => {
                      const ndata = getInitData();
                      ndata.pages[0].width = d.width;
                      ndata.pages[0].height = d.height;
                      const [res, err] = await server.createVideo({
                        source_id: '', // Source ID
                        category_id: 0, // Category ID
                        name: ndata.name || 'Untitled', // Name
                        description: ndata.desc || 'No description', // Description
                        width: ndata.pages[0].width, // Width
                        height: ndata.pages[0].height, // Height
                        thumb: '', // Thumbnail URL
                        data: ndata,
                      });
                      if (err) {
                        Toast.error(err);
                        return;
                      }
                      location.href = `/editor/${res.id}`;
                    },
                  });
                },
              };
            })}
            trigger="click"
            position="bottomRight"
          >
            <Button theme="solid" type="primary" icon={<IconTreeTriangleDown />}></Button>
          </Dropdown>
        </SplitButtonGroup>
      </div>
      {items.map(item => {
        return (
          <div className={styles.item}>
            <Popover
              content={
                <ul className={styles.menus}>
                  <li
                    onClick={() => {
                      Modal.confirm({
                        title: 'Confirm delete?',
                        content: 'This action cannot be undone. Please proceed with caution.',
                        okText: '확인',
                        cancelText: '취소',
                        onOk: async () => {
                          await server.deleteDraft({ id: item.id });
                          params.current.page = 1;
                          // Update current list
                          getList();
                        },
                      });
                    }}
                  >
                    Delete
                  </li>
                  <li
                    onClick={async () => {
                      const [res, err] = await server.copyDraft({ id: item.id });
                      if (err) {
                        Toast.error('Copy failed');
                      }
                      params.current.page = 1;
                      getList();
                      Toast.success('Copy successful');
                    }}
                  >
                    Copy
                  </li>
                </ul>
              }
            >
              <div className={styles.more}>
                <More theme="outline" size="20" fill="var(--theme-icon)" />
              </div>
            </Popover>
            <a
              onClick={() => {
                Modal.confirm({
                  title: 'Switch project?',
                  content: 'Please save current project before switching',
                  okText: '확인',
                  cancelText: '취소',
                  onOk: () => {
                    location.href = `/editor/${item.id}`;
                  },
                });
              }}
            >
              <div className={styles.pic}>
                <img
                  // style={{
                  //   width: (130 * item.width) / item.height,
                  //   height: 130,
                  // }}
                  src={item.thumb ? editor.store.setURL(item.thumb) : '/assets/images/img-null.png'}
                  alt=""
                />
              </div>
            </a>
            <input
              title="Click to edit name"
              onFocus={e => {
                currentName.current = e.target.value;
              }}
              onBlur={async e => {
                if (e.target.value === currentName.current) return;
                item.name = e.target.value;
                const [res, err] = await server.updateDraft({ id: item.id, name: item.name });
                if (err) {
                  Toast.error(err);
                } else {
                  Toast.success('Update successful!');
                }
              }}
              className={styles.name}
              defaultValue={item.name || 'Untitled'}
            />
          </div>
        );
      })}
      <Pagination
        popoverPosition="right"
        size="small"
        hoverShowPageSelect={true}
        total={total}
        pageSize={20}
        onPageChange={async page => {
          console.log('ppp', page);
          params.current.page = page;
          await getList();
          projectRef.current.scrollTop = 0;
        }}
        style={{ margin: '0 20px 20px 20px' }}
      ></Pagination>
    </div>
  );
}
