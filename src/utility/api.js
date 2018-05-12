const API = {
  auth: '/lots-web/agency/functions/', // 获取卖家帐号所属权限
  myShop: '/lots-web/agency/index/', // 我的店铺信息
  goodsCategoryStatus: '/lots-web/agency/rest/api/inShopCategory/statistics', // 店铺自定义分类状态
  setShowCategory: '/lots-web/agency/rest/api/inShopCategory/displayedCategorySetting', // 商品分类显示设置
  customizeCategoryList: '/lots-web/agency/rest/api/inShopCategory/list', // 获取自定义分类列表
  importCategories: '/lots-web/agency/rest/api/inShopCategory/importCategories', // 导入分类
  importProducts: '/lots-web/agency/rest/api/inShopCategory/importProducts', // 导入商品
  exportSaveCategoriesResult: '/lots-web/agency/rest/api/inShopCategory/exportSaveCategoriesResult', // 导出自定义分类导入的结果
  exportSaveProductsResult: '/lots-web/agency/rest/api/inShopCategory/exportSaveProductsResult', // 导出商品导入的结果
  addCategory: '/lots-web/agency/rest/api/inShopCategory/add', // 新增分类
  moveCategory: '/lots-web/agency/rest/api/inShopCategory/move', // 移动分类
  updateCategory: '/lots-web/agency/rest/api/inShopCategory/update', // 更新分类
  delCategory: '/lots-web/agency/rest/api/inShopCategory/remove', // 删除分类
  categoryInfo: '/lots-web/agency/rest/api/inShopCategory/info4Category/', // 获取分类信息
  brands: '/lots-web/agency/product/brands/', // 品牌列表
  goodsList: '/lots-web/agency/rest/api/inShopProduct/list', // 商品列表
  exportCategoryGoods: '/lots-web/agency/rest/api/inShopProduct/exportProducts', // 导出分类商品
  moveOutCategory: '/lots-web/agency/rest/api/inShopProduct/moveCategory', // 移出分类
};

export default {
  install(Vue, name = '$api') {
    Object.defineProperty(Vue.prototype, name, { value: API });
  }
};

export const api = API;
