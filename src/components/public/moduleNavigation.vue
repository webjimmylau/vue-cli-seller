<template>
  <div v-if="menu" class="seller-module-navigation">
    <ul class="clearfix">
      <li
        class="float-l"
        v-for="(item, index) in menu"
        :key="index">
          <router-link
            active-class="active"
            exact-active-class=""
            :to="item.link">{{item.name}}</router-link>
      </li>
    </ul>
    <div class="line"></div>
  </div>
</template>

<script>
export default {
  props: ['menu']
};
</script>

<style lang="scss">
.seller-module-navigation {
  position: relative;
  margin-top: 20px;
  width: 100%;
  height: 40px;
  .line {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    overflow: hidden;
    background-color: $lineOrange;
  }
  & > ul {
    height: 100%;
  }
  & > ul > li {
    margin-left: 10px;
    height: 38px;
    overflow: hidden;
    &:first-child {
      margin-left: 0;
    }
    & > a {
      display: block;
      box-sizing: border-box;
      height: 100%;
      padding: 0 20px;
      line-height: 37px;
      border: 1px solid #dddddd;
      border-bottom: none;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      background-color: #fafafa;
      overflow: hidden;
    }
    & > a:hover,
    .active {
      color: #ffffff;
      border-color: $lineOrange;
      background-color: $lineOrange;
    }
    .active {
      position: relative;
      cursor: default;
      &::before {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        content: ' ';
        z-index: 2;
      }
    }
  }
}
</style>
