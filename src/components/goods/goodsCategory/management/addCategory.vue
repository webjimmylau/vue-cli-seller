<template>
  <div class="add-category">
    <div class="item m-b-10 clearfix">
      <div class="float-l item-name">父类路径：</div>
      <div class="float-l text-overflow item-content">
        <span
          v-for="(item, index) in supCategoryPath"
          :key="index">
            <template v-if="index != supPathLength - 1">{{item}}<b class="arrow font-st">></b></template>
            <i class="end-level" v-else>{{item}}</i>
        </span>
      </div>
    </div>
    <div
      class="item item-edit-wrap clearfix"
      :class="item.errMsg != '' ? 'item-edit-error' : ''"
      v-for="(item, index) in items"
      :key="index">
        <div class="float-l item-name"><span class="red">*</span>子类名：</div>
        <div class="float-l item-content">
          <div class="clearfix">
            <s-input
              class="float-l"
              placeholder="必填"
              :width="160"
              :value.sync="item.name"
              :lazy="true"
              @change="changeCategoryVal(index)"></s-input>
            <span class="float-l m-l-10">编号：</span>
            <s-input
              class="float-l"
              placeholder="选填"
              :width="120"
              :value.sync="item.code"
              :lazy="true"
              @change="changeCategoryVal(index)"></s-input>
            <s-btn
              class="float-l m-l-10"
              v-show="showRemoveBtn"
              @click="removeItem(index)"
              :width="36">-</s-btn>
            <s-btn
              class="float-l m-l-10"
              v-show="index == itemsLength && index < max"
              @click="addItem"
              :width="36">+</s-btn>
          </div>
          <div v-if="item.errMsg != ''" class="error-msg red">{{item.errMsg}}</div>
        </div>
    </div>
    <div class="tips">提示：保存时至少输入一个子分类；相同父级子类名称不能重复；店铺所有分类编号不能重复。</div>
    <div class="item item-action-wrap m-t-20 clearfix">
      <div class="float-l item-name"></div>
      <div class="float-l item-content">
        <s-btn class="float-l" :active="true" :width="76" @click="save">确认</s-btn>
        <s-btn class="float-l m-l-10" :width="76" @click="close">取消</s-btn>
        <span v-show="gobalError" class="float-l red m-l-10">{{gobalErrorMsg}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['payload'],
  data() {
    return {
      max: 3,
      items: [{ name: '', code: '', errMsg: '' }],
      gobalError: false,
      gobalErrorMsg: ''
    };
  },
  computed: {
    itemsLength() {
      return this.items.length - 1;
    },
    showRemoveBtn() {
      return this.items.length > 1 ? true : false;
    },
    supCatId() {
      return this.payload.id;
    },
    supCategoryPath() {
      if (this.payload.path) return this.payload.path.split(' 》');
      else return ['无'];
    },
    supPathLength() {
      return this.supCategoryPath.length;
    },
    hasSubCategory() {
      let res = false;
      for (let item of this.items) {
        if (item.name !== '') {
          res = true;
          break;
        }
      }
      return res;
    },
    hasError() {
      let subError = false;
      for (let item of this.items) {
        if (item.errMsg != '') {
          subError = true;
          break;
        }
      }
      return subError || this.gobalError;
    }
  },
  methods: {
    resetPopupHeigth(height) {
      this.$parent.resetHeigth(this.$parent.iH + height);
    },
    removeItem(index) {
      let height = -46;
      if (this.items[index].errMsg != '') {
        height = -70;
      }
      this.items.splice(index, 1);
      this.resetPopupHeigth(height);
    },
    addItem() {
      this.items.push({ name: '', code: '', errMsg: '' });
      this.resetPopupHeigth(46);
    },
    changeCategoryVal(index) {
      this.gobalError = false;
      this.gobalErrorMsg = '';

      let hasItemError = false;
      this.items.forEach(function(item) {
        if (item.errMsg != '') hasItemError = true;
        item.errMsg = '';
      });
      if (hasItemError) this.resetPopupHeigth(-24);
    },
    generatePostData() {
      let data = [];
      this.items.forEach(item => {
        if (item.name !== '' || item.code !== '') {
          let obj = { name: item.name };
          if (item.code !== '') obj.code = item.code;
          if (this.supCatId) obj.supCatId = this.supCatId;
          data.push(obj);
        }
      });
      return data;
    },
    save() {
      if (this.hasSubCategory === false) {
        this.gobalError = true;
        this.gobalErrorMsg = '至少输入一个子分类';
        return;
      } else {
        this.gobalError = false;
        this.gobalErrorMsg = '';
      }

      if (this.hasError) return;

      this.$http
        .post(this.$api.addCategory, this.generatePostData())
        .then(data => {
          this.payload.success(
            data.categories,
            this.payload.levelLink,
            this.payload.level
          );
          this.close();
        })
        .catch(err => {
          let isGobalError = true;
          let isAlertError = false;
          let errorMsg = '新增子类失败';
          let errorItemIndex = null;
          let recode = '' + ((err && (err.recode || '')) || '');

          if (recode == '888888') {
            let errorCodes = err.errorCodes || [];
            let i = 0;
            let l = errorCodes.length;
            let errorCode = null;
            for (i; i < l; i++) {
              if (errorCodes[i] != '0000') {
                errorCode = '' + errorCodes[i];
                errorItemIndex = i;
                break;
              }
            }
            if (errorCode) {
              isGobalError = false;
              switch (errorCode) {
                case '100000':
                  errorMsg = '编号长度不能大于30个字符';
                  break;
                case '100001':
                  errorMsg = '存在相同的编号';
                  break;
                case '200000':
                  errorMsg = '分类名不能为空';
                  break;
                case '200001':
                  errorMsg = '分类名长度不能大于50个字符';
                  break;
                case '200002':
                  errorMsg = '存在相同名称的子分类';
                  break;
                case '300000':
                  isAlertError = true;
                  errorMsg = '所选分类已不存在，请选择其他分类。';
                  break;
                case '400000':
                  isAlertError = true;
                  errorMsg = '当前分类有商品不能添加子分类';
                  break;
              }
            }
          }

          if (isGobalError && isAlertError === false) {
            this.gobalError = true;
            this.gobalErrorMsg = errorMsg;
            return;
          }

          if (
            isGobalError === false &&
            errorItemIndex !== null &&
            isAlertError === false
          ) {
            let targetItems = [];
            this.items.forEach(function(item) {
              if (item.name !== '' || item.code !== '') {
                targetItems.push(item);
              }
            });
            targetItems[errorItemIndex].errMsg = errorMsg;
            this.resetPopupHeigth(24);
            return;
          }

          if (isGobalError === false && isAlertError) {
            this.close();
            this.$messageBox(`<p>操作失败：</p><p>${errorMsg}</p>`, {
              textMarginTop: 28,
              closeCallBack: this.payload.fail
            });
          }
        });
    },
    close() {
      this.$parent.closeCall();
    }
  }
};
</script>

<style lang="scss" scoped>
.add-category {
  padding: 12px 20px 0 0;
  .arrow {
    padding: 0 8px;
  }
  .end-level {
    font-style: normal;
    color: $lineOrange;
  }
}
.item {
  position: relative;
}
.item-action-wrap {
  padding-bottom: 25px;
}
.item-edit-wrap {
  height: 46px;
  &.item-edit-error {
    margin-bottom: 10px;
    height: 60px;
  }
}
.item-content,
.item-name {
  line-height: 36px;
}
.item-name {
  position: absolute;
  left: 0;
  top: 0;
  width: 100px;
  text-align: right;
}
.item-content {
  padding-left: 100px;
  width: 100%;
  .error-msg {
    margin-top: 4px;
    line-height: 20px;
    text-indent: 2px;
  }
}
.tips {
  margin: 10px 0 0 20px;
  padding: 8px 10px;
  border: 1px solid #ffcc66;
  background-color: #fff7e6;
  color: #999999;
}
</style>
