import BasicService from '@server/BasicService';
class Server extends BasicService {
  /**
   * @desc Create video
   */
  createVideo = async data => {
    return await this.post('/api/v1/user/apps/create', data);
  };
  /**
   * Get user work max count info
   * @param {string} schema
   * @returns
   */
  getAppCountInfo = async () => await this.get('/api/v1/user/apps/count-info');
  /**
   * Get user work list
   * @param {string} schema
   * @param {object} params
   * @returns
   */
  getDraftList = async params => await this.get('/api/v1/user/apps/page', { params });

  /**
   * Get user work details
   * @param {string} workbench.schema
   * @param {string} id
   * @returns
   */
  getAppsDetail = async id => await this.get('/api/v1/user/apps/info', { params: { id } });

  /**
   * Publish work
   * @param {*} schema
   * @param {*} id
   * @returns
   */
  publishApps = async params => await this.post('/api/v1/user/apps/publish', params);

  /**
   * Delete work
   * @param {} workbench.schema
   * @param {*} params
   * @param {*} id
   * @returns
   */
  deleteDraft = async params => await this.post('/api/v1/user/apps/delete', params);
  /**
   * Update draft
   * @param {*} id
   * @param {*} params
   * @returns
   */
  updateDraft = async params => await this.post('/api/v1/user/apps/update', params);

  /**
   *
   * @param params category_id ,  ids
   * @returns
   */
  moveDraft = params => this.post('/api/v1/user/apps/move', params);
  /**
   * Copy work
   * @param {*} workbench.schema
   * @param {*} id
   * @returns
   */
  copyDraft = async params => await this.post('/api/v1/user/apps/copy', params);
}

export const server = new Server();
