<template>
  <div class="export-goods">
    <div class="item">
      <div class="text-overflow item-content">
        <span>当前分类：</span>
        <span
          v-for="(item, index) in categoryPath"
          :key="index">
            <template v-if="index != pathLength - 1">{{item}}<b class="arrow font-st">></b></template>
            <i class="end-level" v-else>{{item}}</i>
        </span>
      </div>
    </div>
    <div class="item">
      <div class="item-content">导出本类下所以商品</div>
    </div>
    <div class="item">
      <div class="item-action clearfix">
        <s-btn
          class="float-l"
          :loading="loading"
          :active="true"
          :width="76"
          @click="save">导出</s-btn>
        <s-btn
          class="float-r"
          :width="76"
          @click="close">取消</s-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['payload'],
  data() {
    return {
      loading: false
    };
  },
  computed: {
    categoryId() {
      return this.payload.id;
    },
    categoryPath() {
      return this.payload.path;
    },
    pathLength() {
      return this.categoryPath.length;
    }
  },
  methods: {
    save() {
      this.loading = true;
      this.$http
        .get(this.$api.exportCategoryGoods, {
          params: { id: this.categoryId }
        })
        .then(data => {
          // console.log(data);
        })
        .catch(err => {})
        .then(() => {
          this.loading = false;
        });
    },
    close() {
      this.$parent.closeCall();
    }
  }
};
</script>

<style lang="scss" scoped>
.export-goods {
  padding: 12px 0 0 0;
  .arrow {
    padding: 0 8px;
  }
  .end-level {
    font-style: normal;
    color: $lineOrange;
  }
}
.item {
  position: relative;
}
.item-content {
  line-height: 36px;
  width: 100%;
  text-align: center;
}
.item-action {
  margin: 14px auto 0;
  width: 164px;
}
</style>
