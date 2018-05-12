import Route from '@/router/path';

// 一级导航
export const navs = state => {
  let arr = [];
  if (state.auth.load === true) {
    arr.push({
      name: '我的店铺',
      link: '/lots-web/agency/index_LDP/',
      external: true
    });
  }
  state.auth.data.forEach(item => {
    let obj = { name: item.name };
    if (item.name === '商品管理') {
      obj.link = Route.goods;
      obj.external = false;
    } else {
      obj.link = item.authorize;
      obj.external = true;
    }
    arr.push(obj);
  });
  return arr;
};

// 二级菜单 -- 商品管理
export const goodsMenu = state => {
  let sub = [];
  let arr = [];
  for (let item of state.auth.data) {
    if (item.name === '商品管理') {
      sub = item.sonFunctionDTOs || [];
      break;
    }
  }
  sub.forEach(item => {
    let obj = { name: item.name };
    if (item.name === '商品分类') {
      obj.link = Route.goodsCategory;
      obj.external = false;
    } else {
      obj.link = item.authorize;
      obj.external = true;
    }
    arr.push(obj);
  });
  return arr;
};
