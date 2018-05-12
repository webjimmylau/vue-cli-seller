import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import mutations from './mutations';
import * as getters from './getters';
import goodsCategory from './module/goodsCategory';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    auth: {
      load: false,
      error: false,
      data: []
    }
  },
  actions,
  mutations,
  getters,
  modules: { goodsCategory },
  strict: process.env.NODE_ENV === 'development'
});
