<template>
  <div :id="id" class="seller-popup animated fadeIn">
    <div class="popup-wrap" :style="popupWrapInlineStyle">
      <div v-if="hasHead" class="popup-head">{{ title }}<span @click="closeCall" class="close-btn"></span></div>
      <div class="popup-main" :style="popupMainInlineStyle">
        <slot></slot>
      </div>
    </div>
    <div @click="closeByMark" class="mark"></div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object
    }
  },
  data() {
    return {
      id: 'seller-popup-' + +new Date(),
      width: this.options.width || 500,
      title: this.options.title,
      shadowClosed: !!this.options.shadowClosed,
      hasHead:
        this.options.hasHead === undefined ? true : !!this.options.hasHead,
      closeCallBack: this.options.closeCallBack,
      iH: this.getRealHeight()
    };
  },
  computed: {
    popupWrapInlineStyle() {
      let style = [];
      let width = this.width;
      let height = this.iH;
      let marginLeft = width / 2 * -1;
      let marginTop = height / 2 * -1;

      style.push('width:' + width + 'px');
      style.push('height:' + height + 'px');
      style.push('margin-left:' + marginLeft + 'px');
      style.push('margin-top:' + marginTop + 'px');

      return style.join(';');
    },
    popupMainInlineStyle() {
      let height = this.hasHead ? this.iH - 41 : this.iH;
      return 'height: ' + height + 'px;';
    }
  },
  methods: {
    removeVm() {
      this.$children && this.$children[0] && this.$children[0].$destroy();
      this.$destroy();
      this.$parent && this.$parent.$destroy();
      let el = document.getElementById(this.id);
      if (el) document.body.removeChild(el);
      el = null;
    },
    closeCall() {
      if (this.closeCallBack) this.closeCallBack();
      this.removeVm();
    },
    closeByMark() {
      if (this.shadowClosed) this.closeCall();
    },
    getViewportHeight() {
      var doc = window.document;
      if (doc.compatMode == 'CSS1Compat')
        return doc.documentElement.clientHeight - 190;

      return doc.body.clientHeight - 190;
    },
    getRealHeight() {
      let maxHeight = this.getViewportHeight();
      return maxHeight > this.options.height ? this.options.height : maxHeight;
    },
    resetHeigth(val) {
      let maxHeight = this.getViewportHeight();
      let iHeight = maxHeight > val ? val : maxHeight;
      this.iH = iHeight;
    }
  }
};
</script>

<style lang="scss">
.seller-popup {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9990;
  width: 100%;
  height: 100%;
  min-width: $minWidth;
  animation-duration: .5s;
  .mark {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #000000;
    opacity: .3;
  }
  .popup-wrap {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 9991;
    border-radius: 5px;
    overflow: hidden;
    background-color: #ffffff;
  }
  .popup-head {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #eeeeee;
    box-sizing: content-box;
    text-indent: 14px;
    background-color: #fafafa;
    font-size: 16px;
    font-family: 'Microsoft YaHei';
  }
  .close-btn {
    float: right;
    margin: 10px 8px 0 0;
    width: 20px;
    height: 20px;
    overflow: hidden;
    background-repeat: no-repeat;
    background-image: url(./images/popbox_close.png);
    background-position: center;
    cursor: pointer;
    &:hover {
      opacity: .5;
    }
  }
  .popup-main {
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-track {
      box-shadow: inset 1px 0 0 rgba(0, 0, 0, .1);
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 0;
      background-color: rgba(194, 194, 194, .6);
    }
    &::-webkit-scrollbar-thumb:window-inactive {
      background-color: rgba(194, 194, 194, .7);
    }
  }
}
</style>
