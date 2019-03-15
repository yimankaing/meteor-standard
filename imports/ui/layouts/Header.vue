<template>
    <div style="line-height: 0" v-loading.fullscreen.lock="loading">
        <!--<div class="avatar-container header-icon" v-if="!!message">-->
            <!--<el-tag type="danger">{{message}}</el-tag>-->
        <!--</div>-->

        <el-dropdown
                v-if="!!currentUser"
                trigger="click"
                class="avatar-container right-menu-item"
                @command="handlePushRoute"
        >
            <div class="avatar-wrapper">
                <img class="user-avatar animated fadeIn" :src="imageUrl">
            </div>
            <el-dropdown-menu slot="dropdown" style="width: 285px">
                <el-dropdown-item class="dropdown-border dropdown-header" command="profile">
                    <div class="info clearfix">
                        <div class="image">
                            <a href="#">
                                <img :src="imageUrl" alt="user" class="animated fadeIn">
                            </a>
                        </div>
                        <div class="content">
                            <div class="name">{{!!currentUser.profile? currentUser.profile.fullName: ''}}
                                <el-tag class="edit-user"
                                        style="float: right; margin-top: 3px;" size="mini"
                                        type="success"><i class="el-icon-edit"></i></el-tag>
                            </div>
                            <span class="email">{{
                               !!currentUser.emails && currentUser.emails.length>0? currentUser.emails[0].address :'undefined'}}</span>
                        </div>
                    </div>
                </el-dropdown-item>
                <el-dropdown-item command="language">
                    <!--<i class="fa fa-globe"></i>-->
                    <img :src="currentLanguage==='km' ? '/images/km.png': '/images/us.png'" style="height: 9px"/>
                    ភាសា{{currentLanguage==='km'? 'ខ្មែរ' : 'អង់គ្លេស' }}
                </el-dropdown-item>
                <el-dropdown-item command="setting" v-if="checkRoles(['super', 'admin'])">
                    <i class="fa fa-cog"></i> ការកំណត់
                </el-dropdown-item>
                <el-dropdown-item command="logout" class="logout">
                    <i class="fas fa-sign-out-alt"></i> ចាកចេញ
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>


        <profile-update :dialog-visible="profileUpdateVisible"
                        :current-row="currentRow"
                        @reset="currentRow={}"
                        @close="profileUpdateVisible=false"/>
    </div>
</template>

<script>
  import {Meteor} from "meteor/meteor";
  import Notify from '../../libs/notify';
  import ProfileUpdate from '../../ui/pages/Setting/User/ProfileUpdate';
  import moment from 'moment';
  import firebase from '../../firebase/config';
  import {CheckRoles} from '../../libs/checkRoles';
  import {toKhNumber, toKhDate} from "../../libs/toKh";
  import {i18n} from "../../../client/configs/i18n";

  export default {
    name: "HeaderMenu",
    components: {ProfileUpdate},
    data() {
      return {
        currentUser: this.$store.state.auth.user,
        currentModule: this.$store.state.module.currentModule,
        imageUrl: this.$store.state.auth.user.profile.photoUrl || '/images/avatar.png',
        loading: false,
        notification: 0,
        message: '',
        currentRow: {},
        profileUpdateVisible: false,
      }
    },
    methods: {
      checkRoles(roles, module) {
        const {currentModule} = this;
        return CheckRoles({roles: roles || ["super", "admin"], module: module || currentModule});
      },
      handlePushRoute(command) {
        if (command === "logout") {
          this.loading = true;
          setTimeout(() => this.$store.dispatch("logout"), 500);
        }
        else if (command === "setting") {
          this.$router.push("app_setting");
        }
        else if (command === "language") {
          const newLang = this.currentLanguage === 'en' ? 'km' : 'en';
          let profile = Object.assign({}, this.currentUser.profile);
          profile.language = newLang;
          Meteor.users.update({_id: this.currentUser._id}, {$set: {profile}}, {}, (err, res) => {
            if (!err) {
              this.$store.dispatch("updateLanguage", newLang);
              i18n.locale = newLang;
            } else {
              console.log(err.message);
            }
          });
        } else if (command === 'profile') {
          this.currentRow = Object.assign({}, this.currentUser);
          this.profileUpdateVisible = true;
        }
      },
      dateFormatter(date) {
        return !!date ? toKhDate(moment(date).format('DD/MM/YYYY')) : '';
      },
    },
    computed: {
      currentLanguage() {
        return this.$store.state.language.currentLanguage;
      }
    },
    created() {
      // if (Meteor.isDevelopment) {
      //   let bucket = firebase.storage.bucket_.bucket || null;
      //   if (bucket === 'def-system-dev.appspot.com') {
      //     this.message = "Development mode";
      //   }
      //   if (bucket === 'def-system.appspot.com') {
      //     this.message = "Production mode";
      //   }
      // }
    }
  };
</script>

<style lang="scss" scoped>
    /*@import "../styles/header-menu.scss";*/
    $primaryColor: #31a9e0;
    $secondaryColor: #4587e8;
    $accent1: #31b5ec;
    $accent2: #4591f2;

    .override-padding {
        padding: 0px 0px 0px 7px;
    }

    .avatar-container {
        height: 55px;
        .avatar-wrapper {
            cursor: pointer;
            margin-top: 7px;
            position: relative;
            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50px;
            }
            .el-icon-caret-bottom {
                position: absolute;
                right: -20px;
                top: 25px;
                font-size: 12px;
            }
        }
    }

    .avatar-wrapper {
        cursor: pointer;
        margin-top: 7px;
        position: relative;
        .user-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50px;
        }
        .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
        }
    }

    .el-dropdown-menu {
        width: 280px;
    }

    .header-icon {
        font-size: 20px !important;
        cursor: pointer;
        vertical-align: 12px !important;
        margin-right: 25px;
        display: inline-block;
    }

    .account-dropdown {
        min-width: 305px;
        position: absolute;
        top: 58px;
        right: 0;
        background: #fff;
        -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
        -moz-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
        box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
        -webkit-transform: scale(0);
        -moz-transform: scale(0);
        -ms-transform: scale(0);
        -o-transform: scale(0);
        transform: scale(0);
        -webkit-transition: all 0.4s ease;
        -o-transition: all 0.4s ease;
        -moz-transition: all 0.4s ease;
        transition: all 0.4s ease;
        -webkit-transform-origin: right top;
        -moz-transform-origin: right top;
        -ms-transform-origin: right top;
        -o-transform-origin: right top;
        transform-origin: right top;
        z-index: 3;
    }

    .el-dropdown-menu__item {
        line-height: 27px;
        color: #333;
        padding: 10px 25px;
        font-size: 13px;
    }

    .el-dropdown-menu__item:focus,
    .el-dropdown-menu__item:not(.is-disabled):hover {
        .info .content .name, .info .content .email {
            color: white;
        }
        .edit-user {
            color: white;
            border-color: white;
            background-color: rgba(103, 194, 58, 0.4);
        }
        .edit-user:after {
            content: 'កែប្រែ';
        }
        color: #fff;
        background: $primaryColor;
        background: -moz-linear-gradient(-45deg, $primaryColor 0%, $secondaryColor 100%);
        background: -webkit-linear-gradient(-45deg, $primaryColor 0%, $secondaryColor 100%);
        background: linear-gradient(135deg, $primaryColor 0%, $secondaryColor 100%);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=$qp-color-1, endColorstr=$qp-color-2, GradientType=1);
        -webkit-transition: opacity 0.2s ease-out;
        -moz-transition: opacity 0.2s ease-out;
        -o-transition: opacity 0.2s ease-out;
        transition: opacity 0.2s ease-out;
        -webkit-transition: width 0.3s ease-in-out;
        -moz-transition: width 0.3s ease-in-out;
        -o-transition: width 0.3s ease-in-out;
        transition: width 0.3s ease-in-out;
    }

    .dropdown-border {
        border-bottom: 1px solid #f2f2f2;
    }

    .info .image {
        float: left;
        overflow: hidden;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        img {
            height: 65px;
            width: 65px;
        }
    }

    .info .content {
        background-color: transparent;
        margin-left: 65px;
        padding: 5px 0;
        padding-left: 12px;
    }

    .info .content .name {
        color: #333;
        font-size: 16px;
        font-weight: 500;
        text-transform: capitalize;
    }

    .info .content .email {
        font-size: 13px;
        color: #999;
        line-height: -webkit-calc(20 / 13);
        line-height: -moz-calc(20 / 13);
        line-height: calc(20 / 13);
    }
</style>
