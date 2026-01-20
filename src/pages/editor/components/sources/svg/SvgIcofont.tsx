import styles from './styles.module.less';
import React, { useEffect, useState } from 'react';
import { Input } from '@douyinfe/semi-ui';

export interface IProps {}

export default function SvgIcofont(props: IProps) {
  const [keywords, setKeywords] = useState('');

  return (
    <div className={styles.iconfont}>
      <div className={styles.search}>
        <Input placeholder="Enter icon name to search" className={styles.input} value={keywords} onChange={setKeywords} />
        <a
          className={styles.btn}
          href={`https://www.iconfont.cn/search/index?q=${encodeURIComponent(
            keywords,
          )}&page=1&searchType=icon&fromCollection=-1`}
          target="_blank"
        >
          검색
        </a>
      </div>
      <div className={styles.tips}>
        <h3>How to Use</h3>
        <p>1. Go to iconfont to search for icons</p>
        <p>2. Select an icon and click the download button</p>
        <p>3. Click "Copy SVG code"</p>
        <p>4. Return to the canvas and press Ctrl+V to paste</p>
      </div>
    </div>
  );
}
