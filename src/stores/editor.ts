import { action, observable, transaction } from 'mobx';
import { util, storage, pubsub } from '../utils';
import type * as ctypes from '@config/types';
import type { SourceItem } from '@pages/editor/types';
import { theme } from '@theme';
import { language } from '@language/language';
// import { IApp } from '@leafer-ui/interface';
import Store from '../pages/editor/core/stores/Store';
import { Ruler } from 'leafer-x-ruler';
import type { RecordItem, RecordType } from '@pages/editor/core/types/helper';
import { BaseLayer, BasePage, GroupLayer, ViewData } from '@pages/editor/core/types/data';
import remove from 'lodash/remove';
import debounce from 'lodash/debounce';
import { Toast } from '@douyinfe/semi-ui';

// Material types
export type MaterialTypes =
  | 'text'
  | 'image'
  | 'audio'
  | 'video'
  | 'sticker'
  | 'effect'
  | 'filter'
  | 'transition'
  | 'font'
  | string;

class Editor {
  public store!: Store;

  public data!: ViewData;

  // Cache copied data
  public copyTempData: any;

  // Image cropper switch
  @observable cropper: boolean = false;

  // Last updated data
  public lastUpdateAppData: any = '';

  @observable updateViewKey: string = '';

  // Function to trigger display of right-click context menu
  public showContextMenu: (event: any, props: Record<string, any>) => void;

  // Cache list data after resource switch
  public activeItems: Record<ctypes.SourceType, SourceItem[]> = {};
  // Set cache data
  setActiveItems = (items: SourceItem[], type: ctypes.SourceType) => {
    this.activeItems[type] = items;

    // For testing
    if (!(window as any).activeItems) {
      (window as any).activeItems = {};
    }
    (window as any).activeItems[type] = items;
  };
  // Read data from cache
  getFromActiveItems = (id: string, type: ctypes.SourceType) => {
    const items = this.activeItems[type] || [];
    return items.find(d => d.id === id);
  };

  // Currently selected page
  @observable selectPageId: string;

  get pageData(): BasePage {
    return this.data.pages.find(d => d.id === this.selectPageId);
  }

  // Custom option panel
  @observable optionPanelCustom: 'background' | '' = '';

  // Record APPID
  @observable appid: string = '';

  // Theme update
  @observable themeUpdateKey: 'dark' | 'light' = theme.getTheme();

  // Multi-language
  @observable languageUpdateKey: 'zh-CN' | 'en-US' = language.getLanguage();

  // For history record testing
  @observable recordUpdateTestKey: number = 1;

  // Movie created successfully
  @observable movieCreateSuccess: boolean = false;

  // Trigger settings area change
  @observable updateKey: string = '1';

  @observable updateCanvasKey: string = '1';

  @action
  updateOption = () => {
    this.updateKey = util.randomID();
  };

  @action
  updateOptionAsync = debounce(this.updateOption, 100);

  @action
  record = (params?: RecordItem<RecordType>) => {
    if (!params) {
      params = {
        type: 'global',
        desc: 'Add operation record',
        selecteds: [...editor.selectedElementIds],
      };
    }
    if (!params.selecteds) {
      params.selecteds = [...editor.selectedElementIds];
    }
    // History record
    this.store.record.add(params);
    this.recordUpdateTestKey = +new Date();
  };

  // Ruler line
  ruler: Ruler = null;

  @action
  updateCanvas = () => {
    console.log('Update canvas');
    this.updateCanvasKey = util.randomID();
    if (this.store) {
      this.store.update();
    }
  };

  @action
  updateCanvasSync = debounce(this.updateCanvas, 100);

  /**
   * Move up one layer
   * @param selectedIds
   */
  @action
  upOneElement(selectedIds?: string[]) {
    if (!selectedIds) {
      selectedIds = [...this.selectedElementIds];
    }
    // Find index of selected object
    let selectedIndexes = selectedIds.map(id => this.pageData.layers.findIndex(obj => obj.id === id));
    // Move selected object down
    const array = this.pageData.layers;
    selectedIndexes.forEach(index => {
      if (index > 0) {
        // Swap position
        [array[index], array[index - 1]] = [array[index - 1], array[index]];
      }
    });
    this.updateCanvas();
    this.store.emitControl(selectedIds);
  }

  /**
   * Move down one layer
   * @param selectedIds
   */
  @action
  downOneElement(selectedIds?: string[]) {
    console.log('Move selected layer down one layer');
    if (!selectedIds) {
      selectedIds = [...this.selectedElementIds];
    }
    // Find index of selected object
    let selectedIndexes = selectedIds.map(id => this.pageData.layers.findIndex(obj => obj.id === id));
    // Move selected object down
    const array = this.pageData.layers;
    selectedIndexes.forEach(index => {
      if (index < array.length - 1) {
        // Swap position
        [array[index], array[index + 1]] = [array[index + 1], array[index]];
      }
    });
    this.updateCanvas();
    this.store.emitControl(selectedIds);
  }

  /**
   * Move to top
   * @param ids
   */
  @action
  moveTopElement(ids?: string[]) {
    if (!ids) {
      ids = [...this.selectedElementIds];
    }
    const removedObjects = remove(this.pageData.layers, obj => ids.includes(obj.id));
    this.pageData.layers.unshift(...removedObjects);
    this.updateCanvas();
    this.store.emitControl(ids);
  }

  /**
   * Move to bottom
   * @param ids
   */
  @action
  moveBottomElement(ids?: string[]) {
    if (!ids) {
      ids = [...this.selectedElementIds];
    }
    const removedObjects = remove(this.pageData.layers, obj => ids.includes(obj.id));
    this.pageData.layers.push(...removedObjects);
    this.updateCanvas();
    this.store.emitControl(ids);
  }

  /**
   * Copy element
   * @param ids
   */
  @action
  copyElement(ids?: string[]) {
    if (!ids) {
      ids = [...this.selectedElementIds];
    }
    const elements = this.getElementDataByIds(ids) || [];
    this.copyTempData = util.toJS(elements);
    Toast.success('Copied successfully, press Ctrl + V to paste');
  }

  /**
   * Cut element
   */
  cutElement(ids?: string[]) {
    console.log('Cut element');
    if (!ids) {
      ids = [...this.selectedElementIds];
    }
    const elements = this.getElementDataByIds(ids) || [];
    this.copyTempData = util.toJS(elements);
    this.store.deleteLayers(ids);
    this.updateCanvas();
    this.store.emitControl([]);
    Toast.success('Cut successfully, press Ctrl + V to paste');
  }

  /**
   * Selected elements
   */
  @observable selectedElementIds: string[] = [];
  @action
  setSelectedElementIds(ids: string[]) {
    if (ids.length) {
      pubsub.publish('showLayoutPanel', { type: 'options', visible: true });
    }
    transaction(() => {
      this.elementOptionType = 'basic';
      this.selectedElementIds = [...ids];
      if (ids.length === 0) {
        this.cropper = false;
      }
    });
  }

  /**
   * Set controller
   * @param element
   */
  setContorlAndSelectedElemenent = (ids: string[]) => {
    // updateControl will trigger Movie's onSelectElements event
    transaction(() => {
      this.setSelectedElementIds([...ids]);
      this.optionPanelCustom = '';
    });
    // Set controller
    console.log('Set controller');
    this.store.emitControl([...ids]);
  };

  /**
   * Update layout identifier
   */
  @observable layoutKeys: Record<ctypes.LayoutName, string> = {
    sources: '1', // Source panel
    timeline: '1', // Timeline
    options: '1', // Settings panel
    canvas: '1', //
    header: '1',
  };
  @action
  updateComponent = (...keyName: ctypes.LayoutName[]) => {
    transaction(() => {
      for (let i = 0; i < keyName.length; i++) {
        this.layoutKeys[keyName[i]] = util.randomID();
      }
      this.updateOption();
    });
  };

  /**
   * Source panel switch
   */
  @observable sourceType: ctypes.SourceType = 'template';
  @action
  setSourceType = (t: ctypes.SourceType) => {
    this.sourceType = t;
    pubsub.publish('showLayoutPanel', { type: 'sources', visible: true });
  };

  /**
   * Settings panel switch
   */
  @observable elementOptionType: ctypes.ElementOptionType = 'basic';
  @action
  setElementOptionType = (t: ctypes.ElementOptionType) => {
    this.elementOptionType = t;
  };

  @action
  getElementDataByIds = (ids: string[]) => {
    if (!this.store) {
      return [];
    }
    const arr = this.store.getLayerByIds(ids);
    return arr;
  };

  /**
   * Get single selected element data
   * @returns
   */
  @action
  getElementData = (): BaseLayer => {
    const elements = this.getElementDataByIds([...this.selectedElementIds]) || [];
    //@ts-ignore
    return elements[0] || {};
  };

  /**
   * Get selected group element data
   * @returns
   */
  @action
  getGroupElementData = () => {
    const elements = this.getElementDataByIds([...this.selectedElementIds]) || [];
    return elements;
  };

  @action
  cloneElements = (elements?: BaseLayer[]): BaseLayer[] => {
    if (!elements) {
      elements = this.getElementDataByIds([...this.selectedElementIds]) || [];
    }
    const cloneData: BaseLayer[] = util.toJS(elements);
    const changeId = (elems: BaseLayer[]) => {
      elems.forEach(elm => {
        elm.id = util.createID();
        elm._dirty = util.createID();
        if ((elm as GroupLayer).childs) {
          changeId((elm as GroupLayer).childs);
        }
      });
    };
    changeId(cloneData);
    cloneData.forEach(elem => {
      elem.x += 10;
      elem.y += 10;
    });
    return cloneData;
  };

  /**
   * Copy element
   */
  @action
  copyElementData = () => {
    const elems = this.cloneElements();
    this.pageData.layers.unshift(...elems);
    this.updateCanvas();
    this.setSelectedElementIds(elems.map(d => d.id));
    this.store.emitControl(elems.map(d => d.id));
  };

  @action
  destroy() {
    this.store = null;
    this.copyTempData = null;
  }
}

const editor = new Editor();

export { editor, Editor };
