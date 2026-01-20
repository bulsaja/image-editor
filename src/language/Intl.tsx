import React from 'react';

import { locals } from './language';
import { storage } from '@utils/storage';

interface IProps {
  name: string;
  data?: any;
  type?: string;
}

/**
 * <Intl name=""/>
 * @param {string} name Field name
 * @param {object} data Template parameters: default is undefined
 * @param {string} type Language type, default is undefined
 */
function Intl(props: IProps): JSX.Element {
  const { name, data, type } = props;
  const _window = window as any;

  if (!_window.language) {
    _window.language = storage.local.get('language') || 'zh-CN';
  }
  if (!locals[_window.language][name]) {
    console.error('name', name);
    console.error('locals[window.language]', locals[_window.language]);
  }
  let str = locals[type || _window.language][name] || 'not found';
  if (data) {
    for (const key in data) {
      str = str.replaceAll(`{{${key}}}`, data[key]);
    }
  }

  return <>{str}</>;
}

export default Intl;
