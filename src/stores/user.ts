import { action, observable, transaction } from 'mobx';
import { storage, crypto } from '@utils/index';

/**
 * @desc Store external props data
 */
class User {
  @observable token: string = crypto.encrypt(storage.local.get('token')) || ''; // External parameter
  @observable info: any = null; // External parameter

  /**
   * Set user info
   * @param {*} info
   * @param {*} token
   */
  @action
  setUserInfo = (info: any) => {
    this.info = info;
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
  setToken = (token: string) => {
    token = token;
    this.token = token;
    storage.local.set('token', crypto.decrypt(token));
  };

  @action
  updateUserInfo = (values: { [x: string]: any }) => {
    transaction(() => {
      for (let key in values) {
        this.info[key] = values[key];
      }
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
    });
    storage.local.remove('token');
  };
}

const user = new User();

export { user, User };
