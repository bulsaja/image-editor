import styles from './login-mobile.module.less';
import React, { useRef, useState } from 'react';
import { Form, Button, Row, Col, Toast } from '@douyinfe/semi-ui';
import { userService } from '@server/index';
import { pubsub } from '@utils/index';

function LoginMobile({ setShow }: any) {
  const formRef = useRef<any>();
  const formApiRef = useRef<any>();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Bulsaja 로그인 API 호출
      const [res, err] = await userService.loginBulsaja({
        email: values.email,
        password: values.password,
      });

      if (res && res.loginSuccess) {
        Toast.success('로그인 성공!');
        (window as any).RouterHistory.push('./manage');
        pubsub.publish('showLoginModal', false);
      } else {
        Toast.error(err || '로그인 실패');
      }
    } catch (error: any) {
      Toast.error(error.message || '로그인 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const getFormApi = (formApi: any) => {
    formApiRef.current = formApi;
  };

  return (
    <div className={styles.loginMobile}>
      <p className={styles.title}>
        <span className={styles.text}>이메일 로그인</span>
      </p>
      <Form name="basic" ref={formRef} getFormApi={getFormApi} onSubmit={onFinish}>
        <Row gutter={8} className={styles.fromItem}>
          <Col span={24}>
            <Form.Input
              noLabel
              field="email"
              type="email"
              rules={[
                { required: true, message: '이메일을 입력하세요' },
                { type: 'email', message: '올바른 이메일 형식을 입력하세요' },
              ]}
              placeholder="이메일을 입력하세요"
            />
          </Col>
        </Row>
        <Row gutter={8} className={styles.fromItem}>
          <Col span={24}>
            <Form.Input
              noLabel
              field="password"
              type="password"
              rules={[{ required: true, message: '비밀번호를 입력하세요' }]}
              placeholder="비밀번호를 입력하세요"
            />
          </Col>
        </Row>
        <Row gutter={8} className={styles.fromBtnItem}>
          <Col span={24}>
            <Button type="primary" htmlType="submit" block={true} loading={loading}>
              로그인
            </Button>
          </Col>
        </Row>
      </Form>
      <p style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: '#888' }}>
        불사자 계정으로 로그인하세요
      </p>
    </div>
  );
}

export default LoginMobile;
