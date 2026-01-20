import BasicService from '@server/BasicService';

class Server extends BasicService {
  // Upload base64 image
  uploadBase64 = async (params: { content: string; name: string; file_type?: string }) => {
    return this.post(`/api/v1/common/upload/base64`, {
      ...params,
      is_original_name: 0,
      prefix_path: '/uploads',
      disk: 'oss',
      client: 'public',
    });
  };

  /**
   * Get category list
   * @param {string} workbench.schema
   * @param {object} params
   * @returns
   */
  getCategoryList = params => this.get('/api/v1/user/categories/page', { params });

  // Get user materials
  getUserMaterial = (params: {
    type?: string;
    keyword?: string;
    page: number;
    page_size: number;
    category_id: number; // appid
  }) => {
    return this.get(`/api/v1/user/materials/page`, { params });
  };

  // Create new material category
  createUserMaterialCategories = (appid: string) => {
    return this.post(`/api/v1/user/categories/create`, { name: appid, type: 'user_material', pid: 0 });
  };

  // Check if material category exists
  getUserMaterialInfo = (id: string) => {
    return this.get(`/api/v1/user/categories/info?id=${id}`);
  };

  // Create new material
  createUserMaterial = (params: {
    category_id?: string; // Create directly under this category
    app_id?: string;
    name: string;
    urls: Record<string, any>;
    attrs: Record<string, any>;
    size?: number;
  }) => {
    return this.post(`/api/v1/user/materials/create`, { ...params });
  };

  // Delete material
  deleteMaterial = async (ids: string[]) => {
    console.log('Batch delete', ids);
    return this.post(`/api/v1/user/materials/delete`, { id: ids });
  };

  // Form upload
  formUpdate = formdata => {
    let forms = new FormData();
    formdata.files.forEach((d, i) => {
      forms.append(`files[${i}]`, d);
    });
    return this.post(`/api/v1/common/upload/form`, forms);
  };
}

export const server = new Server();
