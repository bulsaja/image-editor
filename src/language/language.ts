import { enUS } from './enUS';
import { storage, pubsub } from '@utils/index';
import { zhCN } from './zhCN';
import { koKR } from './koKR';

export type ValueType = 'zh-CN' | 'en-US' | 'ko-KR';

export const locals: any = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ko-KR': koKR,
};

const _window = window as any;
/**
 * Internationalization handling
 */
class Language {
  constructor() {
    _window.language = storage.local.get('language') || 'ko-KR';
    storage.local.set('language', _window.language);
  }

  // get pubsub() {
  //   return this.pubsub;
  // }

  // set pubsub(p) {
  //   this.pubsub = p;
  // }

  /**
   * Internationalization language
   * @param {string} name Field name
   * @param {object} data Template parameters: default is undefined
   * @param {string} type Language type, default is undefined
   */
  val(name: string, data?: any, type?: ValueType) {
    if (!_window.language) {
      _window.language = storage.local.get('language') || 'ko-KR';
    }
    let str = locals[type || _window.language][name] || 'not found';
    if (data) {
      for (const key in data) {
        str = str.replaceAll(`{{${key}}}`, data[key]);
      }
    }
    return str;
  }

  /**
   * Reverse lookup language
   * @param {string} value Current value
   * @param {string} type Language type of the current value
   */
  findVal(value: string, valueType = 'ko-KR') {
    if (!_window.language) {
      _window.language = storage.local.get('language') || 'ko-KR';
    }
    for (const key in locals[valueType]) {
      if (locals[valueType][key] === value) {
        return locals[_window.language][key];
      }
    }
    return 'Unknow';
  }

  getLanguage(): ValueType {
    return _window.language || storage.local.get('language') || 'ko-KR';
  }

  setLanguage(type: ValueType) {
    storage.local.set('language', type);
    _window.language = type;
    if (pubsub) {
      // Update view
      pubsub.publish('setLanguage', type);
    }
  }
}

export const language = new Language();
