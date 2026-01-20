// Check if browser is Chrome
export function isChrome() {
  return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

// Get Chrome browser version number
export function getChromeVersion() {
  const match = navigator.userAgent.match(/Chrome\/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// Check if Chrome version is greater than specified version
export function isChromeVersionGreaterThan(ver: number) {
  const chromeVersion = getChromeVersion();
  return chromeVersion && chromeVersion > ver;
}
