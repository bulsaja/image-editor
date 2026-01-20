import styles from './not-found.module.less';

import React, { Component } from 'react';

export default class NotFound extends Component {

  toHome = () => {
    location.href = '/';
  }

  render() {
    return (
      <div className={styles["not-found"]}>
        <div className={styles["not-found-title"]}>404----</div>
        <div className={styles["not-found-info"]}>Page Not Found</div>
        <div className={styles["not-found-content"]}>
          <p>Sorry, the page you requested was not found. The URL may be incorrect or the page has been removed.</p>
          <a type="primary" onClick={this.toHome}>
            Back Home
          </a>
        </div>
      </div>
    );
  }
}
