<template>
  <div class="good-list">
    <div class="category-active">
      <span class="float-l">当前分类：</span>
      <span
        class="float-l"
        v-for="(item, index) in categoryPath"
        :key="index">
          <template v-if="index != categoryPath.length - 1">{{item}}<b class="arrow font-st">></b></template>
          <i class="end-level" v-else>{{item}}</i>
      </span>
      <span v-show="!!categoryCode" class="float-l code">（编码：{{categoryCode}}）</span>
      <div class="area-action">
        <s-btn
          class="float-l m-r-10 unclassifiedProducts-btn"
          v-show="!isParentCategory">添加未分类商品（<i class="font-color-orange">{{unclassifiedProducts}}</i>）</s-btn>
        <s-btn class="float-l" @click="exportGoods" :disabled="!!!categoryId">导出商品</s-btn>
        <s-btn class="float-l m-l-10">分享</s-btn>
      </div>
    </div>
    <div class="search-wrap">
      <span class="float-l">搜索本类商品</span>
      <s-input
        class="float-l m-l-10 search-mt12"
        placeholder="商品名称、编号"
        :value.sync="search.keyWord"
        :width="200"></s-input>
      <s-btn
        class="float-l m-l-10 search-mt12"
        icon="search"
        :active="true"
        @click="toSearch">搜索</s-btn>
      <s-btn class="float-l m-l-10 search-mt12" @click="showAll">显示全部</s-btn>
      <s-btn
        v-show="!isParentCategory"
        class="float-r m-r-10 search-mt12"
        :active="true">重新排序</s-btn>
    </div>
    <div class="good-list-main">
      <template v-if="goods.length > 0">
        <good-items :isParentCategory="isParentCategory" :goods="goods"></good-items>
      </template>
      <template v-else>
        <s-text v-if="loaded && loading === false" :size="14">没有相关商品</s-text>
      </template>
      <template v-if="loading">
        <div class="loading-mark"></div>
        <s-loading class="loading-image"></s-loading>
      </template>
    </div>
    <div v-show="goods.length > 0">
      <div class="m-t-20 batch-aciton">
        <s-check-box
          class="choose-all-box float-l"
          :select.sync="chooseAll"
          @click="toggleChooseAll">全选</s-check-box>
        <s-select
          class="float-l batch-aciton-item"
          position="top"
          :width="174"
          :value.sync="batchChooseVal"
          :data="batchChoose">
        </s-select>
        <s-select
          class="float-l batch-aciton-item"
          position="top"
          :width="120"
          :value.sync="batchTypesVal"
          :data="batchTypes">
        </s-select>
        <s-btn
          class="float-l batch-aciton-item"
          :width="70"
          :active="true"
          @click="todoBatch">执 行</s-btn>
      </div>
      <s-pagination
        class="m-t-20"
        :current="pagination.current"
        :total="pagination.total"
        :count="pagination.count"
        :to="togglePage">
      </s-pagination>
      <div class="m-t-20 sort-good-tips tips-box" v-show="!isParentCategory">
        <h4>商品排序操作</h4>
        <p>1. 对少了的商品进行排序操作时，直接拖动移动图标即可。</p>
        <p>2. 也可以通过编辑“显示顺序”的数值，来调整顺序，数值越少就越靠前（数值必须大于0，可以是小数），建议调整好后点击一下“重新列序号”。</p>
        <p>3. 若对大量商品进行排序操作,操作人员还可以先导出本页全部商品，然后在EXCEL表格里先排好顺序，再通告导入商品功能使用新的排序。</p>
      </div>
    </div>
  </div>
</template>

<script>
import GoodItems from './goodItems';
import ExportGoods from './exportGoods';
import BatchMoveOutCategory from './batchMoveOutCategory';
import BatchMoveToCategory from './batchMoveToCategory';

export default {
  props: ['categoryId', 'categoryCode', 'hasSubCategory', 'categoryPath'],
  data() {
    return {
      goods: [],
      loading: false,
      loaded: false,
      pageNum: 1,
      pagination: {
        current: 0,
        total: 0,
        count: 0
      },
      search: {
        triggered: false, // 是否已触发条件搜索
        keyWord: ''
      },
      chooseAll: false, // 是否全选
      batchTypes: [
        {
          key: '移到其他分类',
          val: 1
        },
        {
          key: '移出分类',
          val: 0
        }
      ],
      batchTypesVal: 1,
      batchChooseVal: 1
    };
  },
  computed: {
    unclassifiedProducts() {
      return this.$store.state.goodsCategory.unclassifiedProducts;
    },
    isParentCategory() {
      if (this.hasSubCategory === false) return false;
      return true;
    },
    chooseNum() {
      let count = 0;
      this.goods.forEach(function(good) {
        if (good.isChoose === true) count += 1;
      });
      return count;
    },
    batchChoose() {
      let arr = [];
      arr.push({
        key: `已勾选记录（${this.chooseNum}）`,
        val: 1
      });
      // arr.push({
      //   key: '全部记录',
      //   val: 2
      // });
      arr.push({
        key: `当前全部搜索结果（${this.pagination.count}）`,
        val: 3
      });
      return arr;
    }
  },
  created() {
    this.fetchGoodsData();
  },
  watch: {
    categoryId() {
      this.fetchGoodsData();
    }
  },
  methods: {
    generateGoodsData(data) {
      let arr = [];
      data.forEach(function(item) {
        let obj = {
          isChoose: false, // 是否选择
          id: item.id,
          pic: item.productURL || '/lots-web/images/product/NoPicture.png',
          name: item.productName,
          productCode: item.productCode || '',
          supplierProductCode: item.supplierProductCode || '',
          firstCategoryName: item.firstCategoryName || '',
          secondCategoryName: item.secondCategoryName || '',
          thirdCategoryName: item.thirdCategoryName || '',
          brand: item.brand,
          sortNum: item.inShopCategorySeq || ''
        };
        arr.push(obj);
      });
      this.goods = arr;
    },
    fetchGoodsData(pageNum) {
      this.loading = true;
      let params = {
        pageNum: pageNum || this.pageNum,
        pageSize: 8
      };
      let sTime = +new Date();
      if (this.categoryId) params.inShopCategoryId = this.categoryId;
      if (this.search.triggered === true && this.search.keyWord != '')
        params.keyword = this.search.keyWord;
      this.$http
        .get(this.$api.goodsList, params)
        .then(data => {
          this.generateGoodsData(data.products);
          this.pagination = {
            current: data.page,
            total: data.totalPage,
            count: data.totalRecord
          };
          this.pageNum = data.page;
        })
        .catch(err => {
          this.$messageBox('获取分页数据失败');
        })
        .then(() => {
          let eTime = +new Date();
          let difTime = eTime - sTime;
          setTimeout(() => {
            this.loaded = true;
            this.loading = false;
          }, difTime > 600 ? 0 : 600 - difTime);
        });
    },
    togglePage(page) {
      this.fetchGoodsData(+page);
    },
    toSearch() {
      if (this.search.keyWord != '') this.search.triggered = true;
      else this.search.triggered = false;
      this.fetchGoodsData(1);
    },
    showAll() {
      this.search = {
        triggered: false,
        keyWord: ''
      };
      this.fetchGoodsData(1);
    },
    toggleChooseAll(val) {
      this.goods.forEach(function(good) {
        good.isChoose = val;
      });
    },
    exportGoods() {
      this.$popup(
        ExportGoods,
        { width: 600, height: 204, title: '导出分类商品' },
        { id: this.categoryId, path: this.categoryPath }
      );
    },
    createMoveCategoryData() {
      let data = {};
      if (this.batchChooseVal == '1') {
        // 当前勾选
        let products = [];
        this.goods.forEach(function(good) {
          if (good.isChoose === true) products.push(good.id);
        });
        data.products = products.join(',');
      }
      if (this.batchChooseVal == '3' && this.search.triggered === true) {
        data.keyword = this.search.keyWord;
        if (!!this.categoryId) data.inShopCategoryId = this.categoryId;
      }
      return data;
    },
    batchMoveOutCategory(num) {
      this.$popup(
        BatchMoveOutCategory,
        { width: 600, height: 204, title: '批量移出分类' },
        { num, data: this.createMoveCategoryData() }
      );
    },
    batchMoveToCategory(num) {
      this.$popup(
        BatchMoveToCategory,
        { width: 600, height: 600, title: '批量移到其他分类' },
        { num, data: this.createMoveCategoryData() }
      );
    },
    todoBatch() {
      if (this.batchChooseVal == '1' && this.chooseNum == '0') {
        this.$messageBox('请先勾选要处理的商品');
        return;
      }
      let num = '**';
      if (this.batchChooseVal == 1) num = this.chooseNum;
      if (this.batchChooseVal == 3) num = this.pagination.count;
      if (this.batchTypesVal == '0') {
        // 移出分类
        this.batchMoveOutCategory(num);
        return;
      } else if (this.batchTypesVal == '1') {
        // 移到其他分类
        this.batchMoveToCategory(num);
      }
    }
  },
  components: { GoodItems }
};
</script>

<style lang="scss" scoped>
.good-list-main {
  border: 1px solid $lineGray;
  border-top: none;
  position: relative;
  height: 634px;
  .loading-mark {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    opacity: .4;
    z-index: 2;
  }
  .loading-image {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -38px;
    margin-left: -70px;
    width: 140px;
    height: 76px;
    z-index: 3;
    background-color: #ffffff;
  }
}
.category-active {
  position: relative;
  width: 100%;
  padding-left: 12px;
  height: 60px;
  line-height: 60px;
  border: 1px solid $lineGray;
  background-color: #fafafa;
  overflow: hidden;
  .arrow {
    margin: 0 8px;
  }
  .end-level {
    color: $orange;
    font-style: normal;
  }
  .code {
    margin-top: 1px;
    color: #999999;
  }
  .area-action {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    padding: 12px 12px 0;
    background-color: #fafafa;
  }
  .unclassifiedProducts-btn {
    i {
      font-style: normal;
    }
    &:hover {
      i {
        color: #ffffff;
      }
    }
  }
}
.search-wrap {
  width: 100%;
  height: 60px;
  padding-left: 12px;
  line-height: 60px;
  overflow: hidden;
  border: 1px solid $lineGray;
  background-color: #fafafa;
  border-top: none;
  .search-mt12 {
    margin-top: 12px;
  }
}
.batch-aciton {
  height: 60px;
  background-color: #fafafa;
  border: 1px solid $lineGray;
  .choose-all-box {
    margin: 16px 0 0 10px;
  }
  .batch-aciton-item {
    margin: 12px 0 0 12px;
  }
}
.sort-good-tips {
  & > h4 {
    line-height: 20px;
    color: #333;
    font-weight: bold;
  }
}
</style>
