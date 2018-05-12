<template>
  <div class="with-no-products-category">
    <div class="count-text">未有商品的分类共<span class="font-color-orange"> 12 </span>个</div>
    <div class="category-list">
      <div v-if="loaded && data.length > 1"></div>
      <template v-else>
        <div v-if="loaded">暂时没有记录</div>
        <s-loading v-else :loop="true" class="m-t-20"></s-loading>
      </template>
    </div>
    <s-btn class="closed" @click="close">关 闭</s-btn>
  </div>
</template>

<script>
import CategoryItem from './categoryItem';

export default {
  data() {
    return {
      data: [],
      loaded: false
    };
  },
  methods: {
    close() {
      this.$parent.closeCall();
    }
  },
  components: { CategoryItem }
};
</script>

<style lang="scss" scoped>
.with-no-products-category {
  position: relative;
  height: 100%;
  padding: 20px 0;
}
.count-text {
  padding: 0 16px;
}
.closed {
  position: absolute;
  left: 50%;
  bottom: 20px;
  margin-left: -50px;
  width: 100px;
}
.category-list {
  position: absolute;
  left: 16px;
  right: 16px;
  top: 42px;
  bottom: 76px;
  border: 1px solid $lineGray;
}
</style>
