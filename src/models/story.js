import { query, update } from '../services/story';

export default {
  namespace: 'story',

  state: {
    list: [],
  },

  effects: {

    * fetchall({payload}, {call, put}) {
      const response = yield call(query, payload);
      yield put({
        type: 'savefetchall',
        payload: response,
      });
    },

    * update({payload}, {call, put}) {
      const response = yield call(update, payload);
      yield put({
        type: 'saveupdate',
        payload: response,
      });
    },

  },

  reducers: {
    savefetchall(state, action) {
      return {
        ...state,
        list: action.payload && typeof(action.payload.list === 'Array') ? action.payload.list : [],
      };
    },

    saveupdate(state, action) {
      return {
        ...state,
        list: action.payload && typeof(action.payload.list === 'Array') ? action.payload.list : [],
      };
    }


  }
};
