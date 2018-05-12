<template>
  <div class="move-out-category">
    <div class="good-wrap">
      <div class="pic">
        <img :src="pic" width="100%" height="100%"/>
      </div>
      <div class="good-info">
        <div class="name">{{categoryName}}</div>
        <div class="red">要移出分类吗？</div>
      </div>
    </div>
    <div class="m-t-15 tips-box">提示：移出分类的商品将被放在“全部商品”分类，建议之后对这些商品进行重新归类。</div>
    <div class="m-t-15 clearfix">
      <s-btn
        class="float-l"
        :active="true"
        :width="76"
        @click="out">移出</s-btn>
      <s-btn
        class="m-l-10 float-l"
        :width="76"
        @click="close">取消</s-btn>
      <span v-show="errorMsg != ''" class="float-l m-l-10 red error-msg">{{errorMsg}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['payload'],
  data() {
    return {
      errorMsg: ''
    };
  },
  computed: {
    categoryId() {
      return this.payload.id;
    },
    categoryName() {
      return this.payload.name;
    },
    pic() {
      return this.payload.pic;
    }
  },
  methods: {
    out() {
      this.$http
        .post(this.$api.moveOutCategory, { products: this.id })
        .then(() => {
          this.errorMsg = '';
        })
        .catch(err => {
          let msg = '移出分类失败';
          this.errorMsg = msg;
        });
    },
    close() {
      this.$parent.closeCall();
    }
  }
};
</script>

<style lang="scss" scoped>
.move-out-category {
  padding: 16px 20px 0;
  .good-wrap {
    height: 60px;
    position: relative;
  }
  .pic {
    position: absolute;
    left: 0;
    top: 0;
    width: 60px;
    height: 60px;
    border: 1px solid #eee;
  }
  .good-info {
    padding-left: 70px;
    line-height: 20px;
    .name {
      max-height: 40px;
      overflow: hidden;
    }
  }
  .error-msg {
    line-height: 36px;
  }
}
</style>
