<template>
  <div class="seller-content-main-root">
    <position :pos="pos"></position>
    <module-navigation :menu="menu"></module-navigation>
    <slot></slot>
    <!-- <footer-component class="footer"></footer-component> -->
  </div>
</template>

<script>
import ModuleNavigation from '@/components/public/moduleNavigation';
import Position from '@/components/public/position';
import FooterComponent from '@/components/public/footer';

export default {
  props: ['menu', 'pos'],
  components: { ModuleNavigation, Position, FooterComponent }
};
</script>

<style lang="scss">
.seller-content-main-root {
  position: relative;
  min-height: 100%;
  // padding-bottom: 121px;
  padding-bottom: 20px;
  // .footer {
  //   position: absolute;
  //   left: 0;
  //   bottom: 0;
  //   z-index: 1;
  // }
}
</style>
