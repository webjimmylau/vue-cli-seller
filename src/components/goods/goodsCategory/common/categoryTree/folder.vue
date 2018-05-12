<template>
  <div class="node" :class="nodeClass">
    <div
      class="node-cur"
      @click="setActive(node)"
      :class="activeID === node.id ? 'active-folder' : ''"
      :style="nodeStyle">
        <span class="float-l text-overflow category-name" :title="node.path">{{node.name}}</span>
        <span v-show="showCategoryCode" class="float-l category-code" :title="node.code">{{node.code}}</span>
        <span
          v-if="node.hasSub"
          @click.stop="toggleShowSubTree"
          :style="nodeShowBtnStyle"
          class="node-show-btn">
        </span>
    </div>
    <div class="node-level-wrap" v-if="node.hasSub" v-show="showSubTree">
      <tree-sub-folder
        v-for="item in node.sub"
        :key="item.id"
        :showCategoryCode="showCategoryCode"
        :activeID="activeID"
        :setActive="setActive"
        :data="item">
     </tree-sub-folder>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tree-folder',
  props: ['node', 'activeID', 'setActive', 'showCategoryCode'],
  data() {
    return {
      showSubTree: false // 是否显示下级节点
    };
  },
  computed: {
    nodeClass() {
      let arr = [];
      if (this.node.hasSub) {
        arr.push('top-folder');
        if (this.showSubTree) arr.push('open');
        else arr.push('closed');
      } else {
        arr.push('end-folder');
        if (this.node.hasGoods === false) arr.push('no-goods');
      }
      return arr.join(' ');
    },
    nodeStyle() {
      let defaultPaddingLeft = 40;
      let defaultBackgroundPositionLeft = 4;
      let arr = [];
      arr.push(
        'padding-left:' + (defaultPaddingLeft + this.node.level * 12) + 'px'
      );
      arr.push(
        'background-position:' +
          (defaultBackgroundPositionLeft +
            this.node.level * 12 +
            (this.node.hasSub ? 0 : 15)) +
          'px'
      );
      return arr.join(';');
    },
    nodeShowBtnStyle() {
      let s = '';
      if (this.node.hasSub) {
        return 'left:' + this.node.level * 12 + 'px';
      }
      return s;
    }
  },
  methods: {
    toggleShowSubTree() {
      this.showSubTree = !this.showSubTree;
    }
  },
  beforeCreate: function() {
    this.$options.components.TreeSubFolder = require('./subFolder.vue').default;
  }
};
</script>

<style lang="scss" scoped>
.node {
  width: 100%;
}
.node-cur {
  position: relative;
  width: 100%;
  height: 26px;
  line-height: 26px;
  background-repeat: no-repeat;
  overflow: hidden;
  cursor: pointer;
  &:hover,
  &.active-folder {
    background-color: #eeeeee;
  }
  .node-show-btn {
    position: absolute;
    left: 0;
    top: 0;
    width: 20px;
    height: 100%;
    overflow: hidden;
  }
  .category-name,
  .category-code {
    display: block;
    height: 100%;
    max-width: 76%;
  }
  .category-code {
    margin-left: 6px;
    max-width: 20%;
    color: #999999;
  }
}
.top-folder {
  &.open {
    .node-cur {
      background-image: url(./images/folder_open.png);
    }
  }
  &.closed {
    .node-cur {
      background-image: url(./images/folder_closed.png);
    }
  }
}
.node.end-folder {
  .node-cur {
    background-image: url(./images/folder_blue.png);
  }
  &.no-goods {
    .node-cur {
      background-image: url(./images/folder_red.png);
    }
  }
}
</style>
