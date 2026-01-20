import BasicService from '@server/BasicService';
import { editor } from '@stores/editor';
import type { MaterialTypes } from '@stores/editor';
import { config } from '@config/index';

class Server extends BasicService {
  // Get category list
  getTypeItems = async (type: MaterialTypes) => {
    const typeMap = {
      text: 211,
      image: 312,
      audio: 313,
      video: 314,
      sticker: 315,
      effect: 316,
      filter: 317,
      transition: 318,
    };

    return this.get(`/api/v1/common/type-items/page`, { params: { type_id: typeMap[type] || '', page_size: 999 } });
  };

  getTemplateTypes = () => {
    return this.get(`/api/v1/template/categories/tree`, { params: { page_size: 99 } });
  };

  // Get materials
  getMaterialItems = async (params: {
    type: MaterialTypes;
    category_id?: string | number;
    keyword?: string;
    page: number;
    page_size: number;
  }) => {
    return this.get('/api/v1/materials/page', { params });
  };

  // 검색 모판
  searchTemplateItems = async (params: {
    category_id?: string | number;
    keyword?: string;
    page: number;
    page_size: number;
  }) => {
    // return this.get('/api/v1/templates/page', {
    //   params: {
    //     ...params,
    //   },
    // });
    return this.get(
      `${config.templateHost}/api/v1/open/templates?page_size=${params.page_size}&categoryId=&price_type=&order_column=is_top&industry_id=&color_id=&keyword=&page=${params.page}&type=2`,
    ).then(arg => {
      const [res, err] = arg;
      res.data = res.data.map(d => {
        const size = JSON.parse(d.description);
        let width = size.width;
        let height = size.height;
        if (width / height > 3) {
          height = width / 3;
        }
        if (height / width > 3) {
          width = height / 3;
        }
        return { ...d, width, height };
      });
      return [res, err];
    });
  };

  // Get materials by keyword match
  searchMaterialItems = async (params: {
    type: MaterialTypes;
    category_id?: string | number;
    keyword?: string;
    page: number;
    page_size: number;
  }) => {
    return this.get('/api/v1/materials/page', { params });
  };

  // Add to favorites
  collect = async (source_id: string, type: string) => {
    return this.post(`/api/v1/user/collects/create`, { type, source_id });
  };

  // Remove from favorites
  collectCancle = async (source_id: Array<string>) => {
    return this.post(`/api/v1/user/collects/cancel`, { source_id });
  };

  // Get favorites list
  getCollects = async (params: {
    type: MaterialTypes;
    category_id?: string | number;
    keyword?: string;
    page: number;
    page_size: number;
  }) => {
    return this.get(`/api/v1/user/collects/page`, { params });
  };
}

export const server = new Server();

/**
 * Get material list items data
 * @param type
 * @param params
 * @param items
 * @returns
 */
export async function getItems(
  type: string,
  params: {
    page: number;
    page_size: number;
    keyword: string;
    category_id?: string;
  },
  items: any[],
  apiServer?: (n: any) => Promise<[any, boolean]>,
) {
  let res: { data: any[]; total: number }, err: any;
  if (apiServer) {
    [res, err] = await apiServer({
      type,
      ...params,
    });
  } else {
    if (type === 'template') {
      [res, err] = await server.searchTemplateItems({
        ...params,
      });
    } else {
      [res, err] = await server.getMaterialItems({
        type,
        ...params,
      });
    }
  }

  if (!err) {
    const list = [
      ...(items || []),
      ...res.data.map((d: any) => {
        // Favorites list has special data structure
        if (d.material) {
          d = d.material;
        }
        // Compatible with H5DS image template
        if (!d.attrs) {
          d.attrs = { width: 1280, height: 720 };
          d.thumb = d.coverImageUrl + '?x-oss-process=image/resize,m_lfit,w_320/quality,q_80';
        }
        const size = { width: d.width || d.attrs.width, height: d.height || d.attrs.height };
        switch (d.type) {
          case 'text':
            size.width = 100;
            size.height = 100;
            break;
        }
        return { ...d, ...size };
      }),
    ];
    return {
      list,
      hasMore: res.total > list.length,
    };
  } else {
    return {
      list: [],
      hasMore: false,
    };
  }
}
