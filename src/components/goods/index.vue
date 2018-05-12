<template>
  <s-layout :menu="menu">
    <router-view/>
  </s-layout>
</template>

<script>
export default {
  computed: {
    menu() {
      return this.$store.getters.goodsMenu;
    }
  }
};
</script>
