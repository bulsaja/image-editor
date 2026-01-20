// Configuration
const config = {
  secretKey: 'x&S#acLCx', //
  apiHost: '',
  prefix: 'img', // Project prefix, used for localStorage name
  resourcesHost: 'https://cdn.h5ds.com', // CDN resource path
  host: 'https://video.h5ds.com', // Used for QR code scanning
  basename: 'editor', // History router prefix
  env: 'dev',
  templateHost: 'https://www.h5ds.cn',
};

// Production environment parameters
if (import.meta.env.PROD) {
  config.env = 'prod';
  config.apiHost = (window as any).apiHost || '';
}

export { config };
