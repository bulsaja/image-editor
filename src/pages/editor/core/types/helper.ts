import { IRect } from '@leafer-ui/interface';
import { Box, Group } from 'leafer-ui';
import { BaseLayer, BasePage, ENV } from './data';
import Store from '../stores/Store';

export interface InjectParams {
  parent?: IRect;
  data?: any;
}

export interface PageSizeType {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: 'px' | 'mm' | 'cm';
  icon: JSX.Element;
}

/**
 * Parameters passed to each Layer
 */
export interface LayerProps {
  hide: boolean; // Used by editor, priority higher than visible
  lock: boolean;
  zIndex: number;
  isChild?: boolean; // If true, element is already grouped
  layer: BaseLayer;
  dirty: string; // For component update
  parent?: Group;
  store: Store;
  env: ENV;
}

/**
 * History record
 */
export type RecordType = 'delete' | 'create' | 'update' | 'global';

export type RecordMap = {
  elements_delete: BaseLayer[];
  elements_create: BaseLayer[];
  elements_update: BaseLayer[];
  global: BasePage;
};

export interface RecordItem<T> {
  desc: string; // Description
  type: T;
  selecteds?: string[]; // Currently selected elements
  data?: T extends keyof RecordMap ? RecordMap[T] : never; // History data can store any data
  mdata?: BasePage;
}

export interface RecordManager {
  add: (item: RecordItem<RecordType>) => void;
  debounceAdd: (item: RecordItem<RecordType>) => void;
  redo: () => void;
  undo: () => void;
  manager: any;
}
