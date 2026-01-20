import { ViewData } from '@pages/editor/core/types/data';
import { util } from '@utils/index';

export function getInitData(): ViewData {
  const pid = util.createID();
  return {
    name: 'Untitled',
    desc: 'No description',
    version: '1.0.0',
    thumb: '',
    createTime: 0,
    updateTime: 0,
    selectPageId: pid,
    pages: [
      {
        id: pid,
        name: 'Page 1',
        desc: 'No description',
        width: 1242,
        height: 2208,
        background: {
          type: 'solid',
          color: '#fff',
        },
        layers: [],
      },
    ],
  };
}
