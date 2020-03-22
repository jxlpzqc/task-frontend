import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent /*, query as queryUsers*/ } from '@/services/user';
import { setAuthority } from '@/utils/authority';

export interface CurrentUser {
  phonenum?:string;
  admin?:boolean;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      // const response = yield call(queryUsers);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      setAuthority(action.payload.admin ? 'admin' : '');
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
