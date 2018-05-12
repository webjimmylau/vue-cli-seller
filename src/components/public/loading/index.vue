<template>
  <div class="seller-loading" :class="isLoop ? 'loop-loading-icon' : ''"></div>
</template>

<script>
export default {
  props: ['loop'],
  computed: {
    isLoop() {
      return !!this.loop;
    }
  }
};
</script>

<style lang="scss">
.seller-loading {
  width: 100%;
  height: 130px;
  background-repeat: no-repeat;
  background-position: center bottom;
  background-image: url(./images/bg-loading.gif);
  &.loop-loading-icon {
    height: 60px;
    background-position: center center;
    background-image: url(./images/loading2.gif);
  }
}
</style>
