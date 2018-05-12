import { http } from '@/utility/http';
import { api } from '@/utility/api';
import * as types from '../mutationTypes';

export default {
  state: {
    unclassifiedProducts: '', // 待归类商品数
    categoriesWithNoProducts: '' // 未有商品的分类数
  },
  actions: {
    fetchGoodsCustomCategoryStatus({ commit }) {
      http
        .get(api.goodsCategoryStatus)
        .then(data => {
          commit(types.SET_GOODS_CUSTOM_CATEGORY_STATUS, data.statistics);
        })
        .catch(() => {
          commit(types.SET_GOODS_CUSTOM_CATEGORY_STATUS, {
            count4UnclassifiedProducts: '',
            count4CategoriesWithNoProducts: ''
          });
        });
    }
  },
  mutations: {
    [types.SET_GOODS_CUSTOM_CATEGORY_STATUS](state, payload) {
      state.unclassifiedProducts = payload.count4UnclassifiedProducts;
      state.categoriesWithNoProducts = payload.count4CategoriesWithNoProducts;
    }
  }
};
