<template>
  <div class="area-category">
    <div class="tree-head">
      <span>自定义分类</span>
    </div>
    <template>
      <category-tree
        class="overflow-scroll tree-content"
        ref="categoryTree"
        :loaded="true"
        :data="tree"
        :isHideRootNode="true"
        :showCategoryCode="showCategoryCode">
      </category-tree>
      </category-tree>
      <template v-if="loadingTree">
        <s-loading :loop="true" class="loading-icon"></s-loading>
        <div class="loading-mark"></div>
      </template>
    </template>
  </div>
</template>

<script>
import CategoryTree from '@/components/goods/goodsCategory/common/categoryTree/index';

export default {
  props: ['tree', 'loadingTree'],
  data() {
    return {
      showCategoryCode: false,
    };
  },
  computed: {
    activeNode() {
      return this.$refs.categoryTree.active;
    },
    categoriesWithNoProducts() {
      return this.$store.state.goodsCategory.categoriesWithNoProducts;
    }
  },
  methods: {
    resetTreeInfo(data) {
      let setData = function(item, prefixLevelLink, prefixPath = '') {
        item.levelLink = '' + prefixLevelLink;
        item.path = prefixPath + item.name;
        if (item.hasSub === true) {
          item.sub.forEach(function(subItem, j) {
            setData(subItem, prefixLevelLink + '-' + j, item.path + ' 》');
          });
        }
      };
      data.forEach(function(item, i) {
        setData(item, i);
      });
      return data;
    }
  },
  components: { CategoryTree }
};
</script>

<style lang="scss" scoped>
.area-category{
  position: relative;
  float: left;
  width: 320px;
  height: 648px;
  line-height: 648px;
}
.tree-head {
  background-color: #fafafa;
  height: 50px;
  line-height: 50px;
  color: #666;
  font-weight: bold;
  text-indent: 19px;
  border: 1px solid $lineGray;
  .category-no-goods-btn {
    margin: 12px 10px 0 0;
    height: 32px;
    line-height: 30px;
    font-weight: 100;
    text-indent: 0;
    color: #666666;
    border: 1px solid $gray;
    padding: 2px 4px 2px 8px;
    border-radius: 2px;
    cursor: pointer;
    &:hover {
      color: $orange;
      border-color: $orange;
    }
    & > i {
      font-style: normal;
      color: $orange;
    }
  }
}
.tree-content {
  position: relative;
  margin-top: -1px;
  height: 599px;
}
.loading-mark {
  position: absolute;
  left: 1px;
  top: 120px;
  width: 298px;
  height: 458px;
  background-color: #ffffff;
  opacity: .3;
  z-index: 2;
}
.loading-icon {
  position: absolute;
  left: 0;
  top: 160px;
  z-index: 3;
}
</style>
