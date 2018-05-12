<template>
  <div class="seller-sidebar">
    <ul>
      <li v-for="(item, index) in menu" :key="index">
        <div v-if="item.external">
          <a
            class="text-overflow"
            :href="item.link">{{item.name}}</a>
        </div>
        <router-link
          v-else
          active-class="active"
          exact-active-class=""
          class="text-overflow"
          tag="div"
          :to="item.link">
            <a>{{item.name}}</a>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['menu']
};
</script>

<style lang="scss">
.seller-sidebar {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  width: 180px;
  height: 100%;
  background-repeat: repeat-y;
  background-image: url(./images/submenuBg.jpg);
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 1px 0 0 rgba(0, 0, 0, .1);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(194, 194, 194, 1);
  }
  &::-webkit-scrollbar-thumb:window-inactive {
    background-color: rgba(194, 194, 194, .7);
  }
  & > ul {
    margin-top: 20px;
    li {
      margin: 0 0 10px 20px;
    }
    a {
      display: block;
      box-sizing: border-box;
      height: 50px;
      padding: 0 10px 0 36px;
      line-height: 50px;
      overflow: hidden;
    }
    .active {
      position: relative;
      &::before {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        content: ' ';
        z-index: 2;
      }
      & > a {
        padding-left: 32px;
        border-top: 1px solid $gray;
        border-bottom: 1px solid $gray;
        border-left: 4px solid $orange;
        background-color: #ffffff;
      }
    }
  }
}
</style>
