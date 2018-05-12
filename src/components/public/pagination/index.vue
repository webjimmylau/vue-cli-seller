<template>
  <div class="seller-pagination" :style="alignType">
    <div class="seller-pagination-main">
      <span
        v-show="data.count && data.count > 0"
        class="count">共<b>{{data.total}}</b>页，共<b>{{data.count}}</b>条记录</span>
      <ul v-show="!isOnlyone">
        <li v-show="data.current > 1">
          <a @click.prevent="go(data.current - 1)" class="pre" href="javascript:;">上一页</a>
        </li>
        <template v-if="data.current > 3">
          <li v-for="i in [1, 2]" :key="i">
            <a @click.prevent="go(i)" href="javascript:;">{{i}}</a>
          </li>
          <li>
            <span class="more">...</span>
          </li>
        </template>
        <li
          v-for="n in middle.length"
          :key="n + middle.limit"
          :class="[(n + middle.limit) == data.current ? 'cur' : '']">
            <a
              @click.prevent="(n + middle.limit) == data.current ? '' : go(n + middle.limit)"
              href="javascript:;">{{n + middle.limit}}</a>
        </li>
        <template v-if="data.total > middle.end + 2">
          <li>
            <span class="more">...</span>
          </li>
          <li v-for="k in [1, 0]" :key="data.total - k">
            <a @click.prevent="go(data.total - k)" href="javascript:;">{{data.total - k}}</a>
          </li>
        </template>
        <li v-show="data.current != data.total">
          <a @click.prevent="go(data.current + 1)" class="next" href="javascript:;">下一页</a>
        </li>
      </ul>
      <div v-if="hasJumb" class="action">
        <i>跳转到</i>
        <input type="text" v-model.number.lazy="num" @change="checkVal"/>
        <i>页</i>
        <span @click="jump">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    current: {
      // 当前页码
      type: Number
    },
    total: {
      // 总页数
      type: Number
    },
    count: {
      // 总记录数
      type: Number
    },
    space: {
      // 分页按钮显示个数
      type: Number,
      default: 2
    },
    align: {
      type: String,
      default: 'right'
    },
    haveJumb: {
      // 是否显示跳转操作
      type: Boolean,
      default: false
    },
    to: {
      // 点击页码的回调函数
      type: Function
    }
  },
  data() {
    return {
      num: ''
    };
  },
  computed: {
    data() {
      return {
        current: this.current,
        total: this.total,
        count: this.count
      };
    },
    hasJumb() {
      let bJumb = !!this.haveJumb;
      if (bJumb && this.total > 3) return true;
      else return false;
    },
    alignType() {
      return 'text-align:' + this.align + ';';
    },
    isOnlyone() {
      if (this.current == 1 && this.total == 1) return true;
      return false;
    },
    middle() {
      let num = this.space;
      let start = this.current - num;
      let end = this.current + num;

      if (this.current > 3) {
        if (start <= 3) start = 4;
      } else {
        if (start <= 0) start = 1;
      }

      if (end > this.total) {
        end = this.total;
      }

      return {
        end: end,
        limit: start - 1,
        length: end - start + 1
      };
    }
  },
  methods: {
    go(pageNum, event) {
      if (this.to) this.to(pageNum);
    },
    checkVal() {
      if (/^[1-9]\d*$/.test(this.num + '') === false) {
        this.num = 1;
      }
    },
    jump() {
      if (this.num === '') return;
      this.go(this.num);
    }
  }
};
</script>

<style lang="scss">
.seller-pagination {
  overflow: hidden;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  .count {
    padding-right: 7px;
    float: left;
    b {
      padding: 0 4px;
      color: #333333;
    }
  }
  .action {
    padding-left: 7px;
    float: left;
    i,
    input,
    span {
      float: left;
      font-style: normal;
    }
    input {
      margin: 0 6px;
      padding: 8px 0;
      width: 36px;
      height: 14px;
      border: 1px solid #dddddd;
      font-size: 14px;
      text-align: center;
      border-radius: 2px;
      box-sizing: content-box;
    }
    span {
      margin-left: 7px;
      height: 30px;
      line-height: 30px;
      padding: 0 16px;
      border: 1px solid #dddddd;
      background-color: #fafafa;
      cursor: pointer;
      border-radius: 2px;
      box-sizing: content-box;
      &:hover {
        color: #fff;
        border-color: #f39800;
        background-color: #f39800;
      }
    }
  }
}
.seller-pagination-main {
  display: inline-block;
  height: 100%;
  ul {
    float: left;
    height: 100%;
  }
  li {
    line-height: 30px;
    float: left;
    height: 100%;
    margin-right: 3px;
    margin-left: 3px;
    color: #666666;
    &:last-child {
      margin-right: 0;
    }
    &:first-child {
      margin-left: 0;
    }
    a {
      font-size: 14px;
      display: inline-block;
      height: 30px;
      padding: 0 14px;
      color: #666666;
      border: 1px solid #e5e5e5;
      background-color: #fafafa;
      border-radius: 2px;
      cursor: pointer;
      box-sizing: content-box;
      &:hover {
        color: #ffffff;
        border-color: #f39800;
        background-color: #f39800;
      }
    }
    .more {
      padding: 0 6px;
      border: none;
    }
  }
  .cur {
    a {
      color: #ffffff;
      border-color: #f39800;
      background-color: #f39800;
      cursor: text;
    }
  }
}
</style>
