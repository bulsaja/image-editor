import styles from './login-register-box.module.less';
import React, { useState, useEffect, useRef } from 'react';
import { config } from '@config/index';
import { Divider, Toast } from '@douyinfe/semi-ui';
import LoginQrcode from '../loginQrcode';
import LoginMobile from '../loginMobile';
import { userService } from '@server/index';
import { withRouter } from 'react-router-dom';
import { Wechat, Phone, Check } from '@icon-park/react';

function LoginRegisterBox() {
  const [show, setShow] = useState('loginQrcode');

  const showOAuthWindow = () => {
    let url = `${config.apiHost}/account/login/provider/qq?type=login`;
    window.open(url, '', 'width=500,height=500,channelmode=yes');
  };

  const handlePostMessage = async (evt: any) => {
    if (evt.data.msgType !== 'oauth-login') {
      return;
    }
    const { provider, code } = evt.data;
    if (provider) {
      const hide = Toast.info('로그인 중, 잠시만 기다려주세요');
      await userService.oauthLogin(code);
      Toast.close(hide);
      (window as any).RouterHistory.push(location.pathname);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handlePostMessage);
    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
  });

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
          {show === 'loginQrcode' && <LoginQrcode />}
          {show === 'loginMobile' && <LoginMobile setShow={setShow} />}
        </div>
        <Divider>다른 로그인 방법</Divider>
        <div className={styles.loginRegisterActions}>
          <a className={styles.item} onClick={() => setShow('loginMobile')}>
            <Phone theme="filled" size="24" fill="#666" />
            <span>휴대폰 로그인</span>
          </a>
          <a className={styles.item} onClick={() => setShow('loginQrcode')}>
            <Wechat theme="filled" size="24" fill="#666" />
            <span>카카오 로그인</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default withRouter(LoginRegisterBox);
