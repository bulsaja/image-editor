import styles from './errorBoundary.module.less';
import { Button } from '@douyinfe/semi-ui';
import React, { Component } from 'react';

interface ErrorBoundaryProps {
  children?: JSX.Element;
}

interface ErrorBoundaryStates {
  errorMsgMap: any;
  hasError: boolean;
  errorMsg: string;
}

export interface IAppProps {}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryStates> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMsg: '',
      errorMsgMap: {
        timeout: 'Sorry, loading timed out!', // Error message corresponding text
      },
    };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so next render shows fallback UI
    return { hasError: true, errorMsg: error.message };
  }

  // componentDidCatch (error, errorInfo) {
  //     // You can also report error log to server
  //     logErrorToMyService(error, errorInfo);
  // }

  public render() {
    const { errorMsgMap, hasError, errorMsg } = this.state;

    if (hasError !== false) {
      // You can customize and render fallback UI
      return (
        <div className={styles.errorBoundary}>
          <h1>{errorMsgMap[errorMsg] || 'Sorry, loading failed!'}</h1>
          <Button type="primary" key="console" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}
