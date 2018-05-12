<template>
  <div class="del-category">
    <div class="item clearfix">
      <div class="float-l item-name">确认要删除：</div>
      <div class="float-l text-overflow item-content">
        <span
          v-for="(item, index) in categoryPath"
          :key="index">
            <template v-if="index != pathLength - 1">{{item}}<b class="arrow font-st">></b></template>
            <i class="end-level" v-else>{{item}}</i>
        </span>
        <span>吗？</span>
      </div>
    </div>
    <div class="item clearfix">
      <div class="float-l item-name"></div>
      <div class="float-l text-overflow item-content">该分类包含 <b>{{goodsNum}}</b> 款商品，请谨慎操作。</div>
    </div>
    <div class="tips">提示：删除该分类后，商品将不属于任何分类下。建议对这些商品进行重新归类。</div>
    <div class="item item-action-wrap clearfix">
      <div class="float-l item-name"></div>
      <div class="float-l item-content">
        <s-btn class="float-l" :active="true" :width="76" @click="del">确认</s-btn>
        <s-btn class="float-l m-l-10" :width="76" @click="close">取消</s-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['payload'],
  data() {
    return {
      goodsNum: '*'
    };
  },
  computed: {
    categoryId() {
      return this.payload.id;
    },
    categoryPath() {
      return this.payload.path.split(' 》');
    },
    pathLength() {
      return this.categoryPath.length;
    }
  },
  created() {
    this.fetchGoodsNum();
  },
  methods: {
    del() {
      this.$http
        .post(this.$api.delCategory, null, {
          params: { id: this.categoryId }
        })
        .then(() => {
          this.payload.success(this.payload.levelLink);
        })
        .catch(err => {
          let recode = '' + ((err && (err.recode || '')) || '');
          let msg = '删除分类出错';
          switch (recode) {
            case '200000':
              msg = '所选分类已不存在，请选择其他分类';
              break;
            case '400000':
              msg = '该分类下存在子类，请先删除该分类下的全部子类';
              break;
          }
          setTimeout(() => {
            this.$messageBox(msg, {
              closeCallBack: this.payload.fail
            });
          }, 0);
        })
        .then(() => {
          this.close();
        });
    },
    close() {
      this.$parent.closeCall();
    },
    fetchGoodsNum() {
      this.$http
        .get(this.$api.categoryInfo + this.categoryId)
        .then(data => {
          this.goodsNum = data.info.count4Products;
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.del-category {
  padding: 12px 20px 0 0;
  .arrow {
    padding: 0 8px;
  }
  .end-level {
    font-style: normal;
    color: $lineOrange;
  }
}
.item-action-wrap {
  margin-top: 18px;
  height: 36px;
}
.item {
  position: relative;
}
.item-content,
.item-name {
  height: 30px;
  line-height: 30px;
}
.item-name {
  position: absolute;
  left: 0;
  top: 0;
  width: 88px;
  text-align: right;
}
.item-content {
  padding-left: 88px;
  width: 100%;
}
.tips {
  margin: 5px 0 0 20px;
  padding: 8px 10px;
  border: 1px solid #ffcc66;
  background-color: #fff7e6;
  color: #999;
}
</style>
