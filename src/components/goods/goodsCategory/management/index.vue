<template>
  <div class="goods-category-management">
    <category-tree-area
      ref="categoryTreeArea"
      :loadingTree.sync="loadingTree"
      :tree.sync="tree"></category-tree-area>
    <div class="area-goods">
      <good-list
        v-if="mounted"
        :categoryPath="activeNodePath"
        :hasSubCategory="activeNode.hasSub"
        :categoryCode="activeNode.code"
        :categoryId="activeNode.id">
      </good-list>
    </div>
  </div>
</template>

<script>
import CategoryTreeArea from './categoryTreeArea';
import GoodList from './goodList';

export default {
  data() {
    return {
      tree: [],
      loadingTree: true,
      mounted: false
    };
  },
  computed: {
    activeNode() {
      return this.$refs.categoryTreeArea.activeNode;
    },
    activeNodePath() {
      if (this.activeNode.path) return this.activeNode.path.split(' 》');
      else return ['全部商品'];
    }
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
            this.$messageBox('获取自定义分类数据失败');
          }
        })
        .then(() => {
          this.loadingTree = false;
        });
    }
  },
  created() {
    this.fetchCategoryList();
  },
  mounted() {
    this.mounted = true;
  },
  components: { CategoryTreeArea, GoodList }
};
</script>

<style lang="scss" scoped>
.goods-category-management {
  position: relative;
  .area-goods {
    width: 100%;
    padding-left: 335px;
  }
}
</style>
