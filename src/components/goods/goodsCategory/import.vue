<template>
  <div class="import-wrap">
    <!--导入自定义分类-->
    <div class="import-categories">
      <div class="import-title">导入自定义分类<span class="f-s-12 gray">（本导入仅限创建用途）</span></div>
        <div class="import-item clearfix">
          <div class="import-label">下载模板：</div>
          <div class="float-l">
            <a class="import-btn" href="/lots-web/agency/rest/api/inShopCategory/downInShopCategoryTemp">下载模板</a>
            <p class="gray m-t-10">（温馨提示：标有星号 (*) 的字段是必填字段）</p>
          </div>
        </div>
        <div class="import-item clearfix">
          <div class="import-label">选择导入文件：</div>
          <div class="float-l">
            <div class="import-btn import-choose">
              <span>选择文件</span>
              <input
                type="file"
                ref="categoriesFile"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                @change="changeCategoriesFile($event)">
            </div>
            <span class="m-l-5">{{categories.fileText ? categories.fileText : '（请选择文件）'}}</span>
          </div>
        </div>
        <div class="import-item clearfix m-b-20">
          <div class="import-label">&nbsp;</div>
          <div class="float-l">
            <s-btn
              @click="importCategoriesFile"
              :width="90"
              :small="true"
              :active="true"
              :disabled="!categories.hasFile"
              :loading="categories.isLoadingFileImport">确 认</s-btn>
          </div>
        </div>
        <div class="import-item clearfix import-do">
          <div class="import-label">导入失败分类：</div>
          <span class="float-l result-text red">{{categories.failImportNum > 0 ? categories.failImportNum : '--'}}</span>
          <s-btn class="float-l"
            @click="exportFailCategories"
            :small="true"
            :width="90"
            :disabled="categories.failImportNum == 0">导出数据</s-btn>
        </div>
        <div class="import-item clearfix import-do">
          <div class="import-label">导入成功分类：</div>
          <span class="float-l result-text">{{categories.successImportNum > 0 ? categories.successImportNum : '--'}}</span>
          <s-btn class="float-l"
            @click="exportSuccessCategories"
            :small="true"
            :width="90"
            :disabled="categories.successImportNum == 0">导出数据</s-btn>
        </div>
    </div>
    <!--导入商品-->
    <div class="import-products">
      <div class="import-title">导入商品</div>
      <div class="import-item clearfix">
        <div class="import-label">下载模板：</div>
        <div class="float-l">
          <a class="import-btn" href="/lots-web/agency/rest/api/inShopCategory/downInShopCategoryProductTemp">下载模板</a>
          <p class="gray m-t-10">（温馨提示：标有星号 (*) 的字段是必填字段）</p>
        </div>
      </div>
      <div class="import-item clearfix">
        <div class="import-label">选择导入文件：</div>
        <div class="float-l">
          <div class="import-btn import-choose">
            <span>选择文件</span>
            <input
              type="file"
              ref="productsFile"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              @change="changeProductsFile($event)">
          </div>
          <span class="m-l-5">{{products.fileText ? products.fileText : '（请选择文件）'}}</span>
        </div>
      </div>
      <div class="import-item clearfix m-b-20">
        <div class="import-label">&nbsp;</div>
        <div class="float-l">
          <s-btn
            @click="importProductsFile"
            :width="90"
            :small="true"
            :active="true"
            :disabled="!products.hasFile"
            :loading="products.isLoadingFileImport">确 认</s-btn>
        </div>
      </div>
      <div class="import-item clearfix import-do">
        <div class="import-label">导入失败商品：</div>
        <span class="float-l result-text red">{{products.failImportNum > 0 ? products.failImportNum : '--'}}</span>
        <s-btn class="float-l"
          @click="exportFailProducts"
          :small="true"
          :width="90"
          :disabled="products.failImportNum == 0">导出数据</s-btn>
      </div>
      <div class="import-item clearfix import-do">
        <div class="import-label">导入成功商品：</div>
        <span class="float-l result-text">{{products.successImportNum > 0 ? products.successImportNum : '--'}}</span>
        <s-btn class="float-l"
          @click="exportSuccessProducts"
          :small="true"
          :width="90"
          :disabled="products.successImportNum == 0">导出数据</s-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: {
        fileText: '',
        hasFile: false,
        isLoadingFileImport: false,
        failImportNum: 0,
        successImportNum: 0
      },
      products: {
        fileText: '',
        hasFile: false,
        isLoadingFileImport: false,
        failImportNum: 0,
        successImportNum: 0
      }
    };
  },
  methods: {
    downFile(resource) {
      let link = document.createElement('a');
      link.href = resource;
      link.click();
      link = null;
    },
    // categories
    changeCategoriesFile(event) {
      let file = event.target.files;
      if (file.length > 0) {
        this.categories.hasFile = true;
        this.categories.fileText = file[0].name;
      } else {
        this.categories.hasFile = false;
        this.categories.fileText = '';
      }
    },
    importCategoriesFile() {
      this.categories.isLoadingFileImport = true;
      let formData = new FormData();
      formData.append('upload_file', this.$refs.categoriesFile.files[0]);
      this.$http
        .post(this.$api.importCategories, formData)
        .then(data => {
          if (!data.failure && !data.success)
            this.$messageBox('商品文件导入为空！', { autoClosed: 3 });
          this.categories.failImportNum = data.failure;
          this.categories.successImportNum = data.success;
        })
        .catch(() => {
          this.$messageBox('自定义分类文件导入失败！', { autoClosed: 3 });
          this.categories.failImportNum = 0;
          this.categories.successImportNum = 0;
        })
        .then(() => {
          this.categories.isLoadingFileImport = false;
        });
    },
    exportSuccessCategories() {
      this.downFile(this.$api.exportSaveCategoriesResult + '?flag=10');
    },
    exportFailCategories() {
      this.downFile(this.$api.exportSaveCategoriesResult + '?flag=20');
    },
    // products
    changeProductsFile(event) {
      let file = event.target.files;
      if (file.length > 0) {
        this.products.hasFile = true;
        this.products.fileText = file[0].name;
      } else {
        this.products.hasFile = false;
        this.products.fileText = '';
      }
    },
    importProductsFile() {
      this.products.isLoadingFileImport = true;
      let formData = new FormData();
      formData.append('upload_file', this.$refs.productsFile.files[0]);
      this.$http
        .post(this.$api.importProducts, formData)
        .then(data => {
          if (!data.failure && !data.success)
            this.$messageBox('商品文件导入为空！', { autoClosed: 3 });
          this.products.failImportNum = data.failure;
          this.products.successImportNum = data.success;
        })
        .catch(() => {
          this.$messageBox('商品文件导入失败！', { autoClosed: 3 });
          this.products.failImportNum = 0;
          this.products.successImportNum = 0;
        })
        .then(() => {
          this.products.isLoadingFileImport = false;
        });
    },
    exportSuccessProducts() {
      this.downFile(this.$api.exportSaveProductsResult + '?flag=10');
    },
    exportFailProducts() {
      this.downFile(this.$api.exportSaveProductsResult + '?flag=20');
    }
  }
};
</script>

<style lang="scss" scoped>
.import-wrap {
  padding: 0 10px;
}
.import-categories {
  padding: 30px 0 40px 10px;
  border-bottom: 1px solid #dddddd;
}
.import-products {
  padding: 50px 0 40px 10px;
}
.import-title {
  font-size: 14px;
  margin-bottom: 20px;
}
.import-item {
  margin: 10px 0;
  .result-text {
    width: 100px;
    text-indent: 2px;
    line-height: 32px;
  }
}
.import-label {
  float: left;
  width: 100px;
  line-height: 30px;
  text-align: right;
}
.import-do {
  .import-label {
    line-height: 32px;
  }
}
.import-btn {
  display: inline-block;
  width: 90px;
  height: 30px;
  line-height: 28px;
  text-align: center;
  vertical-align: middle;
  color: #666666;
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 2px;
  box-sizing: border-box;
  cursor: pointer;
}
.import-choose {
  position: relative;
  overflow: hidden;
  input {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    opacity: 0;
  }
}
</style>
