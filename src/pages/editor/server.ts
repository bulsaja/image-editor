import BasicService from '@server/BasicService';
class Server extends BasicService {
  /**
   * @desc Create video
   */
  createApp = data => {
    return this.post('/api/v1/user/apps/create', data);
  };
  /**
   * Get user work detail
   * @param {string} workbench.schema
   * @param {string} id
   * @returns
   */
  getAppDetail = id => this.get('/api/v1/user/apps/info', { params: { id } });
  /**
   * Delete work
   * @param {} workbench.schema
   * @param {*} params
   * @param {*} id
   * @returns
   */
  deleteApp = params => this.post('/api/v1/user/apps/delete', params);
  /**
   * Update draft
   * @param {*} id
   * @param {*} params
   * @returns
   */
  updateApp = params => this.post('/api/v1/user/apps/update', params);

  // Upload base64 image
  uploadBase64 = (params: { content: string; name: string; file_type?: string }) => {
    return this.post(`/api/v1/common/upload/base64`, {
      ...params,
      is_original_name: 0,
      prefix_path: '/uploads',
      disk: 'oss',
      client: 'public',
    });
  };
}

export const server = new Server();
