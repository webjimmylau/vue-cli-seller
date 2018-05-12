<template>
  <div class="seller-position">
    <span class="float-l">您的位置：</span>
    <template v-for="(item, index) in position">
      <span class="float-l" :key="index + 'one'">{{item}}</span>
      <span v-if="index != position.length - 1" class="float-l arrow" :key="index + 'two'">></span>
    </template>
  </div>
</template>

<script>
export default {
  props: ['pos'],
  data() {
    return {
      position: [],
      time: 0
    };
  },
  computed: {
    isLoadAuth() {
      return this.$store.state.auth.load;
    }
  },
  methods: {
    getPosition() {
      if (this.pos) {
        this.position = this.pos;
        return;
      }

      if (this.isLoadAuth === false && this.time < 30) {
        // 防止无限循环运行 setTimeout
        setTimeout(() => {
          this.time += 1;
          this.getPosition();
        }, 200);
        return;
      } else {
        let arr = [];
        let app = this.$tool.getElementById('app');
        let sellerHead = this.$tool.getElementsByClassName(
          'seller-head',
          app
        )[0];
        let sellerSidebar = this.$tool.getElementsByClassName(
          'seller-sidebar',
          app
        )[0];
        let curNav = this.$tool.getElementsByClassName('active', sellerHead);
        let curMenu = this.$tool.getElementsByClassName(
          'active',
          sellerSidebar
        );
        if (curNav.length == 1 && curMenu.length == 1) {
          arr.push(
            this.$tool.trim(
              this.$tool.getElementsByTagName('a', curNav[0])[0].innerHTML
            )
          );
          arr.push(
            this.$tool.trim(
              this.$tool.getElementsByTagName('a', curMenu[0])[0].innerHTML
            )
          );
        }
        this.position = arr;
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.getPosition();
    });
  }
};
</script>

<style lang="scss">
.seller-position {
  width: 100%;
  height: 50px;
  line-height: 49px;
  border-bottom: 1px solid $lineGray;
  overflow: hidden;
  .arrow {
    padding: 0 8px;
    font-family: \5b8b\4f53;
    font-size: 13px;
  }
}
</style>
