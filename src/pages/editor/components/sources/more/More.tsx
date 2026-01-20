import styles from './more.module.less';
import WaterFull from '@components/water-full';
import { PayCodeOne, VipOne, ChartHistogramOne, StereoPerspective, BarCode, Audit, Search } from '@icon-park/react';
import { DanMuIcon } from './icon';
import { addItem } from '../addItem';
import { editor } from '@stores/editor';
import { Toast } from '@douyinfe/semi-ui';
import exLayers from '@plugins/index';
import { language } from '@language';

export interface IProps {
  show: boolean;
}
let hasRender = false;

export default function More(props: IProps) {
  if (!hasRender) {
    if (props.show) {
      hasRender = true;
    } else {
      return null;
    }
  }

  const addPlus = a => {
    console.log('Add plugin', a);
    const exLayer = exLayers.find(d => d.config.pid === a.id);
    if (exLayer) {
      const ndata = new exLayer.LayerData();
      console.log(ndata);
      editor.pageData.layers.unshift(ndata);
      editor.updateCanvas();
      editor.store.emitControl([ndata.id]);
    } else {
      Toast.warning(language.val('toast_wait_contribution'));
    }
    // switch (d.id) {
    //   case 'chart':
    //     addItem({ type: 'echart' });
    //     break;
    //   case 'model3D':
    //     addItem({ type: 'model3D' });
    //     break;
    // }
  };

  return (
    <div style={{ height: '100%', display: props.show ? 'block' : 'none' }}>
      <div className={styles.moreList + ' scroll'}>
        <h1 className={styles.title}>{language.val('more_plugins')}</h1>
        <WaterFull
          itemWidth={60}
          itemClassName={styles.waterfull}
          item={(d: any) => {
            return (
              <div
                onClick={() => {
                  addPlus(d);
                }}
                className={styles.item}
              >
                <span>
                  {d.icon}
                  <p>
                    {d.vip && <VipOne theme="filled" size="14" fill="#FFA24D" />}
                    {d.name}
                  </p>
                </span>
              </div>
            );
          }}
          list={[
            {
              id: 'qrcode',
              name: language.val('plugin_qrcode'),
              icon: <PayCodeOne theme="filled" size="25" fill="var(--theme-icon)" />,
            },
            {
              id: 'barcode',
              name: language.val('plugin_barcode'),
              icon: <BarCode theme="filled" size="25" fill="var(--theme-icon)" />,
            },
            {
              id: 'chart',
              name: language.val('plugin_chart'),
              vip: false,
              icon: <ChartHistogramOne theme="filled" size="25" fill="var(--theme-icon)" />,
            },
            {
              id: 'watermark',
              name: language.val('plugin_watermark'),
              vip: false,
              icon: <Audit theme="filled" size="25" fill="var(--theme-icon)" />,
            },
          ].map(d => {
            return { ...d, width: 100, height: 100 };
          })}
        />
      </div>
    </div>
  );
}
