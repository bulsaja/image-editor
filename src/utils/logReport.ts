/* eslint-disable prettier/prettier */
/**
 * Log related business processing
 */
class LogReport {
  constructor() {

    //@ts-ignore
    this.debug = window.debug;
  }

  /**
   * Get current error data
   * @param {object} param {msg, apiUrl = '', codeLine = '', codeName = '', error}
   * @returns
   */
  getParams({ msg = '', apiUrl = '', codeName = '', codeLine = '', error }: any) {
    return {
      ua: window.navigator.userAgent,
      errUrl: window.location.href,
      msg, // Specific error message
      apiUrl, // URL where error occurred
      codeLine, // Line where error occurred
      codeName, // Code module name
      error // Specific error object
    };
  }

  error(params: any) {
    console.error(this.getParams(params));
  }

  warn(params: any) {
    console.warn(this.getParams(params));
  }

  log(params: any) {
    console.log(this.getParams(params));
  }
}

const logReport = new LogReport();

export { logReport };
