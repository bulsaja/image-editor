/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // More environment variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'PubSub';
declare module 'react-moveable';
declare module 'undo-redo-manager2';
declare module 'simple-query-string';
declare module 'localforage';
