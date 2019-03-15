<template>
    <div v-loading.fullscreen.lock="isLoading">
        <!--auth-->
        <div class="auth-background" v-show="!isLoading" v-if="!user">
            <div class="center-element animated fadeIn">
                <login/>
            </div>
        </div>
        <!--module-->
        <div class="auth-background" v-if="user && !checkRoles() && !isLoading">
            <div class="center-element" v-if="!module && !isLoading">
                <module @onModuleSelected="onModuleSelected" :user="user" class="animated fadeIn"></module>
            </div>
            <div class="center-element" v-else>
                <permission class="animated fadeIn"/>
            </div>
        </div>
        <!--app-->
        <div v-if="module && !isLoading &&user && checkRoles()">
            <el-container class="container">
                <!--sidebar-->
                <sidebar-menu :is-collapsed="isCollapsed"
                              @moduleSelector="moduleSelector"
                              :module-name="toKhModule(module)"/>
                <el-container>
                    <!--header-->
                    <el-header class="header header-menu-layout">
                        <span @click="toggleCollapse"
                              style="margin-right: 8px; cursor: pointer">
                            <i :class="isCollapsed ? 'fa fa-bars menu-icon menu-rotate1':'fa fa-bars menu-icon menu-rotate2'"
                               style="font-size: 20px; color: #303133; margin: 0; padding: 0;"></i>
                        </span>
                        <span class="page-title">{{ pageTitle }}</span>
                        <span class="menu-left"></span>
                        <span class="menu-right"><header-menu/></span>
                    </el-header>
                    <!--main-->
                    <el-main class="content main-content">
                        <!-- Breadcrumb -->
                        <div class="breadcrumb">
                            <el-breadcrumb separator="/">
                                <el-breadcrumb-item
                                        v-for="(bc, index) in breadcrumbMixin"
                                        :key="index"
                                        :to="bc.route">
                                    <span v-if="bc.icon">
                                        <i :class="bc.icon"></i>
                                    </span> {{ bc.title }}
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>
                        <!-- Content -->
                        <div class="router-view">
                            <el-row>
                                <el-col :span="24">
                                    <router-view/>
                                </el-col>
                            </el-row>
                        </div>
                        <!-- Footer -->
                        <div class="footer">
                              <span>រក្សាសិទ្ធិ © ២០១៩
                                <a href="#">មន្ទីរសាធារណការ និងដឹកជញ្ជូនខេត្តបន្ទាយមានជ័យ</a>
                              </span>
                        </div>
                        <back-to-top :visibleoffset="300"/>
                    </el-main>
                </el-container>
            </el-container>
        </div>
    </div>
</template>

<script>
  import {Meteor} from 'meteor/meteor';
  import BackToTop from '../components/BackToTop';
  import firebase from "../../firebase/config";
  import {i18n} from "../../../client/configs/i18n";
  import Msg from "../../libs/message";
  import _ from "lodash";
  import SidebarMenu from "/imports/ui/layouts/SidebarMenu.vue";
  import HeaderMenu from "/imports/ui/layouts/Header.vue";
  import BreadcrumsMixin from "../mixins/breadcrumbs";
  import {toKhModule} from "../../libs/constants";
  import {CheckRoles} from "../../libs/checkRoles";
  import Login from "/imports/ui/auth/Login.vue";
  import Module from "../pages/Module";
  import Permission from "../pages/Permission";

  export default {
    components: {Permission, Module, SidebarMenu, HeaderMenu, Login, BackToTop},
    mounted() {
      setTimeout(() => {
        this.$store.commit("updateUser", Meteor.user());
      }, 800);
      // if (Meteor.isDevelopment) {
      //   let bucket = firebase.storage.bucket_.bucket || null;
      //   if (bucket === 'def-system-dev.appspot.com') {
      //     Msg.info("Development mode");
      //   }
      //   if (bucket === 'def-system.appspot.com') {
      //     Msg.error("Production mode");
      //   }
      // }
    },
    watch: {
      user(val) {
        if (!!val) {
          this.moduleSelector();
          let lang = !!this.user.profile.language ? this.user.profile.language : 'km';
          this.$store.dispatch("updateLanguage", lang);
          i18n.locale = lang;
        }
      }
    },
    computed: {
      user() {
        setTimeout(() => {
          this.isLoading = false;
        }, 800);
        return this.$store.state.auth.user;
      },
      module() {
        return this.$store.state.module.currentModule;
      },
      pageTitle() {
        let title = "No TiTle";
        title = this.$route.meta.pageTitle
          ? this.$route.meta.pageTitle
          : this.$route.name ? _.startCase(this.$route.name) : title;

        return title;
      },
      breadcrumbs() {
        let crumbs = [];
        _.forEach(this.$route.matched, ({meta, path, name}) => {
          const crumb = meta.breadcrumb;
          if (crumb) {
            // Use `name` for route
            if (name) {
              crumb.to = {name: name};
              // Check params
              if (crumb.params) {
                crumb.to.params = _.pickBy(this.$route.params, (val, key) => {
                  return _.includes(crumb.params, key);
                });
              }
              // Check query
              if (crumb.query) {
                crumb.to.query = _.pickBy(this.$route.query, (val, key) => {
                  return _.includes(crumb.query, key);
                });
              }
            } else {
              // Use `path` for route
              // Check path is empty
              path = path ? path : "/";
              crumb.to = path;
              // Check params
              if (crumb.params) {
                // Reduce crumb.to
                crumb.to = _.reduce(
                  crumb.params,
                  (result, val) => {
                    result = _.replace(
                      result ? result : path,
                      val,
                      this.$route.params[val]
                    );
                  },
                  ""
                );
              }
              // Check query
              if (crumb.query) {
                crumb.to.query = _.pickBy(this.$route.query, (val, key) => {
                  return _.includes(crumb.query, key);
                });
              }
            }

            crumbs.push(crumb);
          }
        });

        return crumbs;
      }
    },
    mixins: [BreadcrumsMixin],
    data() {
      return {
        isCollapsed: false,
        isLoading: true,
        loadingModule: true,
      };
    },
    methods: {
      handleHomeSelect(name) {
        this.$router.push({name});
      },
      moduleSelector() {
        this.$store.dispatch("updateModule", null);
      },
      onModuleSelected(val) {
        this.$router.replace('/');
        this.$store.dispatch("updateModule", val);
      },
      toKhModule(enModule) {
        return toKhModule(enModule);
      },
      checkRoles() {
        const {module} = this;
        return CheckRoles({roles: ["super", "admin", "read"], module});
      },
      toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        const $menu = $(".el-menu-vertical");
        const $logo = $(".logo-img");
        if (this.isCollapsed) {
          $menu.addClass("app-sidebar-collapsed");
          $menu.addClass("logo-img-collapsed");
        } else {
          $menu.removeClass("app-sidebar-collapsed");
          $menu.removeClass("logo-img-collapsed");
        }
      }
    },
  };

</script>
<style lang="scss">
    @import "../styles/main";
    @import "../styles/aside-menu";
    @import "../styles/header-menu";

    .menu-icon {
        -webkit-transition-duration: 0.3s;
        -moz-transition-duration: 0.3s;
        -o-transition-duration: 0.3s;
        transition-duration: 0.3s;
        -webkit-transition-property: -webkit-transform;
        -moz-transition-property: -moz-transform;
        -o-transition-property: -o-transform;
        transition-property: transform;
    }

    .menu-rotate1 {
        transform: rotate(90deg);
        -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
    }

    .menu-rotate2 {
        transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
    }
</style>
