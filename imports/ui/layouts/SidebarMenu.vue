<template>
    <el-aside class="app-sidebar aside" :width="isCollapsed? '93px': '245px'">
        <el-menu
                class="el-menu-vertical"
                :default-active="linkActiveClass"
                @select="handleMenuSelect"
                :collapse="isCollapsed">
            <!--Header-->
            <div class="logo animated fadeIn" v-if="$subReady.app_setup">
                <img src="/images/logo.png" class="sidebar-logo"
                     :style="isCollapsed ? 'height: 80px': ''">
                <p style="font-size: 18px; margin: 4px;" class="kh-bold">
                    {{isCollapsed ? aboutUs.app.shortKhInstitute : aboutUs.app.khInstitute}}
                    <br/>
                    {{isCollapsed ? aboutUs.app.shortKhProvince: aboutUs.app.khProvince}}
                </p>
                <p @click="$emit('moduleSelector')" class="hvr-grow kh-regular"
                   style="margin: 8px 0 8px 0; font-weight: bold; font-size: 17px; cursor: pointer">
                    {{moduleName}}</p>
            </div>
            <!--HOME-->
            <el-menu-item index='app_home' v-if="checkRole(['super', 'admin', 'read'])">
                <i class="fa fa-home"></i>
                <span slot="title">ទំព័រដើម</span>
            </el-menu-item>
            <!--VEHICLE REGISTER BOOK-->
            <div v-if="currentModule==='VehicleRegisterBook' && checkRole(['super', 'admin', 'read'])">
                <el-menu-item index="vehicle_register">
                    <i class="fas fa-file-import"></i>
                    <span slot="title">ចុះលេខយានយន្ត</span>
                </el-menu-item>
            </div>
            <!--report-->
            <el-submenu index="1" v-if="currentModule==='VehicleRegisterBook' && checkRole(['super', 'admin', 'report'])">
                <template slot="title">
                    <i class="fa fa-file-invoice"></i>
                    <span slot="title">របាយការណ៍</span>
                </template>
                <el-menu-item index="vehicle_registerReport">
                    <i class="fa fa-file-alt"></i>
                    <span slot="title">ចុះលេខយានយន្ត</span>
                </el-menu-item>
            </el-submenu>

        </el-menu>
    </el-aside>
</template>

<script>
  import {CheckRoles} from "../../libs/checkRoles";
  import {App_setup} from "../../collections/setup";

  export default {
    name: "SidebarMenu",
    props: ["isCollapsed", "moduleName"],
    data() {
      return {
        users: this.$store.state.auth.user,
        currentModule: this.$store.state.module.currentModule,
      }
    },
    computed: {
      linkActiveClass() {
        const route = this.$route;
        return route.meta.linkActiveClass ? route.meta.linkActiveClass : route.name;
      }
    },
    methods: {
      handleMenuSelect(name) {
        this.$router.push({name});
      },
      checkRole(roles) {
        return CheckRoles({roles, module: this.currentModule})
      }
    },
    meteor: {
      $subscribe: {
        'app_setup': []
      },
      aboutUs() {
        if (Meteor.userId()) {
          return App_setup.find({}).fetch()[0];
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

    .app-sidebar-collapsed {
        width: 93px;
    }

    .app-sidebar {
        width: 245px;
        overflow-y: scroll;
        -webkit-transition: width 0.4s ease-in-out;
        -moz-transition: width 0.4s ease-in-out;
        -o-transition: width 0.4s ease-in-out;
        transition: width 0.4s ease-in-out;
    }

    ::-webkit-scrollbar {
        width: 0;
        background: transparent;
    }

</style>