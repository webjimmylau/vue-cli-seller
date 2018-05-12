import extend from 'extend';

const fn = {
  extend,
  trim(str) {
    let s = str.replace(/^\s\s*/, '');
    let ws = /\s/;
    let i = s.length;
    while (ws.test(s.charAt(--i)));
    return s.slice(0, i + 1);
  },
  hasClass(ele, cls) {
    let result =
      ele &&
      ele.className &&
      ele.className.search(new RegExp('(\\s|^)' + cls + '(\\s|$)')) != -1;
    return !!result;
  },
  addClass(ele, cls) {
    if (ele && !this.hasClass(ele, cls)) {
      ele.className = this.trim(
        ele.className ? ele.className + ' ' + cls : cls
      );
    }
  },
  removeClass(ele, cls) {
    if (this.hasClass(ele, cls)) {
      let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      ele.className = this.trim(ele.className.replace(reg, ' '));
    }
  },
  getElementById(id) {
    return document.getElementById(id);
  },
  getElementsByClassName(searchClass, node, tag) {
    let result = [];
    if (document.getElementsByClassName) {
      let nodes = (node || document).getElementsByClassName(searchClass);
      for (let i = 0; (node = nodes[i++]); ) {
        let tagB = tag || node.tagName;
        if (tagB !== '*' && node.tagName === tagB.toUpperCase()) {
          result.push(node);
        }
      }
      return result;
    } else {
      node = node || document;
      tag = tag || '*';
      let classes = searchClass.split(' ');
      let elements =
        tag === '*' && node.all ? node.all : node.getElementsByTagName(tag);
      let patterns = [];
      let current = null;
      let match = false;
      let i = classes.length;
      while (--i >= 0) {
        patterns.push(new RegExp('(^|\\s)' + classes[i] + '(\\s|$)'));
      }
      let j = elements.length;
      while (--j >= 0) {
        current = elements[j];
        match = false;
        let k = 0;
        let kl = patterns.length;
        for (k; k < kl; k++) {
          match = patterns[k].test(current.className);
          if (!match) break;
        }
        if (match) result.push(current);
      }
      return result;
    }
  },
  getElementsByTagName(tag, node) {
    let elem = node || document;
    return elem.getElementsByTagName(tag);
  },
  // findParentNode(e, n) {
  //   if (n === undefined) n = 1;
  //   while (n-- && e) e = e.parentNode;
  //   if (!e || e.nodeType !== 1) return null;
  //   return e;
  // },
  // findSibling(e, n) {
  //   while (e && n !== 0) {
  //     if (n > 0) {
  //       if (e.nextElementSibling) e = e.nextElementSibling;
  //       else {
  //         for (e = e.nextSibling; e && e.nodeType !== 1; e = e.nextSibling);
  //       }
  //       n--;
  //     } else {
  //       if (e.previousElementSibing) e = e.previousElementSibling;
  //       else {
  //         for (
  //           e = e.previousSibling;
  //           e && e.nodeType !== 1;
  //           e = e.previousSibling
  //         );
  //       }
  //       n++;
  //     }
  //   }
  //   return e;
  // },
  sum(arg1, arg2, accurate) {
    let r1;
    let r2;
    let m;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return ((arg1 * m + arg2 * m) / m).toFixed(accurate || 2);
  },
  mul(arg1, arg2, accurate) {
    let m = 0;
    let s1 = arg1.toString();
    let s2 = arg2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) {}
    try {
      m += s2.split('.')[1].length;
    } catch (e) {}
    return (
      Number(s1.replace('.', '')) *
      Number(s2.replace('.', '')) /
      Math.pow(10, m)
    ).toFixed(accurate || 2);
  },
  assert(str, regexp) {
    return regexp.exec('' + str) != null;
  }
};

export default {
  install(Vue, name = '$tool') {
    Object.defineProperty(Vue.prototype, name, { value: fn });
  }
};
