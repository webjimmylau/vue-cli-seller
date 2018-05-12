import { fetchCategoryList, createCategoryTree } from './fetchCategoryTreeList';

const service = { fetchCategoryList, createCategoryTree };

export default {
  install(Vue, name = '$service') {
    Object.defineProperty(Vue.prototype, name, { value: service });
  }
};
