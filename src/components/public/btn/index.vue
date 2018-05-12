<template>
  <div
    @click="click($event)"
    class="seller-btn"
    :class="btnClassName"
    :style="width ? 'width: ' + width + 'px;' : ''">
      <a :class="iconClassName" href="javascript:;">
        <slot>按 钮</slot>
      </a>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number
    },
    icon: {
      type: String
    },
    disabled: {
      // 是否禁用按钮
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconClassName() {
      return this.icon ? 'icon-' + this.icon : '';
    },
    btnClassName() {
      let aClass = [];
      if (this.active) aClass.push('active');
      if (this.small) aClass.push('seller-small-btn');
      if (this.disabled) aClass.push('seller-disabled-btn');
      if (this.disabled === false && this.loading)
        aClass.push('seller-loading-btn');
      return aClass.join(' ');
    }
  },
  methods: {
    click(event) {
      if (this.disabled === true) return;
      this.$emit('click', event);
    }
  }
};
</script>

<style lang="scss">
.seller-btn {
  height: 36px;
  overflow: hidden;
  & > a {
    display: block;
    height: 34px;
    padding: 0 12px;
    border: 1px solid $gray;
    box-sizing: content-box;
    line-height: 34px;
    background-color: #fafafa;
    border-radius: 2px;
    text-align: center;
  }
  &.active > a,
  & > a:hover {
    color: #ffffff;
    background-color: $orange;
    border-color: $orange;
  }
  &.active > a:hover {
    background-color: $lineOrange;
    border-color: $lineOrange;
  }
  .icon-search {
    padding: 0 12px 0 32px;
    background-repeat: no-repeat;
    background-position: 10px center;
    background-image: url(./images/icon_search.png);
    text-align: left;
  }
  &.active > .icon-search,
  .icon-search:hover {
    background-image: url(./images/icon_search2.png);
  }
}
.seller-btn.seller-small-btn {
  height: 32px;
  & > a {
    height: 30px;
    line-height: 30px;
  }
}
.seller-btn.seller-disabled-btn {
  & > a {
    cursor: not-allowed;
    color: #bbbbbb;
    background-color: #eeeeee;
    border: 1px solid $gray;
    &:hover {
      color: #bbbbbb;
      background-color: #eeeeee;
      border-color: $gray;
    }
  }
}
.seller-btn.seller-loading-btn {
  & > a {
    text-indent: -9999px;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(./images/loading1.gif);
    background-color: #fafafa;
    border-color: $gray;
    &:hover {
      border-color: $gray;
      background-color: #fafafa;
    }
  }
}
</style>
