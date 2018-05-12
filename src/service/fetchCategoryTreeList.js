import { http } from '@/utility/http';
import { api } from '@/utility/api';

export function fetchCategoryList(options = {}) {
  return http.get(api.customizeCategoryList, options);
}

export function createCategoryTree(categories) {
  let tree = [];
  let generateData = function(data, level, prefixPath, i) {
    let sPath = prefixPath + data.name;
    let obj = {
      id: data.id,
      name: data.name,
      code: data.code || '',
      level: level,
      levelLink: '' + i,
      path: sPath,
      hasGoods: data.count4Products == 0 ? false : true,
      hasSub: data.subCategories && data.subCategories.length > 0 ? true : false
    };
    if (obj.hasSub === true) {
      obj.sub = [];
      data.subCategories.forEach(function(subItem, j) {
        obj.sub.push(
          generateData(
            subItem,
            level + 1,
            sPath + ' 》',
            obj.levelLink + '-' + j
          )
        );
      });
    }
    return obj;
  };
  categories.forEach(function(item, i) {
    tree.push(generateData(item, 1, '', i));
  });
  return tree;
}
