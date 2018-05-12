import messageBox from './messageBox.vue';

export default {
  componentConstructor: null,

  render(msg, option) {
    let conf = option || {};
    let propsData = {
      closed: conf.closed
    };
    if (conf.title) propsData.title = conf.title;
    if (conf.width) propsData.width = conf.width;
    if (conf.height) propsData.height = conf.height;
    if (msg) propsData.msg = msg;
    if (conf.textAlign) propsData.textAlign = conf.textAlign;
    if (conf.textMarginTop) propsData.textMarginTop = conf.textMarginTop;
    if (conf.shadowClosed) propsData.shadowClosed = conf.shadowClosed;
    if (conf.sure) propsData.sure = conf.sure;
    if (conf.sureText) propsData.sureText = conf.sureText;
    if (conf.cancelText) propsData.cancelText = conf.cancelText;
    if (conf.sureCallBack) propsData.sureCallBack = conf.sureCallBack;
    if (conf.cancelCallBack) propsData.cancelCallBack = conf.cancelCallBack;
    if (conf.closeCallBack) propsData.closeCallBack = conf.closeCallBack;
    if (conf.autoClosed) propsData.autoClosed = conf.autoClosed;
    let vm = new this.componentConstructor({ propsData }).$mount();
    document.body.appendChild(vm.$el);
  },

  install(Vue) {
    this.componentConstructor = Vue.extend(messageBox);
    Object.defineProperty(Vue.prototype, '$messageBox', {
      value: (msg, option) => {
        this.render(msg, option);
      }
    });
  }
};
