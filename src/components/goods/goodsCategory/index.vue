<template>
  <s-layout-main :menu="menu">
    <router-view class="m-t-20"/>
  </s-layout-main>
</template>

<script>
import Route from '@/router/path';

export default {
  computed: {
    menu() {
      return [
        {
          name: '商品分类状态',
          link: Route.goodsCategoryStatus
        },
        {
          name: '店铺自定义分类管理',
          link: Route.goodsCategoryManagement
        },
        {
          name:
            '待分类商品' +
            (this.$store.state.goodsCategory.unclassifiedProducts === ''
              ? ''
              : '(' +
                this.$store.state.goodsCategory.unclassifiedProducts +
                ')'),
          link: Route.goodsCategoryUncategorized
        },
        {
          name: '导入',
          link: Route.goodsCategoryImport
        }
      ];
    }
  },
  created() {
    this.$store.dispatch('fetchGoodsCustomCategoryStatus');
  }
};
</script>
