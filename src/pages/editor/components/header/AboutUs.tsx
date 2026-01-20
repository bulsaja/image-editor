import { useState } from 'react';
import { Info, Wechat } from '@icon-park/react';
import { Modal } from '@douyinfe/semi-ui';
import styles from './aboutus.module.less';
import * as icons from './icon';
import { language } from '@language';

export interface IProps {}

export default function AboutUs(props: IProps) {
  const [visible, setVisible] = useState(false);

  const limitTxt = (str: string, n?: number) => {
    if (!n) {
      n = 20;
    }
    let nstr = str.substring(0, n);
    if (nstr.length < str.length) {
      nstr += '...';
    }
    return (
      <span className={styles.desc} title={str}>
        {nstr}
      </span>
    );
  };

  return (
    <>
      <Modal
        width={1000}
        title={language.val('about_us')}
        visible={visible}
        onCancel={() => setVisible(false)}
        closeOnEsc={true}
        footer={null}
      >
        <div className={styles.info}>
          <p>
            <a href="https://www.bulsaja.com" target="_blank">
              불사자
            </a>
            는 한국 이커머스 셀러를 위한 AI 기반 통합 솔루션입니다.
            상품 관리, 주문 처리, 마켓 연동 등 다양한 기능을 제공하여 셀러의 업무 효율을 높입니다.
          </p>
          <h2>제품 라인업</h2>
          <ul className={styles.items}>
            <li>
              <a href="https://www.bulsaja.com" target="_blank">
                <i>
                  <icons.ClipIcon />
                  <em className={styles.clip}></em>
                </i>
                <h3>불사자 앱</h3>
                {limitTxt('이커머스 셀러를 위한 통합 관리 솔루션, 상품 관리, 주문 처리, 마켓 연동 등 다양한 기능 제공')}
                <span className={styles.more}>자세히 보기 →</span>
              </a>
            </li>
            <li>
              <a href="https://www.bulsaja.com" target="_blank">
                <i>
                  <icons.ImgIcon />
                  <em className={styles.img}></em>
                </i>
                <h3>이미지 편집 도구</h3>
                {limitTxt('무료 오픈소스 온라인 이미지 편집 도구, 우수한 사용자 경험과 유려한 인터페이스 제공')}
                <span className={styles.more}>자세히 보기 →</span>
              </a>
            </li>
            <li>
              <a href="https://www.bulsaja.com" target="_blank">
                <i>
                  <icons.H5Icon />
                  <em className={styles.h5}></em>
                </i>
                <h3>상품 상세 페이지 제작</h3>
                {limitTxt('온라인 랜딩 페이지 제작 도구, 프로모션 페이지, 이벤트 페이지 등 제작 가능')}
                <span className={styles.more}>자세히 보기 →</span>
              </a>
            </li>
            <li>
              <a href="https://www.bulsaja.com" target="_blank">
                <i>
                  <icons.VRIcon />
                  <em className={styles.vr}></em>
                </i>
                <h3>AI 상품 분석</h3>
                {limitTxt(
                  'AI 기반 상품 트렌드 분석 및 키워드 추천, 데이터 기반 판매 전략 수립 지원',
                )}
                <span className={styles.more}>자세히 보기 →</span>
              </a>
            </li>
            <li>
              <a href="https://www.bulsaja.com" target="_blank">
                <i>
                  <icons.CloudIcon />
                  <em className={styles.cloud}></em>
                </i>
                <h3>클라우드 스토리지</h3>
                {limitTxt(
                  '상품 이미지 및 파일 관리를 위한 클라우드 스토리지, 다중 사용자 협업 지원',
                )}
                <span className={styles.more}>자세히 보기 →</span>
              </a>
            </li>
          </ul>
          <div className={styles.footer}>
            <img style={{ width: 200 }} src="https://cdn.h5ds.com/wxq.jpg" alt="" />
            <span className={styles.wechat}>
              <i>
                <Wechat theme="filled" size="40" fill="#67b114" />
              </i>
              <h5>공식 고객센터</h5>
              <img style={{ width: 148 }} src="https://cdn.h5ds.com/wechat.jpg" alt="" />
            </span>
          </div>
        </div>
      </Modal>
      <a onClick={() => setVisible(true)} className={styles.us}>
        <Info theme="outline" size="22" fill="var(--theme-icon)" />
        {language.val('about_us')}
      </a>
    </>
  );
}
