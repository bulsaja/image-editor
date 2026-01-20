import styles from './login-register-box.module.less';
import React from 'react';
import LoginMobile from '../loginMobile';
import { withRouter } from 'react-router-dom';
import { Check } from '@icon-park/react';

function LoginRegisterBox() {
  return (
    <div className={styles.loginRegisterBox}>
      <div className={styles.loginRegisterInfo}>
        <h1>불사자</h1>
        <p>
          <Check theme="filled" size="16" fill="#98ff00" />
          무료 오픈소스, 확장 가능
        </p>
        <p>
          <Check theme="filled" size="16" fill="#98ff00" />
          다양한 템플릿 무료 제공
        </p>
        <p>
          <Check theme="filled" size="16" fill="#98ff00" />
          AI 기능 지원
        </p>
        <p>
          <Check theme="filled" size="16" fill="#98ff00" />
          간단한 조작, 효율적인 작업
        </p>
        <p>
          <Check theme="filled" size="16" fill="#98ff00" />
          협업 기능으로 생산성 향상
        </p>
        <p>
          <Check theme="filled" size="16" fill="#98ff00" />
          다양한 소스 무료 제공
        </p>
        <p>
          <Check theme="filled" size="16" fill="#98ff00" />
          다운로드 없이 브라우저에서 바로 사용
        </p>
        <p>
          <Check theme="filled" size="16" fill="#98ff00" />
          클라우드 저장으로 안전한 자료 관리
        </p>
      </div>
      <div className={styles.loginRegisterForm}>
        <div className={styles.loginRegisterTabs}>
          <LoginMobile />
        </div>
      </div>
    </div>
  );
}

export default withRouter(LoginRegisterBox);
