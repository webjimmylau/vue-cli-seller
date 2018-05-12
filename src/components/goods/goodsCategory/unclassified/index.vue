<template>
  <div class="no-category-goods">
    <area-goods v-if="mounted"
                :hasChooseGoods.sync="hasChooseGoods"
                :hasSubCategory="activeNode.hasSub"
                :categoryCode="activeNode.code"
                :categoryId="activeNode.id"></area-goods>
    <div class="goods-move-to-category">
      <div class="move-btn">
        <s-btn style="display: inline-block; vertical-align: middle;"
               :width="100"
               :disabled="isMove"
               @click="batchMove">移入到&nbsp;&gt;&gt;</s-btn>
      </div>
      <area-category ref="areaCategory"
                     :loadingTree.sync="loadingTree"
                     :tree.sync="tree"></area-category>
    </div>
  </div>
</template>

<script>
  import AreaGoods from './areaGoods'
  import AreaCategory from './areaCategory'

  export default {
    data(){
      return {
        mounted: false,
        tree: [],
        loadingTree: true,
        hasChooseGoods: false,
        hasChooseFolder: false
      }
    },
    computed: {
      activeNode() {
        if(this.$refs.areaCategory.activeNode.hasSub != undefined){
          this.hasChooseFolder = !this.$refs.areaCategory.activeNode.hasSub;
        }
        return this.$refs.areaCategory.activeNode;
      },
      isMove() {
        return !(this.hasChooseGoods && this.hasChooseFolder)
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
      },
      batchMove() {
        alert(111);
      },
    },
    created() {
      this.fetchCategoryList();
    },
    mounted() {
      this.mounted = true;
    },
    components: {
      AreaCategory,
      AreaGoods
    }
  }
</script>

<style lang="scss" scoped>
  .no-category-goods{
    position: relative;
  }
  .goods-move-to-category{
    position: absolute;
    top: 0;
    right: 0;
  }
  .move-btn{
    float: left;
    line-height: 648px;
    padding-right: 20px;
  }
</style>
