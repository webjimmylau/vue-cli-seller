<template>
  <div class="batch-move-to-category">
    <div class="good-num">已选商品（<i class="font-color-orange">{{num}}</i>）</div>
    <category-tree
      class="overflow-scroll area-tree"
      :loaded="loaded"
      :data="tree"
      ref="categoryTree"
      :isHideRootNode="true"
      :showCategoryCode="false">
    </category-tree>
    <div class="fetch-category-status" v-if="loaded && tree.length <= 0">{{fetchCategoryStatus ? '没有分类数据' : '获取分类数据失败'}}</div>
    <div v-if="mounted" class="m-t-15 area-action" :class="showTips ? '' : 'area-action-mt'">
      <div class="clearfix text-overflow category-choose">
        <span>已选：</span>
        <span
          v-for="(item, index) in categoryPath"
          :key="index">
            <template v-if="index != pathLength - 1">{{item}}<b class="arrow font-st">></b></template>
            <i class="end-level" v-else>{{item}}</i>
        </span>
      </div>
      <div class="tips"><span class="red" v-show="showTips">请选择末级分类</span></div>
      <div class="clearfix" :class="showTips ? '' : 'action-btn'">
        <s-btn class="float-l"
          :active="true"
          :width="76"
          :disabled="showTips || !this.activeNode.id"
          @click="sure">确认</s-btn>
        <s-btn class="float-l m-l-10" :width="76" @click="close">取消</s-btn>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryTree from '@/components/goods/goodsCategory/common/categoryTree/index';

export default {
  props: ['payload'],
  data() {
    return {
      tree: [],
      loaded: false,
      fetchCategoryStatus: true,
      mounted: false
    };
  },
  computed: {
    num() {
      return this.payload.num;
    },
    data() {
      return this.payload.data;
    },
    showTips() {
      if (!this.activeNode.id) return false;
      else return this.activeNode.hasSub ? true : false;
    },
    activeNode() {
      return this.$refs.categoryTree.active;
    },
    categoryPath() {
      if (!!this.activeNode.id) return this.activeNode.path.split(' 》');
      else return [];
    },
    pathLength() {
      return this.categoryPath.length;
    }
  },
  created() {
    this.fetchCategoryList();
  },
  mounted() {
    this.mounted = true;
  },
  methods: {
    fetchCategoryList() {
      this.$service
        .fetchCategoryList()
        .then(data => {
          this.tree = this.$service.createCategoryTree(data.categories);
        })
        .catch(err => {
          if (err._cancel === false) {
            this.fetchCategoryStatus = false;
          }
        })
        .then(() => {
          this.loaded = true;
        });
    },
    sure() {
      let data = { newInShopCategoryId: this.activeNode.id };
      if (this.data.products) {
        data.products = this.data.products;
      } else {
        if (this.data.keyword) data.keyword = this.data.keyword;
        if (this.data.inShopCategoryId)
          data.inShopCategoryId = this.data.inShopCategoryId;
      }
      this.$http
        .post(this.$api.moveOutCategory, data)
        .then(() => {})
        .catch(err => {
          let msg = '批量移到其他分类失败';
          this.$messageBox(msg);
        })
        .then(() => {
          this.close();
        });
    },
    close() {
      this.$parent.closeCall();
    }
  },
  components: { CategoryTree }
};
</script>

<style lang="scss" scoped>
.batch-move-to-category {
  padding: 40px 20px 116px;
  height: 100%;
  .arrow {
    padding: 0 8px;
  }
  .end-level {
    font-style: normal;
    color: $lineOrange;
  }
}
.good-num {
  position: absolute;
  left: 20px;
  top: 46px;
  line-height: 32px;
  text-indent: 2px;
  & > i {
    font-style: normal;
  }
}
.fetch-category-status {
  position: absolute;
  left: 0;
  top: 100px;
  width: 100%;
  text-align: center;
}
.area-tree {
  height: 100%;
}
.area-action {
  position: absolute;
  width: 100%;
  padding: 0 20px 0 22px;
  left: 0;
  bottom: 20px;
}
.area-action-mt {
  bottom: 34px;
}
.category-choose {
  height: 18px;
  line-height: 18px;
  overflow: hidden;
}
.tips {
  height: 34px;
  line-height: 32px;
}
.action-btn {
  margin-top: -20px;
}
</style>
