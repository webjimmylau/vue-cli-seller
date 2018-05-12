<template>
  <div class="seller-content">
    <sidebar v-if="haveSidebar" :menu="menu"></sidebar>
    <div class="seller-content-main" :class="haveSidebar ? '' : 'seller-content-full-main'">
      <s-text v-if="error" class="m-t-20 error-text">没有相关权限</s-text>
      <slot v-if="isLoad && !error"></slot>
    </div>
  </div>
</template>

<script>
import Sidebar from './sidebar';

export default {
  props: ['menu'],
  computed: {
    error() {
      return this.$store.state.auth.error;
    },
    isLoad() {
      return this.$store.state.auth.load;
    },
    haveSidebar() {
      if (this.menu === false || this.error === true) return false;
      return true;
    }
  },
  components: { Sidebar }
};
</script>

<style lang="scss">
.seller-content {
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
  right: 0;
  background-color: #ffffff;
  overflow: hidden;
  .seller-content-main {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    padding: 0 20px 0 200px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .seller-content-full-main {
    padding: 0 20px;
  }
  .error-text {
    font-size: 26px;
    font-weight: bold;
  }
}
</style>
