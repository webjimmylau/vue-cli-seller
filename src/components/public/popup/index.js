import Popup from './popup.vue';

export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$popup', {
      value: (MainComponent, popupOptions = {}, payload = {}) => {
        let ComponentConstructor = Vue.extend({
          data() {
            return { popupOptions, payload };
          },
          template: `<Popup :options="popupOptions">
                       <MainComponent :payload="payload"></MainComponent>
                     </Popup>`,
          components: { Popup, MainComponent }
        });
        let vm = new ComponentConstructor().$mount();
        document.body.appendChild(vm.$el);
      }
    });
  }
};
