<template>
  <div
    class="seller-select"
    :style="width ? 'width:' + width + 'px;' : ''"
    @mouseleave="hideList(600)"
    @mouseenter="cleanTimer">
      <span
        @click.prevent.stop="showList"
        class="select-name text-overflow"
        :class="triangle">{{selectText}}</span>
      <div
        v-show="visible"
        class="select-list"
        :class="animated"
        :style="positionStyle">
          <ul>
            <li
              class="text-overflow"
              v-for="(item, index) in data"
              :key="index"
              @click="choose(index, item.val)">{{item.key}}</li>
          </ul>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    width: {
      type: Number
    },
    position: {
      type: String
    }
  },
  data() {
    return {
      selectIndex: -1,
      visible: false,
      timer: null
    };
  },
  created() {
    this.initSelectIndex();
  },
  watch: {
    data() {
      this.initSelectIndex();
    },
    value() {
      this.initSelectIndex();
    }
  },
  computed: {
    positionStyle() {
      if (this.position === 'top') {
        return 'bottom: 35px;';
      } else {
        return 'top: 35px;';
      }
    },
    triangle() {
      if (this.visible && this.position === 'top') {
        return 'top-triangle';
      }
      return 'bottom-triangle';
    },
    animated() {
      if (this.visible) return 'animated fadeIn';
      else return '';
    },
    selectText() {
      if (this.selectIndex < 0) return '';
      else return this.data[this.selectIndex].key;
    }
  },
  methods: {
    initSelectIndex() {
      let index = -1;
      let aData = this.data;
      let i = 0;
      let l = aData.length;
      for (i; i < l; i++) {
        if (aData[i].val === this.value) {
          index = i;
          break;
        }
      }
      this.selectIndex = index;
    },
    choose(index, value) {
      this.$emit('update:value', value);
      this.hideList(0);
    },
    showList() {
      if (this.data.length > 0) this.visible = true;
    },
    hideList(delay) {
      if (this.visible) {
        this.timer = setTimeout(() => {
          this.visible = false;
        }, delay);
      }
    },
    cleanTimer() {
      clearTimeout(this.timer);
    }
  }
};
</script>

<style lang="scss">
.seller-select {
  position: relative;
  width: 100px;
  height: 36px;
  .select-name {
    position: relative;
    display: block;
    height: 34px;
    line-height: 34px;
    padding: 0 26px 0 8px;
    background: #ffffff;
    border: 1px solid $gray;
    border-radius: 2px;
    cursor: pointer;
    box-sizing: content-box;
    overflow: hidden;
    &::before {
      position: absolute;
      right: 8px;
      top: 15px;
    }
    &.top-triangle {
      &::before {
        @include triangleTop(#aaaaaa);
      }
    }
    &.bottom-triangle {
      &::before {
        @include triangleBottom(#aaaaaa);
      }
    }
  }
  .select-list {
    position: absolute;
    left: 0;
    z-index: 100;
    width: 100%;
    max-height: 272px;
    background-color: #ffffff;
    border: 1px solid $gray;
    overflow-x: hidden;
    overflow-y: auto;
    animation-duration: .3s;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      box-shadow: inset 1px 0 0 rgba(0,0,0,.1);
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background: rgba(194, 194, 194,1);
    }
    &::-webkit-scrollbar-thumb:window-inactive {
      background-color: rgba(194, 194, 194, .7);
    }
    & li {
      padding: 0 8px;
      line-height: 34px;
      cursor: pointer;
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
