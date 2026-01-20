import { theme } from '@theme';
import { action, observable, transaction } from 'mobx';
import { util, storage } from '../utils';

export interface SelectItem {
  type: 'folder' | 'item';
  id: string;
}

class Layout {
  @observable layoutKeys: Record<string, string> = {};

  @observable themeUpdateKey: 'dark' | 'light' = theme.getTheme();
  @observable languageUpdateKey: number = 1;

  // Multi-select
  @observable selects: SelectItem[] = [];
  // Batch operation switch
  @observable openSelectManage: boolean = false;
  // Cancel
  @action
  cancelSelected = () => {
    transaction(() => {
      this.selects = [];
      this.openSelectManage = false;
    });
  };
  @action
  setSelected = (item: SelectItem, checked: boolean) => {
    transaction(() => {
      if (checked) {
        this.selects.push({ ...item });
      } else {
        this.selects = this.selects.filter(d => d.id !== item.id);
      }
      if (this.selects.length) {
        this.openSelectManage = true;
      }
      this.selects = [...this.selects];
    });
  };

  // Manually trigger module update
  @action
  updateComponent = (...keyName: string[]) => {
    transaction(() => {
      for (let i = 0; i < keyName.length; i++) {
        this.layoutKeys[keyName[i]] = util.randomID();
      }
    });
  };
}

const layout = new Layout();

export { layout, Layout };
