import { IEditorBase, IExportOptions, ILeafer, IUI } from '@leafer-ui/interface';
import type { BaseLayer, BasePage, GroupLayer, ENV } from '../types/data';
import type { RecordManager, RecordItem, RecordType } from '../types/helper';
import { bindSelf } from '../tools/helper';
import remove from 'lodash/remove';
import * as utils from '../tools/utils';
import * as helper from '../tools/helper';
import { Ruler } from 'leafer-x-ruler';

interface RecordParams {
  add: (item: RecordItem<RecordType>) => void;
  debounceAdd: (item: RecordItem<RecordType>) => void;
  redo: () => boolean;
  undo: () => boolean;
  manager: any;
}

/**
 * Encapsulated core with some methods and cached data
 */
export default class Store {
  // Page data
  public data!: BasePage;
  // History record
  public record?: RecordParams;
  public ruler: Ruler;
  // Instance
  public app!: ILeafer;
  // Controller instance
  public editor!: IEditorBase;
  // Runtime environment
  public env: ENV = 'editor';
  // Update View component
  public updateView: () => void = null;
  // Controller scale triggers each element's internal function
  public controlScaleFuns: Record<string, () => void> = {};
  // Execute on mouse up after drag
  public elementDragUp: Record<string, () => void> = {};
  // Controller selection triggers each element's internal function
  public controlSelectFuns: Record<string, () => void> = {};

  // Resource host
  public resourceHost: string = '';

  @bindSelf
  public setURL(url: string): string {
    return utils.setURL(url, this.resourceHost);
  }

  public helper = helper;
  public utils = utils;
  // History record add callback function
  public addRecordCallback: () => void;

  @bindSelf
  public getLayerUIByIds(ids: string[]): IUI[] {
    const arr = [];
    ids.forEach(d => {
      const layer = this.app.findOne('#' + d);
      if (layer) {
        arr.push(layer);
      }
    });
    return arr;
  }

  /**
   * Get layer data by IDs
   * @param ids
   * @returns
   */
  @bindSelf
  public getLayerByIds(ids: string[]): BaseLayer[] {
    const arr = [];
    const findLayers = layers => {
      layers.forEach(layer => {
        if (ids.includes(layer.id)) {
          arr.push(layer);
        }
        if (layer.childs) {
          findLayers(layer.childs);
        }
      });
    };
    findLayers(this.data.layers);
    return arr;
  }

  /**
   * Delete multiple elements
   * @param ids
   */
  @bindSelf
  public deleteLayers(ids: string[]) {
    // const findLayers = layers => {
    //   layers.forEach(layer => {
    //     if (ids.includes(layer.id)) {
    //       arr.push(layer);
    //       remove(layers, (d: any) => d.id === layer.id);
    //     }
    //     if (!ids.includes(layer.id) && layer.childs) {
    //       findLayers(layer.childs);
    //     }
    //   });
    // };
    // findLayers(this.data.layers);
    remove(this.data.layers, d => ids.includes(d.id));
  }

  /**
   * Combine multiple elements into group data
   */
  @bindSelf
  public groupData(ids: string[]): GroupLayer {
    const layers = this.getLayerByIds(ids);
    const g = helper.createLayer('group') as GroupLayer;
    g.childs = [...layers];

    // Remove extra elements
    const removeLayers = layers => {
      remove(layers, (e: any) => ids.includes(e.id));
      layers.forEach(layer => {
        if (layer.childs) {
          removeLayers(layer.childs);
        }
      });
    };
    removeLayers(this.data.layers);

    // layer
    // // View merge
    const group = this.editor.group();

    // After merge, layer xy changed, modify layerData x,y
    group.children.forEach(d => {
      const layerData = g.childs.find(a => a.id === d.id);
      if (layerData) {
        layerData.x = d.x;
        layerData.y = d.y;
        layerData.rotation = d.rotation;
      }
    });
    // Modify group data
    g.x = group.x;
    g.y = group.y;
    g.rotation = group.rotation;
    this.data.layers.unshift(g);

    // Update view
    this.updateView();
    return g;
  }

  /**
   * Ungroup elements
   */
  @bindSelf
  public unGroupData(id: string): string[] {
    const [element] = this.getLayerByIds([id]);
    if (element.type === 'group') {
      const group2more = (layers: BaseLayer[]) => {
        const index = layers.findIndex(d => d.id === id);
        // After ungrouping, need to modify child element coordinates separately
        const group = this.editor.ungroup();
        group.forEach(box => {
          const layer = (element as any).childs.find(d => d.id === box.id);
          layer.x = box.x;
          layer.y = box.y;
          layer.rotation = box.rotation;
        });
        layers.splice(index, 0, ...(element as any).childs);
        remove(layers, d => d.id === id);
      };
      // Get parent element
      const parent = utils.findParentById(this.data.layers as any[], id);
      if (parent) {
        const runUn = layers => {
          if (layers.find(d => d.id === parent.id)) {
            group2more(layers);
            return true;
          } else {
            for (let i = 0; i < layers.length; i++) {
              if (layers[i].childs) {
                runUn(layers[i].childs);
              }
            }
          }
        };
        runUn(this.data.layers);
      } else {
        group2more(this.data.layers);
      }
      console.log('Ungroup successful', this.data.layers);
      this.updateView();
      return (element as any).childs.map(d => d.id);
    } else {
      console.error(`Element with id ${id} is not a group element`);
      return null;
    }
  }

  /**
   * Trigger controller selection
   */
  @bindSelf
  public emitControl(ids: string[]) {
    // Because updateView is an asynchronous method, may cause render delay
    if (ids.length === 0) {
      this.editor.target = null;
      return;
    }
    setTimeout(() => {
      const uiArr = this.getLayerUIByIds(ids);
      this.editor.target = uiArr;
    }, 10);
  }

  @bindSelf
  public autoViewSize() {
    const padding = 100;
    const target = this.app.view as HTMLDivElement;
    const scale = Math.min(
      (this.app.width - padding) / this.data.width,
      (this.app.height - padding) / this.data.height,
    );
    this.app.scale = scale;
    this.app.x = (target.clientWidth - padding - this.data.width * scale) / 2 + padding / 2;
    this.app.y = (target.clientHeight - padding - this.data.height * scale) / 2 + padding / 2;
  }

  @bindSelf
  public setViewSize(scale: number) {
    this.app.scale = scale;
    const padding = 0;
    const target = this.app.view as HTMLDivElement;
    this.app.x = (target.clientWidth - padding - this.data.width * scale) / 2 + padding / 2;
    this.app.y = (target.clientHeight - padding - this.data.height * scale) / 2 + padding / 2;
  }

  /**
   * Update view
   */
  @bindSelf
  public update() {
    if (this.updateView) {
      this.updateView();
    }
    // this.app.renderer.render();
  }

  /**
   * Manually set element rotation
   * Solve the problem of external triggered rotation not rotating around center point
   * Rotating element will cause x,y to change simultaneously
   */
  @bindSelf
  public triggerRotation(elementData: BaseLayer, rotation: number) {
    const box = this.app.findOne('#' + elementData.id);
    box.rotateOf({ x: box.width / 2, y: box.height / 2 }, rotation - box.rotation);
    elementData.x = box.x;
    elementData.y = box.y;
  }

  /**
   * Screenshot
   */
  @bindSelf
  public async capture(params?: IExportOptions) {
    console.log('Screenshot', params);
    return await this.app.export('png', params);
  }

  /**
   * Destroy
   */
  @bindSelf
  public destroy() {
    this.controlScaleFuns = {};
    this.data = null;
    // this.app.destroy();
    // this.app = null;
  }
}
