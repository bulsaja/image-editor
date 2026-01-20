import BasicService from './BasicService';
import { user } from '@stores/user';
import { util } from '@utils/index';
import { config } from '@config/index';

const _window = window as any;

/**
 * @desc For testing
 */
class UserService extends BasicService {
  constructor() {
    super();
    // Save token
    if (user.token) {
      super._setRqHeaderToken(user.token);
    }
  }

  // Get type configuration
  getTypeTree = async () => {
    // const res = [
    //   { id: 1, key: 'material' },
    //   { id: 2, key: 'template' },
    // ];
    // return [res];
    return await this.get(`/api/v1/common/types/tree`);
  };

  // Get login QR code
  getWxQrcode = async () => {
    //
    return await this.get(`/api/v1/account/login/wqr`);
  };

  // Check if user followed via QR code
  seekWxLogin = async (sn: string) => {
    return await this.get(`/api/v1/account/login/wset?sn=${sn}`);
  };

  // Get phone verification code
  getRegisterSMS = async (data: any) => {
    return await this.post(`/api/v1/account/sms/register`, data);
  };

  // Get login phone verification code
  getLoginSMS = async (data: any) => {
    return await this.post(`/account/sms/login`, data);
  };

  // Captcha
  getCaptcha = async () => {
    return await this.get(`/api/v1/account/captcha`);
  };

  // Bind WeChat - Get QR code
  getBindWeixinCode = async () => {
    return await this.get('/api/v1/account/bind-weixin/wqr');
  };

  // WeChat binding - Result polling
  bindWeixinSeek = async (sn: string) => {
    return await this.get('/api/v1/account/bind-weixin/wset?sn=' + sn);
  };

  // Send email verification code
  sendEmailCode = async (data: any) => {
    return await this.post(`/api/v1/account/mail/register`, data);
  };

  // Bind email
  bindEmail = async (data: any) => {
    return await this.post(`/api/v1/account/mail/bind-email`, data);
  };

  // Bind phone number - phoneNumber, code
  bindPhone = async (data: { phoneNumber: string; code: string }) => {
    return await this.post(`/api/v1/account/bind-mobile`, data);
  };

  // Bind phone number, send verification code - mobile, captchaCode
  getCodeBindMobile = async (data: { mobile: string; captchaCode: string }) => {
    return await this.post(`/api/v1/account/sms/bind-mobile`, data);
  };

  // Reset password - send phone verification code - mobile, captchaCode
  getCodeResetPassword = async (data: { mobile: string; captchaCode: string; captchaKey: string }) => {
    return await this.post(`/api/v1/account/sms/recover-password`, data);
  };

  /**
   * Register
   * @param {*} registerInfo
   */
  register = async (registerInfo: { username: string; password: string; captchaCode: string }) => {
    return await this.post(`/api/v1/account/register`, registerInfo);
  };

  // Get app statistics
  getStatistics = async () => {
    return await this.get(`/api/v1/open/app-statistics`);
  };

  // Login
  login = async (params: any) => {
    const [res, err] = await this.post(`/api/v1/account/login`, params);
    if (res) {
      this._setRqHeaderToken(res.token);
    } else {
      console.log(err);
    }
    return [res, err];
  };

  // Login Fvideo
  loginFvideo = async (params: any) => {
    const [res, err] = await this.post(`https://fvideo.h5ds.com/api/v1/account/login`, params);
    if (res) {
      this._setRqHeaderToken(res.token);
    } else {
      console.log(err);
    }
    return [res, err];
  };

  // Get sign-in data
  userSign = async () => {
    let stDate = util.formatDate(+new Date(), 'YYYY-MM-DD');
    return await this.get('/api/v1/api/user-sign?stDate=' + stDate);
  };

  // Sign in
  doUserSign = async () => {
    return await this.post('/api/v1/api/user-sign');
  };

  oauthLogin = async (code: string) => {
    const [res] = await this.get('/api/v1/account/login/provider/qq/user', { params: { code } });
    if (res) {
      this._setRqHeaderToken(res.token);
      user.setToken(res.token);
      user.setUserInfo(res.user);
      return res;
    } else {
      return false;
    }
  };

  // Logout
  logout = async () => {
    const res = await this.get(`/api/v1/account/logout`);
    user.clearUserInfo();
    _window.RouterHistory.push('/');
    return res;
  };

  /**
   * Update user info, if userInfo contains avatarUrl, change avatar, otherwise change nickName, email, telphone
   * @param {*} userInfo
   */
  updateUserInfo = async (userInfo: any) => {
    return await this.put('/api/v1/account/update', userInfo);
  };

  /**
   * Change password
   */
  changePassword = async (data: { username: string; password: string; captchaCode: string }) => {
    return await this.post('/api/v1/account/change-password', data);
  };

  /**
   * Recover password
   * @param {*} data
   */
  findPassword = async (data: { mobile: string; password: string; code: string }) => {
    return await this.post('/api/v1/account/recover-password', data);
  };

  /**
   * Get user info
   */
  getUserDetail = async () => {
    const [res, err] = await this.get('/api/v1/account/info');
    if (err) {
      console.error('Login expired');
      // Logout
      user.logout();
      return [res, err];
    }
    user.setUserInfo(res);
    return [res, err];
  };

  // ============ Bulsaja API Integration ============

  /**
   * Bulsaja Email/Password Login
   */
  loginBulsaja = async (params: { email: string; password: string }) => {
    try {
      const response = await fetch(`${config.bulsajaApiHost}/auth/local/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      const res = await response.json();

      if (res && res.loginSuccess) {
        this._setRqHeaderToken(res.accessToken);
        user.setToken(res.accessToken);
        user.setUserInfo({
          id: res.userData.user_id,
          nick_name: res.userData.nickname || res.userData.email,
          avatar: res.userData.profile_image || '',
          email: res.userData.email,
          ...res.userData,
        });
        return [res, null];
      }
      return [null, res.message || '로그인 실패'];
    } catch (err: any) {
      console.error('Bulsaja login error:', err);
      return [null, err.message || '로그인 중 오류 발생'];
    }
  };

  /**
   * Bulsaja Get User Info
   */
  getUserDetailBulsaja = async () => {
    try {
      const token = user.getToken();
      if (!token) {
        return [null, '로그인이 필요합니다'];
      }
      const response = await fetch(`${config.bulsajaApiHost}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const res = await response.json();

      if (res && res.user_id) {
        user.setUserInfo({
          id: res.user_id,
          nick_name: res.nickname || res.email,
          avatar: res.profile_image || '',
          email: res.email,
          ...res,
        });
        return [res, null];
      }
      return [null, '사용자 정보 조회 실패'];
    } catch (err: any) {
      console.error('Bulsaja get user error:', err);
      user.logout();
      return [null, err.message || '사용자 정보 조회 중 오류 발생'];
    }
  };

  /**
   * Bulsaja Logout
   */
  logoutBulsaja = async () => {
    user.clearUserInfo();
    _window.RouterHistory.push('/');
    return [true, null];
  };
}

export const userService = new UserService();
