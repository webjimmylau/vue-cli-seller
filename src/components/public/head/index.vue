<template>
  <div class="seller-head clearfix">
    <div class="logo float-l"></div>
    <ul v-if="menu.length > 0" class="nav float-l">
      <li
        class="float-l"
        v-for="(item, index) in menu"
        :key="index">
          <div v-if="item.external">
            <a :href="item.link">{{item.name}}</a>
          </div>
          <router-link
            v-else
            active-class="active"
            exact-active-class=""
            :exact="item.link === routeRoot ? true : false"
            tag="div"
            :to="item.link">
              <a>{{item.name}}</a>
          </router-link>
      </li>
    </ul>
    <div v-if="menu.length > 0" class="action">
      <div class="action-content float-l">
        <div class="name">
          <span class="text-overflow">{{name}}</span>
        </div>
        <div class="list hide">
          <ul>
            <li>
              <a href="/lots-web/agency/updateAgencyPassword/">修改密码</a>
            </li>
            <li>
              <a href="/lots-web/logout">退出登录</a>
            </li>
          </ul>
        </div>
      </div>
      <a class="float-l" href="/" target="_blank">有市首页</a>
    </div>
  </div>
</template>

<script>
import Route from '@/router/path';

export default {
  props: ['nav'],
  data() {
    return {
      routeRoot: Route.root,
      name: '--'
    };
  },
  computed: {
    menu() {
      let arr = [];
      if (this.nav && this.nav.length > 0) arr = this.nav;
      return arr;
    }
  },
  created() {
    this.$http.post(this.$api.myShop).then(data => {
      this.name = data.loginerDTO.customName;
    });
  }
};
</script>

<style lang="scss">
.seller-head {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: $orange;
  z-index: 999;
  .logo {
    width: 220px;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(./images/agencyLogo.png);
  }
  .nav {
    margin-left: 10px;
    height: 100%;
    overflow: hidden;
    li {
      line-height: 62px;
    }
    a {
      display: block;
      padding: 0 20px;
      color: #ffffff;
      font-size: 14px;
      background-repeat: no-repeat;
      background-position: center 100px;
      transition: background-position 0.3s;
      background-image: url(./images/menuClick.png);
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
    }
    .active > a,
    a:hover {
      background-position: center 50px;
    }
  }
  .action {
    position: absolute;
    right: 20px;
    top: 0;
    line-height: 60px;
    color: #ffffff;
    & > a {
      height: 100%;
      padding: 0 10px;
      color: #ffffff;
      &:hover {
        background-color: #ffffff;
        color: $orange;
      }
    }
  }
  .action-content {
    margin-right: 2px;
    position: relative;
    cursor: pointer;
    .name {
      position: relative;
      padding: 0 32px 0 46px;
      border-left: 1px solid $orange;
      border-right: 1px solid $orange;
      background-repeat: no-repeat;
      background-position: 6px center;
      background-image: url(./images/icon_user.png);
      &::before {
        position: absolute;
        right: 10px;
        top: 24px;
        width: 11px;
        height: 12px;
        content: ' ';
        overflow: hidden;
        background-repeat: no-repeat;
        background-position: 0;
        background-size: 100%;
        background-image: url(./images/portlet-collapse-icon-white.png);
      }
      & > span {
        width: 100%;
        height: 100%;
        display: block;
        max-width: 90px;
      }
    }
    .list {
      position: absolute;
      left: 0;
      top: 60px;
      width: 100%;
      background-color: #ffffff;
      border: 1px solid $lineGray;
      border-top: none;
      li {
        a {
          display: block;
          line-height: 38px;
          text-align: center;
          color: #666666;
          &:hover {
            background-color: #f5f5f5;
          }
        }
      }
    }
    &:hover {
      .name {
        color: #666666;
        background-color: #ffffff;
        border-left: 1px solid $lineGray;
        border-right: 1px solid $lineGray;
        &::before {
          background-image: url(./images/portlet-collapse-icon.png);
        }
      }
      .list {
        display: block;
      }
    }
  }
}
@media (max-width: 1024px) {
  .seller-head {
    .logo {
      width: 170px;
    }
    .nav {
      a {
        padding: 0 12px;
      }
    }
    .action {
      right: 0;
    }
  }
}
</style>
