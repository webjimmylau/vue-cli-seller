<template>
  <span @click="click" class="seller-checkbox" :class="[bSelect ? 'seller-select-checkbox' : '']">
    <i></i>
    <slot></slot>
  </span>
</template>

<script>
export default {
  props: {
    select: {
      type: Boolean,
      required: true
    },
    choose: Function,
    sync: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    bSelect() {
      return !!this.select;
    },
    bSync() {
      return !!this.sync;
    }
  },
  methods: {
    updateData(res) {
      this.$emit('update:select', res);
    },
    click() {
      let res = null;
      if (this.bSync) {
        res = this.choose ? !!this.choose() : !this.bSelect;
        this.updateData(res);
      }
      this.$emit('click', res);
    }
  }
};
</script>

<style lang="scss">
.seller-checkbox {
  display: inline-block;
  height: 26px;
  line-height: 26px;
  vertical-align: middle;
  cursor: pointer;
  & > i {
    margin-top: 5px;
    margin-right: 6px;
    float: left;
    display: block;
    width: 16px;
    height: 16px;
    overflow: hidden;
    background-repeat: no-repeat;
    background-image: url(./images/Checkbox_default.png);
  }
  &.seller-select-checkbox {
    & > i {
      background-image: url(./images/Checkbox_Selected.png);
    }
  }
}
</style>
