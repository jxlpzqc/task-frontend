import request from '@/utils/request';
import { IFullResult } from './data';

export interface IAdminUser {
  username: string;
}


export async function getAdmins(): Promise<IFullResult<IAdminUser>> {
  return request('/admin/getAdminList',{
    method:'POST'
  });
}

export async function deleteAdmin(username:string): Promise<IFullResult<IAdminUser>> {
  return request('/admin/removeAdmin',{
    method:'POST',
    data:{
      username
    }
  });
}



export async function addAdmin(username:string): Promise<IFullResult<IAdminUser>> {
  return request('/admin/registAdmin',{
    method:'POST',
    data:{
      username
    }
  });
}

