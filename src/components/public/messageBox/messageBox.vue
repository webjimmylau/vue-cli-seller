<template>
  <div :id="id" class="seller-message-box animated fadeIn">
    <div class="box" :style="boxInlineStyle">
      <div class="box-head">{{ rTitle }}<span v-if="hasCloseBtn" @click="closeCall" class="close-btn"></span></div>
      <div class="box-main" :style="boxMainInlineStyle" v-html="msg"></div>
      <div class="box-footer">
        <template v-if="!!sure">
          <span @click="cancelCall" class="box-footer-close-btn" style="width: 50%;">{{ rcancelText }}</span>
          <span v-if="!!sure" @click="sureCall" class="box-footer-sure-btn">{{ rSureText }}</span>
        </template>
        <span v-else @click="closeCall" class="box-footer-close-btn">关 闭</span>
      </div>
    </div>
    <div @click="closeByMark" class="mark"></div>
  </div>
</template>

<script>
export default {
  props: [
    'title', // 标题
    'closed', // 是否显示头部的关闭按钮
    'width', // 弹窗宽
    'height', // 弹窗高
    'msg', // 提示内容
    'textAlign', // 提示内容对齐方式
    'textMarginTop', // 提示内容距离容器顶部距离
    'shadowClosed', // 是否需要点击遮罩层关闭弹窗
    'sure', // 是否显示确定按钮
    'sureText', // 确定按钮文本
    'cancelText', // 取消按钮文本
    'sureCallBack', // 确认回调
    'cancelCallBack', // 取消回调
    'closeCallBack', // 关闭弹窗回调
    'autoClosed' // 多少秒后自动关闭，为零则默认不自动关闭
  ],
  data() {
    return {
      id: 'seller-message-box-' + +new Date(),
      timer: null
    };
  },
  computed: {
    closedTime() {
      if (!!this.autoClosed === false) return 0;
      else return parseInt(this.autoClosed) * 1000;
    },
    rTitle() {
      return this.title || '提示';
    },
    rSureText() {
      return this.sureText || '确 定';
    },
    rcancelText() {
      return this.cancelText || '取 消';
    },
    hasCloseBtn() {
      if (this.closed === undefined) return true;
      else return !!this.closed;
    },
    boxHeight() {
      return this.height || 180;
    },
    boxInlineStyle() {
      let style = [];
      let width = this.width || 420;
      let height = this.boxHeight;
      let marginLeft = width / 2 * -1;
      let marginTop = (height / 2 + 60) * -1;

      style.push('width:' + width + 'px');
      style.push('height:' + height + 'px');
      style.push('margin-left:' + marginLeft + 'px');
      style.push('margin-top:' + marginTop + 'px');

      return style.join(';');
    },
    boxMainInlineStyle() {
      let style = [];
      let textAlign = this.textAlign || 'center';
      let marginTop = this.textMarginTop || (this.boxHeight - 41 - 41 - 20) / 2;

      style.push('text-align:' + textAlign);
      style.push('margin-top:' + marginTop + 'px');

      return style.join(';');
    }
  },
  methods: {
    removeVm() {
      this.$destroy();
      let el = document.getElementById(this.id);
      if (el) document.body.removeChild(el);
      el = null;
    },
    closeCall() {
      this.removeVm();
      if (this.closeCallBack) this.closeCallBack();
    },
    closeByMark() {
      if (!!this.shadowClosed) this.closeCall();
    },
    sureCall() {
      this.removeVm();
      if (this.sureCallBack) this.sureCallBack();
    },
    cancelCall() {
      this.removeVm();
      if (this.cancelCallBack) this.cancelCallBack();
    }
  },
  mounted() {
    if (this.closedTime === 0) return;
    this.timer = setTimeout(() => {
      this.removeVm();
    }, this.closedTime);
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
.seller-message-box {
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
  .box {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 9991;
    border-radius: 5px;
    overflow: hidden;
    background-color: #ffffff;
  }
  .box-head {
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
  .box-main {
    padding: 0 14px;
    line-height: 20px;
  }
  .box-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    box-sizing: content-box;
    border-top: 1px solid #eeeeee;
  }
  .box-footer-close-btn,
  .box-footer-sure-btn {
    float: left;
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    text-align: center;
    font-size: 16px;
    font-family: 'Microsoft YaHei';
    background-color: #fafafa;
    box-sizing: border-box;
    &:hover {
      background-color: #ffffff;
    }
  }
  .box-footer-sure-btn {
    width: 50%;
    border-left: 1px solid #eeeeee;
  }
}
</style>
