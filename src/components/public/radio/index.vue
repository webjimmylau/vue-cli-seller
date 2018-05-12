<template>
  <div @click="choose" class="seller-radio" :class="[selected ? 'seller-radio-select' : '']">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    data: [String, Number],
    value: {
      type: [String, Number],
      required: true
    },
    callBack: Function
  },
  computed: {
    selected() {
      return this.data === this.value;
    }
  },
  methods: {
    choose() {
      this.$emit('update:data', this.value);
      if (this.callBack) this.callBack(this.value);
    }
  }
};
</script>

<style lang="scss">
.seller-radio {
  height: 26px;
  padding-left: 23px;
  line-height: 26px;
  background-repeat: no-repeat;
  background-position: 0 5px;
  background-image: url(./images/radio-1.png);
  cursor: pointer;
  &.seller-radio-select {
    background-image: url(./images/radio-2.png);
  }
  &:hover {
    color: $orange;
  }
}
</style>
