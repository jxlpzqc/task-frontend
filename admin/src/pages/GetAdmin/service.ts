import request from '@/utils/request';
import { IQueryRequest, IPostTask } from './data';
import { IPageResult } from '../../services/data';

export async function getItems(params?: IQueryRequest): Promise<IPageResult<IPostTask>> {
  return request('/getUserTask', {
    data:params,
    method: 'POST'
  });
}

export async function reject(taskid:string) {
  return request('/admin/refuseTask', {
    method: 'POST',
    data: {
      taskid
    },
  });
}

export async function accept(taskid:string) {
  return request('/admin/acceptTask', {
    method: 'POST',
    data: {
      taskid
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
