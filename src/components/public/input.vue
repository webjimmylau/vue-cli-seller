<template>
  <div class="seller-input" :class="inputClass" :style="width ? 'width:' + width + 'px' : ''">
    <input
      type="text"
      ref="input"
      v-if="!lazy"
      @blur="checkVal"
      v-model.trim="val"
      :placeholder="placeholder"
      :style="inputInlineStyle"/>
    <input
      v-else
      type="text"
      ref="input"
      @blur="checkVal"
      v-model.trim.lazy="val"
      :placeholder="placeholder"
      :style="inputInlineStyle"/>
    <transition v-if="validate" name="fade-error">
      <span
        @click="errorClosed ? clean(true) : ''"
        v-show="isError"
        class="error-msg">{{errorMsg}}</span>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: String,
    width: Number,
    value: {
      type: [String, Number],
      required: true
    },
    lazy: {
      type: Boolean,
      default: false
    },
    rule: Array,
    autoHide: {
      type: Boolean,
      default: true
    },
    errorClosed: {
      type: Boolean,
      default: true
    },
    align: {
      type: String,
      default: 'left'
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      val: this.value,
      isError: false,
      errorMsg: '',
      timer: null
    };
  },
  computed: {
    validate() {
      return this.rule && this.rule.length > 0;
    },
    inputInlineStyle() {
      return 'text-align:' + this.align;
    },
    inputClass() {
      let arr = [];
      if (this.small) arr.push('seller-input-small');
      return arr.join(' ').trim();
    }
  },
  watch: {
    val(v) {
      this.$emit('update:value', v);
      this.$emit('change', v);
    },
    value() {
      this.val = this.value;
    }
  },
  methods: {
    checkVal() {
      if (!this.validate) return;
      let aRule = this.rule;
      let i = 0;
      let l = aRule.length;
      let str = this.val;
      let haveError = false;
      for (i; i < l; i++) {
        let res = aRule[i].pattern.exec(str) != null;
        if (res === false) {
          this.val = '';
          this.isError = true;
          this.errorMsg = aRule[i].msg;
          haveError = true;
          break;
        }
      }

      if (haveError === false) {
        // 验证通过则不显示错误信息
        this.isError = false;
        this.errorMsg = '';
      }

      if (this.autoHide === true) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.clean(false);
        }, 2200);
      }
    },
    clean(isFocus) {
      if (this.isError) {
        this.val = '';
        this.isError = false;
        this.errorMsg = '';
        isFocus && this.$refs.input.focus();
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
};
</script>

<style lang="scss">
.seller-input {
  position: relative;
  width: 216px;
  height: 36px;
  &.seller-input-small {
    height: 32px;
    & > input {
      padding: 6px 8px;
    }
  }
  input {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 8px 8px;
    border: 1px solid $gray;
    border-radius: 2px;
    background-color: #ffffff;
    line-height: 1;
  }
  .error-msg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    line-height: 34px;
    border: 1px solid red;
    border-radius: 2px;
    text-indent: 8px;
    color: red;
    background-color: #ffffff;
    cursor: text;
    overflow: hidden;
  }
  .fade-error-leave-active,
  .fade-error-enter-active {
    transition: opacity .5s;
  }
  .fade-error-leave-to,
  .fade-error-enter {
    opacity: 0;
  }
}
</style>
