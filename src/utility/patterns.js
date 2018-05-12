const PATTERN = {
  empty: /^[\S\s]+$/, // 非空
  isNumeric: /^[-+]?[0-9]$|^[-+]?[1-9][0-9]+$|^[-+]?0\.[0-9]+$|^[-+]?[1-9][0-9]*\.[0-9]+$/, // 是否为数字（零、正数、负数）
  isPositiveNumber: /^[+]?[0-9]$|^[+]?[1-9][0-9]+$|^[+]?0\.[0-9]+$|^[+]?[1-9][0-9]*\.[0-9]+$/, // 是否为正数（包含零）
  isPositiveInteger: /^[+]?[1-9]$|^[+]?[1-9][0-9]+$/ // 是否为正整数（不包含零）
};

export default {
  install(Vue, name = '$pattern') {
    Object.defineProperty(Vue.prototype, name, { value: PATTERN });
  }
};
