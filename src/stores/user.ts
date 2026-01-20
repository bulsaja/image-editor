import { action, observable, transaction } from 'mobx';
import { storage, crypto } from '@utils/index';

/**
 * @desc Store external props data
 */
class User {
  @observable token: string = storage.local.get('bulsaja_access_token') || ''; // Access Token
  @observable refreshToken: string = storage.local.get('bulsaja_refresh_token') || ''; // Refresh Token
  @observable info: any = storage.local.get('bulsaja_user_info') ? JSON.parse(storage.local.get('bulsaja_user_info')) : null;

  /**
   * Set user info
   * @param {*} info
   */
  @action
  setUserInfo = (info: any) => {
    this.info = info;
    if (info) {
      storage.local.set('bulsaja_user_info', JSON.stringify(info));
    }
  };

  @action
  getUserInfo = () => {
    return this.info;
  };

  @action
  getToken = () => {
    return this.token;
  };

  @action
  getRefreshToken = () => {
    return this.refreshToken;
  };

  @action
  setToken = (token: string) => {
    this.token = token;
    storage.local.set('bulsaja_access_token', token);
  };

  @action
  setRefreshToken = (token: string) => {
    this.refreshToken = token;
    storage.local.set('bulsaja_refresh_token', token);
  };

  @action
  setTokens = (accessToken: string, refreshToken: string) => {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    storage.local.set('bulsaja_access_token', accessToken);
    storage.local.set('bulsaja_refresh_token', refreshToken);
  };

  @action
  updateUserInfo = (values: { [x: string]: any }) => {
    transaction(() => {
      for (let key in values) {
        this.info[key] = values[key];
      }
      storage.local.set('bulsaja_user_info', JSON.stringify(this.info));
    });
  };

  @action
  logout = async () => {
    user.clearUserInfo();
    (window as any).RouterHistory.push('/');
  };

  @action
  clearUserInfo = () => {
    transaction(() => {
      this.info = null;
      this.token = '';
      this.refreshToken = '';
    });
    storage.local.remove('bulsaja_access_token');
    storage.local.remove('bulsaja_refresh_token');
    storage.local.remove('bulsaja_user_info');
  };
}

const user = new User();

export { user, User };
