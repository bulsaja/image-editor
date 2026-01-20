import '@theme/theme.less';
import React, { Component, createRef } from 'react';
// import { Redirect, Switch } from 'react-router-dom'; // Router
import { userService } from '@server/index';
import { pubsub, util } from '@utils/index';
import { config } from '@config/index';
import { renderRoutes } from 'react-router-config';
import { user } from '@stores/user';
import { LocaleProvider } from '@douyinfe/semi-ui';
import ko_KR from '@douyinfe/semi-ui/lib/es/locale/source/ko_KR';
// import { theme, ThemeName } from './theme';

interface AppProps {
  Router: any;
  routes: any;
  location?: any;
  context?: any;
}

class App extends Component<AppProps> {
  routerRef: React.RefObject<any>;

  constructor(props: AppProps) {
    super(props);
    this.routerRef = createRef();
    // theme.setTheme(ThemeName.DARK);
  }

  /**
   * If token exists in URL, auto get token, then auto login, then remove token
   */
  urlTokenLogin = () => {
    // If token exists in URL, set token parameter first, then get user data
    let token: any = util.getUrlQuery('token');
    if (token) {
      // Remove token parameter from URL
      window.history.pushState(null, '', util.delUrlParam('token'));
      token = decodeURI(token);
      user.setToken(token);
    }

    // Need login
    if (token) {
      userService.getUserDetail();
      console.log('Need login, update user info');
    }
  };

  componentDidMount() {
    (window as any).RouterHistory = this.routerRef.current.history;
    this.urlTokenLogin();

    // Multi-language handling
    pubsub.subscribe('setLanguage', () => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    pubsub.unsubscribe('setLanguage');
  }

  render() {
    const { Router, routes, ...otherProps } = this.props;

    return (
      <LocaleProvider locale={ko_KR}>
        <Router ref={this.routerRef} basename={config.basename} {...otherProps}>
          {renderRoutes(routes)}
        </Router>
      </LocaleProvider>
    );
  }
}
export default App;
