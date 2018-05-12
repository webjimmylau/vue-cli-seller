<template>
  <div class="category-tree">
    <template v-if="loaded">
      <div
        v-if="!isHideRootNode"
        class="root"
        @click="setActive({ id: null })"
        :class="active.id === null ? 'active-folder' : ''">全部商品</div>
      <tree-folder
        v-for="item in data"
        :key="item.id"
        :showCategoryCode="showCategoryCode"
        :activeID="active.id"
        :setActive="setActive"
        :node="item">
      </tree-folder>
    </template>
    <s-loading v-else :loop="true" class="tree-loading"></s-loading>
  </div>
</template>

<script>
import TreeFolder from './folder';
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    loaded: {
      type: Boolean,
      default: true
    },
    showCategoryCode: {
      type: Boolean,
      default: false
    },
    isHideRootNode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: { id: null }
    };
  },
  methods: {
    setActive(node) {
      this.active = node;
    }
  },
  components: { TreeFolder }
};
</script>

<style lang="scss" scoped>
.category-tree {
  width: 100%;
  border: 1px solid $lineGray;
  background-color: #ffffff;
  .tree-loading {
    height: 100%;
  }
}
.root {
  width: 100%;
  height: 26px;
  line-height: 26px;
  padding-left: 34px;
  background-position: 12px center;
  background-image: url(./images/folders.png);
  background-repeat: no-repeat;
  cursor: pointer;
  &:hover,
  &.active-folder {
    background-color: #eeeeee;
  }
}
</style>
