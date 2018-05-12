import Vue from 'vue';
import Router from 'vue-router';
import Route from './path';

// 商品管理
import Goods from '@/components/goods';
import GoodsCategory from '@/components/goods/goodsCategory';
import GoodsCategoryStatus from '@/components/goods/goodsCategory/status';
import GoodsCategoryManagement from '@/components/goods/goodsCategory/management/index';
import GoodsCategoryImport from '@/components/goods/goodsCategory/import';
import GoodsCategoryUnclassified from '@/components/goods/goodsCategory/unclassified/index';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: Route.root,
      redirect: Route.goods
    },
    {
      // 商品管理
      path: Route.goods,
      component: Goods,
      redirect: Route.goodsCategory,
      children: [
        {
          path: Route.goodsCategory,
          component: GoodsCategory,
          redirect: Route.goodsCategoryStatus,
          children: [
            {
              // 商品分类状态
              path: Route.goodsCategoryStatus,
              component: GoodsCategoryStatus
            },
            {
              // 自定义分类管理
              path: Route.goodsCategoryManagement,
              name: 'goodsCategoryManagement',
              component: GoodsCategoryManagement
            },
            {
              // 待分类商品
              path: Route.goodsCategoryUncategorized,
              component: GoodsCategoryUnclassified
            },
            {
              // 导入
              path: Route.goodsCategoryImport,
              component: GoodsCategoryImport
            }
          ]
        }
      ]
    },
    {
      path: '*',
      redirect: Route.root
    }
  ]
});

export default router;
