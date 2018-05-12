<template>
  <div class="edit-category">
    <div class="item clearfix">
      <div class="float-l item-name">父类路径：</div>
      <div class="float-l text-overflow item-content">
        <span
          v-for="(item, index) in categoryPath"
          :key="index">
            <template v-if="index != pathLength - 1">{{item}}<b class="arrow font-st">></b></template>
            <i class="end-level" v-else>{{item}}</i>
        </span>
      </div>
    </div>
    <div class="item clearfix m-t-10">
      <div class="float-l item-name"><span class="red">*</span>分类名：</div>
      <div class="float-l item-content">
        <s-input class="float-l" :value.sync="categoryName" placeholder="必填" :width="160"></s-input>
        <span class="float-l m-l-10">编号：</span>
        <s-input class="float-l" :value.sync="categoryCode" placeholder="选填" :width="120"></s-input>
      </div>
    </div>
    <div v-show="error.has" class="item clearfix">
      <div class="float-l item-name"></div>
      <div class="float-l item-content red">{{error.msg}}</div>
    </div>
    <div class="item clearfix" :class="error.has === false ? 'm-t-20' : ''">
      <div class="float-l item-name"></div>
      <div class="float-l item-content">
        <s-btn class="float-l" :active="true" :width="76" @click="save">确认</s-btn>
        <s-btn class="float-l m-l-10" :width="76" @click="close">取消</s-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['payload'],
  data() {
    return {
      categoryName: this.payload.name,
      categoryCode: this.payload.code,
      error: {
        has: false,
        msg: ''
      }
    };
  },
  computed: {
    categoryId() {
      return this.payload.id;
    },
    categoryPath() {
      return this.payload.path.split(' 》');
    },
    pathLength() {
      return this.categoryPath.length;
    }
  },
  methods: {
    close() {
      this.$parent.closeCall();
    },
    save() {
      if (this.categoryName == '') {
        this.error.has = true;
        this.error.msg = '分类名不能为空';
        return;
      }
      if (this.categoryName.length > 50) {
        this.error.has = true;
        this.error.msg = '分类名长度不能大于50个字符';
        return;
      }
      if (this.categoryCode.length > 30) {
        this.error.has = true;
        this.error.msg = '编号长度不能大于30个字符';
        return;
      }
      this.$http
        .post(this.$api.updateCategory, {
          id: this.categoryId,
          code: this.categoryCode,
          name: this.categoryName
        })
        .then(() => {
          this.payload.success(
            this.categoryName,
            this.categoryCode,
            this.payload.levelLink
          );
          this.close();
        })
        .catch(err => {
          let recode = '' + ((err && (err.recode || '')) || '');
          let msg = '修改分类出错';
          let isALertError = false;
          switch (recode) {
            case '200002':
              msg = '当前父分类存在相同名称子分类';
              break;
            case '100001':
              msg = '存在相同编号';
              break;
            case '400000':
              isALertError = true;
              msg = '所选分类已不存在';
              break;
          }
          if (isALertError == false) {
            this.error.has = true;
            this.error.msg = msg;
          } else {
            this.close();
            this.$messageBox(`<p>操作失败：</p><p>${msg}</p>`, {
              textMarginTop: 28,
              closeCallBack: this.payload.fail
            });
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.edit-category {
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
.item-content,
.item-name {
  line-height: 36px;
}
.item-name {
  position: absolute;
  left: 0;
  top: 0;
  width: 80px;
  text-align: right;
}
.item-content {
  padding-left: 80px;
  width: 100%;
}
</style>
