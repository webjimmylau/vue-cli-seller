<template>
  <div class="seller-text" :style="inlineStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    align: { type: String },
    size: { type: Number }
  },
  computed: {
    inlineStyle() {
      let cssText = 'text-align:';
      if (this.align) cssText += this.align + ';';
      else cssText += 'center;';
      if (this.size) cssText += 'font-size:' + this.size + 'px;';
      return cssText;
    }
  }
};
</script>

<style>
.seller-text {
  padding: 20px 0;
}
</style>
