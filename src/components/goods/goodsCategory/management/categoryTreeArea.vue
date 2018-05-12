<template>
  <div class="category-tree-area">
    <div class="tree-head">
      <span>全部分类</span>
      <span class="category-no-goods-btn float-r" @click="showWithNoProductsCategory">未有商品的分类（<i>{{categoriesWithNoProducts}}</i>）</span>
    </div>
    <div class="tree-action">
      <span
        title="新增子类"
        class="float-l tree-action-btn tree-action-btn-add"
        @click="addCategory"></span>
      <span
        title="编辑分类"
        class="float-l tree-action-btn tree-action-btn-edit"
        @click="editCategory"></span>
      <span
        title="删除分类"
        class="float-l tree-action-btn tree-action-btn-del"
        @click="delCategory"></span>
      <span title="搜索分类" class="float-l tree-action-btn tree-action-btn-explorer"></span>
      <span
        title="上移分类"
        class="float-l tree-action-btn tree-action-btn-up"
        @mouseout="moveCategory"
        @click="moveUp"></span>
      <span
        title="下移分类"
        class="float-l tree-action-btn tree-action-btn-down"
        @mouseout="moveCategory"
        @click="moveDown"></span>
      <s-check-box
        :select.sync="showCategoryCode"
        class="float-r tree-action-code-check-box">编码</s-check-box>
    </div>
    <template>
      <category-tree
        class="overflow-scroll tree-content"
        ref="categoryTree"
        :loaded="true"
        :data="tree"
        :showCategoryCode="showCategoryCode">
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
import AddCategory from './addCategory';
import EditCategory from './editCategory';
import DelCategory from './delCategory';
import WithNoProductsCategory from './withNoProductsCategory';

export default {
  props: ['tree', 'loadingTree'],
  data() {
    return {
      showCategoryCode: false,
      moveStatus: {
        // 移动分类时状态数据
        surpassedId: '',
        type: '',
        isMoving: false
      }
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
    resetTreeData() {
      this.updateLoadingTreeVal(true);
      this.$parent.fetchCategoryList();
      this.$refs.categoryTree.setActive({ id: null });
    },
    updateLoadingTreeVal(val) {
      this.$emit('update:loadingTree', !!val);
    },
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
    },
    updateTree(treeData, activeNode = null, isResetInfo = false) {
      if (isResetInfo === true) this.resetTreeInfo(treeData);
      this.$emit('update:tree', treeData);
      if (activeNode) this.$refs.categoryTree.setActive(activeNode);
    },
    findTargetNode(levelLink, treeData) {
      // 找出目标节点数据
      let aLevel = levelLink.split('-');
      let i = 0;
      let l = aLevel.length;
      let targetData = treeData;
      for (i; i < l; i++) {
        targetData = targetData[+aLevel[i]];
        if (i < l - 1) {
          // 肯定存在子分类
          targetData = targetData.sub;
        }
      }
      return targetData;
    },
    addCategory() {
      if (this.activeNode.hasGoods === true) {
        this.$messageBox('该分类下有商品不能添加子分类');
        return;
      }
      this.$popup(
        AddCategory,
        {
          width: 650,
          height: 268,
          title: '新增子类'
        },
        {
          id: this.activeNode.id,
          path: this.activeNode.path,
          levelLink: this.activeNode.levelLink,
          level: this.activeNode.level,
          success: this.updateCategoryByAddCategory,
          fail: this.resetTreeData
        }
      );
    },
    updateCategoryByAddCategory(newCategory, levelLink, level) {
      let treeData = this.$tool.extend(true, [], this.tree);
      let activeNode = null;
      if (!!levelLink === false) {
        // 根目录
        newCategory.forEach(function(item) {
          treeData.push({
            id: item.id,
            name: item.name,
            code: item.code || '',
            level: 1,
            hasGoods: false,
            hasSub: false
          });
        });
        activeNode = { id: null };
      } else {
        let targetNode = this.findTargetNode(levelLink, treeData);
        targetNode.hasSub = true;
        targetNode.sub = targetNode.sub || [];
        let subLevel = parseInt(level) + 1;
        newCategory.forEach(function(item) {
          targetNode.sub.push({
            id: item.id,
            name: item.name,
            code: item.code || '',
            level: subLevel,
            hasGoods: false,
            hasSub: false
          });
        });
        activeNode = targetNode;
      }
      this.updateTree(treeData, activeNode, true);
    },
    moveUp() {
      // 上移分类
      if (this.moveStatus.isMoving === true) return;
      let activeLevelLink = this.activeNode.levelLink || false;
      if (activeLevelLink === false) return;

      let aLevel = activeLevelLink.split('-');
      let i = 0;
      let l = aLevel.length - 1;
      let lastIndex = +aLevel[l];

      if (lastIndex == 0) return; // 已经是该层级第一，不需要上移

      this.moveStatus.type = '10';
      let treeData = this.$tool.extend(true, [], this.tree);
      let sameLevelData = null;

      if (l == 0) {
        sameLevelData = treeData;
      } else {
        let targetNode = this.findTargetNode(
          aLevel.slice(0, l).join('-'),
          treeData
        );
        sameLevelData = targetNode.sub;
      }
      let preNode = sameLevelData[lastIndex - 1];
      let activeNode = sameLevelData[lastIndex];
      let tmpLevelLink = activeNode.levelLink;
      activeNode.levelLink = preNode.levelLink;
      preNode.levelLink = tmpLevelLink;
      this.moveStatus.surpassedId = preNode.id;
      sameLevelData[lastIndex - 1] = activeNode;
      sameLevelData[lastIndex] = preNode;
      this.updateTree(treeData, activeNode, true);
    },
    moveDown() {
      // 下移分类
      if (this.moveStatus.isMoving === true) return;
      let activeLevelLink = this.activeNode.levelLink || false;
      if (activeLevelLink === false) return;

      let aLevel = activeLevelLink.split('-');
      let i = 0;
      let l = aLevel.length - 1;
      let lastIndex = +aLevel[l];
      let treeData = this.$tool.extend(true, [], this.tree);
      let sameLevelData = null;

      if (l == 0) {
        sameLevelData = treeData;
      } else {
        let targetNode = this.findTargetNode(
          aLevel.slice(0, l).join('-'),
          treeData
        );
        sameLevelData = targetNode.sub;
      }
      if (lastIndex == sameLevelData.length - 1) {
        // 已经是该层级最后一级，不需要下移
        return;
      }
      this.moveStatus.type = '20';
      let nextNode = sameLevelData[lastIndex + 1];
      let activeNode = sameLevelData[lastIndex];
      let tmpLevelLink = activeNode.levelLink;
      activeNode.levelLink = nextNode.levelLink;
      nextNode.levelLink = tmpLevelLink;
      this.moveStatus.surpassedId = nextNode.id;
      sameLevelData[lastIndex + 1] = activeNode;
      sameLevelData[lastIndex] = nextNode;
      this.updateTree(treeData, activeNode, true);
    },
    moveCategory() {
      if (
        this.moveStatus.surpassedId === '' ||
        this.moveStatus.type === '' ||
        this.moveStatus.isMoving === true
      )
        return false;
      this.moveStatus.isMoving = true;
      this.$http
        .post(this.$api.moveCategory, null, {
          params: {
            operatedId: this.activeNode.id,
            surpassedId: this.moveStatus.surpassedId,
            type: this.moveStatus.type
          }
        })
        .then(() => {})
        .catch(err => {
          let recode = '' + ((err && (err.recode || '')) || '');
          let msg = '移动分类出错';
          switch (recode) {
            case '100000':
              msg = '移动的分类已不存在';
              break;
          }
          this.$messageBox(msg, {
            closeCallBack: this.resetTreeData
          });
        })
        .then(() => {
          this.moveStatus.surpassedId = '';
          this.moveStatus.type = '';
          this.moveStatus.isMoving = false;
        });
    },
    editCategory() {
      if (this.activeNode.id === null) {
        this.$messageBox('请选择要修改的分类');
        return;
      }
      this.$popup(
        EditCategory,
        {
          width: 600,
          height: 230,
          title: '编辑分类'
        },
        {
          id: this.activeNode.id,
          name: this.activeNode.name,
          code: this.activeNode.code,
          path: this.activeNode.path,
          levelLink: this.activeNode.levelLink,
          success: this.updateCategoryByEditCategory,
          fail: this.resetTreeData
        }
      );
    },
    updateCategoryByEditCategory(name, code, levelLink) {
      let treeData = this.$tool.extend(true, [], this.tree);
      let activeNode = this.findTargetNode(levelLink, treeData);
      activeNode.name = name;
      activeNode.code = code;
      this.updateTree(treeData, activeNode, true);
    },
    delCategory() {
      if (this.activeNode.id === null) {
        this.$messageBox('请选择要删除的分类');
        return;
      }
      if (this.activeNode.hasSub === true) {
        this.$messageBox('该分类下存在子类，请先删除该分类下的全部子类！');
        return;
      }
      this.$popup(
        DelCategory,
        { width: 600, height: 226, title: '删除分类' },
        {
          id: this.activeNode.id,
          path: this.activeNode.path,
          levelLink: this.activeNode.levelLink,
          success: this.updateCategoryByDelCategory,
          fail: this.resetTreeData
        }
      );
    },
    updateCategoryByDelCategory(levelLink) {
      let parentLevelLink = '';
      let aLevelLink = levelLink.split('-');
      let treeData = this.$tool.extend(true, [], this.tree);
      let isTopCategory = aLevelLink.length == 1 ? true : false; // 是否为顶级分类
      if (isTopCategory === false) {
        aLevelLink.splice(-1, 1);
        parentLevelLink = aLevelLink.join('-');
      } else {
        parentLevelLink = levelLink;
      }
      if (isTopCategory) {
        let index = 0;
        let i = 0;
        let l = treeData.length;
        for (i; i < l; i++) {
          if (treeData[i].levelLink == parentLevelLink) {
            index = i;
            break;
          }
        }
        treeData.splice(index, 1);
      } else {
        let index = 0;
        let targetNode = this.findTargetNode(parentLevelLink, treeData);
        let j = 0;
        let subLength = targetNode.sub.length;
        for (j; j < subLength; j++) {
          if (targetNode.sub[j].levelLink == levelLink) {
            index = j;
            break;
          }
        }
        targetNode.sub.splice(index, 1);
        targetNode.hasSub = targetNode.sub.length > 0 ? true : false;
      }
      this.updateTree(treeData, { id: null }, true);
    },
    showWithNoProductsCategory() {
      this.$popup(WithNoProductsCategory, {
        width: 700,
        height: 500,
        title: '未有商品的分类'
      });
    }
  },
  components: { CategoryTree }
};
</script>

<style lang="scss" scoped>
.category-tree-area {
  position: absolute;
  left: 0;
  top: 0;
  width: 320px;
  z-index: 2;
}
.tree-head {
  background-color: #fafafa;
  height: 60px;
  line-height: 60px;
  color: #333333;
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
.tree-action {
  height: 60px;
  padding: 16px 0 0 12px;
  background-color: #fafafa;
  border: 1px solid $lineGray;
  border-top: none;
  .tree-action-btn {
    width: 34px;
    height: 30px;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
    overflow: hidden;
  }
  .tree-action-btn-add {
    background-image: url(./images/folder_add.png);
  }
  .tree-action-btn-edit {
    background-image: url(./images/folder_edit.png);
  }
  .tree-action-btn-del {
    background-image: url(./images/folder_delete.png);
  }
  .tree-action-btn-explorer {
    background-image: url(./images/folder_explorer.png);
  }
  .tree-action-btn-up {
    background-image: url(./images/arrow_up.png);
  }
  .tree-action-btn-down {
    background-image: url(./images/arrow_down.png);
  }
  .tree-action-code-check-box {
    margin: 2px 10px 0 0;
  }
}
.tree-content {
  position: relative;
  margin-top: -1px;
  height: 635px;
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
