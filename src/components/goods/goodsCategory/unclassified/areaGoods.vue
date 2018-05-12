<template>
  <div class="area-goods">
    <div class="clearfix goods-screen">
      <!--<div class="select-title">平台</div>-->
      <!--<s-select class="float-l m-r-10 m-l-b">不限分类</s-select>-->
      <s-select class="float-l m-r-10"
                :width="120"
                :value.sync="searchData.brand"
                :data="brandsData"></s-select>
      <s-input class="float-l m-r-10"
               :placeholder="'商品名称/平台商品编号'"
               :value.sync="searchData.keyword"></s-input>
      <s-btn class="float-l m-r-10 active"
             :icon="'search'"
             @click="getSearch()">搜索</s-btn>
      <s-btn class="float-l m-r-10"
             :width="70"
             @click="resetSearch()">重置</s-btn>
    </div>
    <div class="clearfix goods-screen m-t-b">
      <div class="float-l" style="line-height: 36px;">显示结果：</div>
      <s-radio class="float-l m-t-5 m-l-10"
               :value="1"
               :data.sync="searchWatch.radioNoInShopCategoryCode">只显示未分类商品</s-radio>
      <s-radio class="float-l m-t-5" style="margin-left: 80px;"
               :value="0"
               :data.sync="searchWatch.radioNoInShopCategoryCode">显示所有商品（含已分类商品）</s-radio>
      <s-select class="float-r"
                :width="120"
                :value.sync="searchWatch.pageSize"
                :data="pageSelect"></s-select>
    </div>
    <div class="goods-table m-t-b">
      <table>
        <tr>
          <th class="w-40">选项</th>
          <th class="w-percent-15">图片</th>
          <th class="w-percent-50">商品标题/编号</th>
          <th>自定义分类</th>
        </tr>
      </table>
    </div>
    <div class="good-list-main">
      <template v-if="isLoadingGoods">
        <div class="loading-mark"></div>
        <s-loading class="loading-image"></s-loading>
      </template>
      <template v-if="goods.length">
        <good-items :goods="goods"></good-items>
      </template>
      <template v-else>
        <s-text v-if="isLoadedGoods && isLoadingGoods === false" :size="14">没有相关商品</s-text>
      </template>
    </div>
    <div class="goods-screen m-t-10">
      <div @click="setCheckedAll">
        <s-check-box class="float-l m-t-5 m-r-10"
                     v-if="goods.length"
                     :select.sync="isCheckedAllGoods">全选</s-check-box>
      </div>
      <s-select class="float-l" position="top" ref="importTypeSelect"
                :width="200"
                :value.sync="importType"
                :data="importTypeSelect">已勾选记录</s-select>
    </div>
    <s-pagination class="m-t-20 m-b-20"
                  :current="pagination.current"
                  :total="pagination.total"
                  :count="pagination.count"
                  :to="togglePage"
    >
    </s-pagination>
  </div>
</template>

<script>
  import GoodItems from './goodItems'

  export default {
    props: ['hasChooseGoods'],
    data(){
      return {
        brandsData: [], // 品牌列表数据

        searchData: {
          brand: '', // 品牌列表当前下拉内容
          keyword: '', // 搜索关键字
          pageNum: 1, // 当前页
        },
        searchWatch: {
          radioNoInShopCategoryCode: 1, // 1 => 未定义商品 和 0 => 全部商品 切换
          pageSize: 10, // 一页数量
        },

        pageSelect: [
          // 分页下拉
          {key: '每页显示10个', val: 10},
          {key: '每页显示20个', val: 20},
          {key: '每页显示30个', val: 30},
        ],

        goods: [], // 商品列表数据
        isLoadingGoods: false, // 商品列表加载中...
        isLoadedGoods: false, // 商品列表加载完成...
        isCheckedAllGoods: false, // 是否选中所有商品

        importType: 'checked', // 导入类型
        importGoodsCount: { // 导入数量
          checked: Number,
          all: Number,
          search: Number,
        },
        pagination: { // 分页
          current: 0,
          total: 0,
          count: 0
        }
      }
    },
    computed: {
      importTypeSelect(){
        return [
          // 选中下拉
          {key: '已勾选记录(' + this.importGoodsCount.checked + ')', val: 'checked'},
          {key: '全部记录(' + this.importGoodsCount.all + ')', val: 'all'},
          {key: '当前全部搜索结果(' + this.importGoodsCount.search + ')', val: 'search'}
        ]
      }
    },
    watch: {
      searchWatch: {
        handler(){
          this.fetchGoodsListData();
        },
        deep: true // 深度监视
      },
      goods: {
        handler(){
          // 返回是否全选
          this.isCheckedAllGoods = this.goods.every(item => {
              return item.isChoose;
          });
          // 返回选中数量
          let checkedArr = this.goods.filter(item => {
              return item.isChoose;
          });
          this.importGoodsCount.checked = checkedArr.length;
          if(this.$refs.importTypeSelect.value == 'checked'){
            if(checkedArr.length){
              this.$emit('update:hasChooseGoods', true);
            }else{
              this.$emit('update:hasChooseGoods', false);
            }
          }
        },
        deep: true // 深度监视
      },
      importType() {
        this.getImportType();
      }
    },
    methods: {
      // 获取品牌列表
      fetchBrandsData(){
        this.$http
          .get(this.$api.brands, {
            'approvalStatus': 2 //2为在售和下架状态商品，-2为已删除状态商品
          })
          .then(data => {
            let oData = data.brands;
            let arr = [{
              key: '不限品牌',
              val: '',
            }];
            for(let i = 0, len = oData.length; i < len; i++){
              arr.push({
                key: oData[i].brandName,
                val: oData[i].brandName,
              });
            }
            this.brandsData = arr;
          })
          .catch(err => {
            console.log(err)
          })
      },
      // 获取商品列表
      fetchGoodsListData (isGetGoodsAll) {
        this.isLoadingGoods = true;
        this.$emit('update:hasChooseGoods', false);
        this.$http
          .get(this.$api.goodsList, {
            noInShopCategory: this.searchWatch.radioNoInShopCategoryCode ? true : false, // 1 => true 只显示未分类 或 0 => false 显示所有商品
            brand: this.searchData.brand,
            keyword: this.searchData.keyword,
            pageNum: this.searchData.pageNum,
            pageSize: this.searchWatch.pageSize,
          })
          .then(data => {
            setTimeout(() => {
              if(isGetGoodsAll) this.importGoodsCount.all = data.totalRecord;
              this.importGoodsCount.search = data.totalRecord;
              this.isLoadingGoods = false;
              this.isLoadedGoods = true;
              this.getImportType();
            });
            this.generateGoodsData(data.products);
            this.pagination = {
              current: data.page,
              total: data.totalPage,
              count: data.totalRecord,
            };
          })
          .catch(err => {
              setTimeout(() => {
              this.isLoadingGoods = false;
              this.isLoadedGoods = true;
              this.getImportType();
            });
            console.log(err);
          })
      },
      generateGoodsData(data){
        let arr = [];
        data.forEach(function(item){
          var obj = {
            isChoose: false,
            productURL: item.productURL || '/lots-web/images/product/NoPicture.png',
            productName: item.productName || '',
            productCode: item.productCode || '',
            inShopCategoryDTO: item.inShopCategoryDTO || '',
          };
          arr.push(obj);
        });
        this.goods = arr;
      },
      getImportType() {
        if(this.importType == 'checked'){
          if(this.importGoodsCount.checked){
            this.$emit('update:hasChooseGoods', true);
          }else{
            this.$emit('update:hasChooseGoods', false);
          }
        }else if(this.importType == 'all'){
          if(this.importGoodsCount.all){
            this.$emit('update:hasChooseGoods', true);
          }else{
            this.$emit('update:hasChooseGoods', false);
          }
        }else if(this.importType == 'search'){
          if(this.importGoodsCount.search){
            this.$emit('update:hasChooseGoods', true);
          }else{
            this.$emit('update:hasChooseGoods', false);
          }
        }
      },
      // 搜索
      getSearch(){
        this.searchData.pageNum = 1;
        this.fetchGoodsListData();
      },
      // 重置
      resetSearch(){
        this.searchData = {
          keyword: '', // 搜索关键字
          brand: '', // 品牌列表当前下拉内容
        };
        this.fetchGoodsListData();
      },
      // 商品全选
      setCheckedAll(){
        this.goods.map(item => {
          this.$set(item, 'isChoose', this.isCheckedAllGoods)
        })
      },
      // 分页跳转
      togglePage(page) {
        this.searchData.pageNum = page;
        this.fetchGoodsListData();
      }
    },
    created(){
      this.fetchBrandsData();
      this.fetchGoodsListData(true);
    },
    components: { GoodItems }
  }
</script>

<style lang="scss" scoped>
  .area-goods{
    margin-right: 460px;
    overflow-x: auto;
    & > div{
        min-width: 650px;
      }
  }
  .goods-screen{
    height: 50px;
    padding: 6px 10px;
    background: #fafafa;
    border: 1px solid $lineGray;
  }
  .select-title{
    float: left;
    height: 34px;
    line-height: 34px;
    padding: 0 10px;
    border: 1px solid #ddd;
    border-radius: 2px 0 0 2px;
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
  }
  .goods-table{
    background: #fafafa;
    border: 1px solid $lineGray;
    table{
      width: 100%;
      /*border-collapse: collapse;*/
      border-spacing: 0;
    }
    th{
      height: 48px;
      padding: 0 10px;
      text-align: left;
      font-weight: normal;
    }
    td{
      height: 40px;
      padding: 4px 10px;
      line-height: 1.5;
      background: #fff;
      border-top: 1px solid $lineGray;
      border-bottom: 1px solid #fff;
    }
    img{
      vertical-align: top;
    }
  }
  .good-list-main {
    position: relative;
    width: 100%;
    height: 500px;
    border: 1px solid $lineGray;
    border-top: none;
    overflow-y:auto;
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
</style>
