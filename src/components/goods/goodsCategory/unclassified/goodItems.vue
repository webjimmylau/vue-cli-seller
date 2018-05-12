<template>
  <div class="goods">
    <table-component class="category-management-goods-table-wrap"
                     :show-filter="false"
                      :show-caption="false"
                      :data="goods">
        <table-column cell-class="w-40" label="选项">
          <template slot-scope="row">
            <s-check-box :select.sync="row.isChoose" @click="changeChooseStatus"></s-check-box>
          </template>
        </table-column>
        <table-column cell-class="w-percent-15" label="图片">
          <template slot-scope="row">
            <img :src="row.productURL" width="40" height="40"/>
          </template>
        </table-column>
        <table-column cell-class="w-percent-50" label="商品标题/编号">
          <template slot-scope="row">
            <div class="column-text text-overflow">{{row.productName}}</div>
            <div class="column-text text-overflow gray">编号：{{row.productCode}}</div>
          </template>
        </table-column>
        <table-column label="自定义分类">
          <template slot-scope="row">
            <div class="text-overflow">{{row.inShopCategoryDTO}}</div>
          </template>
        </table-column>
    </table-component>
  </div>
</template>

<script>
export default {
  props: ['goods'],
  methods: {
    changeChooseStatus() {
      let status = true;
      for (let good of this.goods) {
        if (good.isChoose !== true) {
          status = false;
          break;
        }
      }
      this.$parent.chooseAll = status;
    }
  }
};
</script>

<style lang="scss">
  .goods {
    .category-management-goods-table-wrap {
      .table-component__table-wrapper {
        border: none;
      }
      .table-component__table{
        border-bottom: none;
      }
      .table-component__table__head{
        display: none;
      }
      .table-component__table__body {
        tr{
          height: 40px;
        }
        tr:last-child{
          border-bottom: none;
        }
        td {
          height: 40px;
          padding: 5px 10px 4px 10px;
        }
      }
    }
  }
</style>
