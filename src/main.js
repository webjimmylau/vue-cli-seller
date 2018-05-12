require('es6-promise/auto');
import Vue from 'vue';
import TableComponent from 'vue-table-component';
import '@/assets/style/tableComponent.scss';
import App from './App';
import store from './store';
import router from './router';
import service from './service/index';
import tool from './utility/tool';
import http from './utility/http';
import api from './utility/api';
import pattern from './utility/patterns';
import Input from '@/components/public/input';
import Btn from '@/components/public/btn/index';
import Select from '@/components/public/select/index';
import CheckBox from '@/components/public/checkbox/index';
import Radio from '@/components/public/radio/index';
import Layout from '@/components/public/layout';
import Main from '@/components/public/main';
import Pagination from '@/components/public/pagination/index';
import Loading from '@/components/public/loading';
import Text from '@/components/public/text';
import messageBox from '@/components/public/messageBox/index';
import popup from '@/components/public/popup/index';

Vue.use(service);
Vue.use(tool);
Vue.use(http);
Vue.use(api);
Vue.use(pattern);
Vue.use(messageBox);
Vue.use(popup);
Vue.use(TableComponent);
Vue.component('s-input', Input);
Vue.component('s-btn', Btn);
Vue.component('s-select', Select);
Vue.component('s-check-box', CheckBox);
Vue.component('s-radio', Radio);
Vue.component('s-layout', Layout);
Vue.component('s-layout-main', Main);
Vue.component('s-pagination', Pagination);
Vue.component('s-loading', Loading);
Vue.component('s-text', Text);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
});
