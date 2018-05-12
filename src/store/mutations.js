import * as types from './mutationTypes';

export default {
  [types.SET_AUTH](state, payload) {
    state.auth.load = true;
    state.auth.error = false;
    state.auth.data = payload;
  },
  [types.SET_AUTH_ERROR](state) {
    state.auth.load = false;
    state.auth.error = true;
  }
};
