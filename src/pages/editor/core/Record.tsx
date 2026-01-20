import UndoRedoManager from 'undo-redo-manager2';
import debounce from 'lodash/debounce';
import { useEffect, useRef } from 'react';
import Store from './stores/Store';
import * as utils from './tools/utils';
import type { RecordItem, RecordType } from './types/helper';
import { pubsub } from '@utils/pubsub';

export interface IProps {
  store: Store;
}

/**
 * Operation history, redo, undo
 * @param props
 * @returns
 */
function RecordManager(props: IProps) {
  const manager = useRef<any>();
  const store = props.store;

  useEffect(() => {
    manager.current = new UndoRedoManager({
      limit: 50, // Set max records to 50
    });

    const add = (item: RecordItem<RecordType>) => {
      // console.log('Record data--------------->', item, utils.toJS(store.data));
      manager.current.add({
        id: utils.createID(),
        type: 'global',
        desc: item.desc,
        selecteds: [...item.selecteds],
        mdata: utils.cloneData(store.data),
      });
      // Update test
      if (store.addRecordCallback) {
        store.addRecordCallback();
      }
    };

    // Restore data
    const restore = (item: RecordItem<RecordType>, type: 'undo' | 'redo'): boolean => {
      if (!item) {
        console.warn('Already restored to initial position');
        return false;
      }
      // Find corresponding data and set parameters
      if (item.mdata) {
        utils.objectCopyValue(item.mdata, store.data);
      }
      // Update view
      store.update();
      store.editor.update();
      pubsub.publish('emitSelectElements', [...(item.selecteds || [])]);
      return true;
    };

    // Redo
    const redo = () => {
      const item = manager.current.redo() as RecordItem<RecordType>;
      return restore(item, 'redo');
    };

    // Undo
    const undo = () => {
      const item = manager.current.undo() as RecordItem<RecordType>;
      return restore(item, 'undo');
    };

    store.record = { add, redo, undo, debounceAdd: debounce(add, 500), manager: manager.current };

    add({ type: 'global', desc: 'Initialize data', selecteds: [] });

    return () => {
      manager.current.destroy();
    };
  }, []);

  return null;
}

export default RecordManager;
