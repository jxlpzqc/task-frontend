import request from '@/utils/request';

export interface LoginParamsType {
  mobile: string;
  captcha: string;
}

// export async function fakeAccountLogin(params: LoginParamsType) {
//   return request('/api/login/account', {
//     method: 'POST',
//     data: params,
//   });
// }

export async function doLogin(params: LoginParamsType) {
  return request('/login', {
    method: 'POST',
    data: {
      phonenumber: params.mobile,
      code: params.captcha,
      admin: true
    },
  });
}



export async function getCode(phonenum: string) {
  return request(`/sendsms`, {
    method: 'POST',
    data: {
      phonenum
    }
  });
}
