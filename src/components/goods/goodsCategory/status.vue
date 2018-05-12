<template>
  <div class="goods-category-status">
    <div>
      <div class="status-title">店铺自定义分类状态</div>
      <div class="status-item-wrap clearfix">
        <div class="status-item float-l">待归类商品：</div>
        <div class="float-l">{{unclassifiedProducts}}</div>
      </div>
      <div class="status-item-wrap clearfix">
        <div class="status-item float-l">未有商品的分类：</div>
        <div class="float-l">{{categoriesWithNoProducts}}</div>
      </div>
    </div>
    <div class="m-t-30">
      <div class="status-title">分类显示设置</div>
      <div class="status-item2 clearfix">
        <span class="float-l">当前店铺分类来源：</span>
        <s-radio class="float-l" value="10" :data.sync="categoryType">平台分类</s-radio>
        <s-radio class="float-l customize-category-radio" value="20" :data.sync="categoryType">店铺自定义分类</s-radio>
      </div>
    </div>
    <div class="wrap-save-btn">
      <s-btn @click="setShowCategory" :active="true" :width="102">保存</s-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      unclassifiedProducts: '',
      categoriesWithNoProducts: '',
      categoryType: ''
    };
  },
  methods: {
    fetchStatusData() {
      this.$http
        .get(this.$api.goodsCategoryStatus)
        .then(data => {
          let oData = data.statistics;
          this.unclassifiedProducts = oData.count4UnclassifiedProducts;
          this.categoriesWithNoProducts = oData.count4CategoriesWithNoProducts;
          this.categoryType = ('' + oData.displayedCategoryType).trim();
        })
        .catch(err => {
          if (err._cancel === false) {
            this.$messageBox('获取数据失败');
          }
        });
    },
    setShowCategory() {
      this.$http
        .post(this.$api.setShowCategory, null, {
          params: { type: this.categoryType }
        })
        .then(() => {
          this.$messageBox('设置分类显示成功', { autoClosed: 3 });
        })
        .catch(() => {
          this.$messageBox('设置分类显示失败');
        });
    }
  },
  created() {
    this.fetchStatusData();
  }
};
</script>

<style lang="scss">
.goods-category-status {
  padding-top: 10px;
  .status-title,
  .status-item {
    width: 170px;
    text-align: right;
  }
  .status-title {
    padding-left: 15px;
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    color: #666666;
  }
  .status-item-wrap {
    margin-top: 14px;
    line-height: 1;
  }
  .status-item2 {
    margin-top: 7px;
    padding-left: 61px;
    line-height: 26px;
    width: 100%;
  }
  .customize-category-radio {
    margin-left: 24px;
  }
  .wrap-save-btn {
    margin: 20px 0 0 59px;
  }
}
</style>
