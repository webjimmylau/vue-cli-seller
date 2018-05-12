<template>
  <div class="batch-move-out-category">
    <div class="row">把已选择的商品（<i class="font-color-orange">{{num}}</i>）移出分类吗？</div>
    <div class="m-t-10 tips-box">提示：移出分类的商品将被放在“全部商品”分类。建议之后对这些商品进行重新归类。</div>
    <div>
      <div class="item-action clearfix">
        <s-btn
          class="float-l"
          :active="true"
          :width="76"
          @click="move">移出</s-btn>
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
  computed: {
    num() {
      return this.payload.num;
    },
    data() {
      return this.payload.data;
    }
  },
  methods: {
    move() {
      this.$http
        .post(this.$api.moveOutCategory, this.data)
        .then(() => {})
        .catch(err => {
          let msg = '批量移出分类失败';
          this.$messageBox(msg);
        })
        .then(() => {
          this.close();
        });
    },
    close() {
      this.$parent.closeCall();
    }
  }
};
</script>

<style lang="scss" scoped>
.batch-move-out-category {
  padding: 16px 20px 0;
}
.row {
  line-height: 28px;
  text-align: center;
  & > i {
    font-style: normal;
  }
}
.item-action {
  margin: 16px auto 0;
  width: 164px;
}
</style>
