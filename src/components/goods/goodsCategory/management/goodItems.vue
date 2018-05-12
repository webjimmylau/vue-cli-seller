<template>
  <div class="goods">
    <table-component
      class="category-management-goods-table-wrap"
      :show-filter="false"
      :show-caption="false"
      :data="goods">
        <table-column label="选项">
          <template slot-scope="row">
            <s-check-box
            :select.sync="row.isChoose"
            @click="changeChooseStatus"></s-check-box>
          </template>
        </table-column>
        <table-column label="图片">
          <template slot-scope="row">
            <img :src="row.pic" width="60" height="60"/>
          </template>
        </table-column>
        <table-column cell-class="item-name" label="商品">
          <template slot-scope="row">
            <div class="text-overflow">{{row.name}}</div>
          </template>
        </table-column>
        <table-column cell-class="item-code" label="编号">
          <template slot-scope="row">
            <div class="column-text text-overflow">平台：{{row.productCode}}</div>
            <div class="column-text text-overflow">商家：{{row.supplierProductCode}}</div>
          </template>
        </table-column>
        <table-column cell-class="item-brand" label="品牌">
          <template slot-scope="row">
            <div class="text-overflow">{{row.brand}}</div>
          </template>
        </table-column>
        <table-column label="平台分类">
          <template slot-scope="row">
            <div class="column-text text-overflow" v-show="row.firstCategoryName != ''">{{row.firstCategoryName}}</div>
            <div class="column-text text-overflow" v-show="row.secondCategoryName != ''">{{row.secondCategoryName}}</div>
            <div class="column-text text-overflow" v-show="row.thirdCategoryName != ''">{{row.thirdCategoryName}}</div>
          </template>
        </table-column>
        <table-column label="自定义分类"></table-column>
        <table-column cell-class="item-sort" :hidden="isParentCategory" label="显示顺序">
          <template slot-scope="row">
            <s-input
              :value.sync="row.sortNum"
              :width="50"
              align="center"
              :small="true">
            </s-input>
          </template>
        </table-column>
        <table-column cell-class="item-move" :hidden="isParentCategory" label="移动顺序">
          <template slot-scope="row">
            <div class="move-btn"></div>
          </template>
        </table-column>
        <table-column cell-class="item-action" label="操作">
          <template slot-scope="row">
            <s-btn :small="true" :width="80" @click="moveOutCategory(row.id, row.pic, row.name)">移出分类</s-btn>
          </template>
        </table-column>
    </table-component>
  </div>
</template>

<script>
import MoveOutCategory from './moveOutCategory';
export default {
  props: ['goods', 'isParentCategory'],
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
    },
    moveOutCategory(id, pic, name) {
      this.$popup(
        MoveOutCategory,
        { width: 600, height: 234, title: '移出分类' },
        { id, pic, name }
      );
    }
  }
};
</script>

<style lang="scss">
.category-management-goods-table-wrap {
  .table-component__table-wrapper {
    border: none;
  }
  .table-component__table__body {
    tr {
      height: 73px;
    }
  }
  .item-name {
    width: 300px;
  }
  .item-brand,
  .item-sort {
    width: 80px;
  }
  .item-code {
    width: 130px;
  }
  .item-action,{
    width: 100px;
  }
  .item-move {
    width: 80px;
    .move-btn {
      width: 46px;
      height: 26px;
      cursor: pointer;
      background-image: url(./images/pro_move_ico.png);
      background-repeat: no-repeat;
      background-position: center;
      &:hover {
        background-image: url(./images/pro_move_ico_avtive.png);
      }
    }
  }
}
</style>
