<template>
  <transition
    appear
    appear-class="fade-app-enter-class"
    appear-to-class="fade-app-enter-to"
    appear-active-class="fade-app-active-class">
      <div id="app">
        <head-component :nav="nav"></head-component>
        <router-view/>
      </div>
  </transition>
</template>

<script>
import HeadComponent from '@/components/public/head';

export default {
  name: 'app',
  computed: {
    nav() {
      return this.$store.getters.navs;
    }
  },
  created() {
    this.$store.dispatch('fetchAuth');
  },
  components: { HeadComponent }
};
</script>

<style src="./assets/style/base.scss" lang="scss"></style>
<style lang="scss">
html,
body {
  height: 100%;
}
#app {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: $minWidth;
}
.fade-app-enter-class {
  opacity: 0;
}
.fade-app-active-class {
  transition: opacity 1s;
}
.fade-app-enter-to {
  opacity: 1;
}
</style>
