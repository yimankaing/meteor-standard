<template>
    <div class="login-wrap">
        <div class="login-content">
            <div class="login-logo" v-if="$subReady.app_setup">
                <img src="images/logo.png" alt="mef" class="logo">
                <p class="kh-bold" style="font-size: 19px; margin: 4px 1px 4px 1px; color: #1c2a78">មន្ទីរសាធារណការ និងដឹកជញ្ជូន<br/>ខេត្តបន្ទាយមានជ័យ</p>
            </div>
            <div class="login-form">
                <el-form
                        v-loading="loading"
                        ref="form"
                        :model="form"
                        :rules="rules"
                >
                    <el-row :gutter="10">
                        <el-col :span="24">
                            <el-form-item
                                    label="ឈ្មោះអ្នកប្រើប្រាស់"
                                    prop="username"
                            >
                                <el-input
                                        size="large"
                                        :autofocus="true"
                                        v-model="form.username"
                                        @keyup.enter.native="submitForm"
                                ></el-input>
                            </el-form-item>

                            <el-form-item
                                    label="ពាក្យសម្ងាត់"
                                    prop="password"
                            >
                                <el-input
                                        type="password"
                                        size="large"
                                        v-model="form.password"
                                        @keyup.enter.native="submitForm"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-button
                                    size="large"
                                    :loading="loading"
                                    @click="submitForm"
                                    class="btn"
                            >ចូល <i class="fas fa-arrow-right"></i>
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
    </div>
</template>


<script>
  import Notify from "/imports/libs/notify";
  import {App_setup} from "../../collections/setup";

  export default {
    data() {
      return {
        loading: false,
        form: {
          username: "",
          password: ""
        },
        rules: {
          username: [{required: true, message: "សូមបំពេញ ឈ្មោះអ្នកប្រើប្រាស់"}],
          password: [{required: true, message: "សូមបំពេញ ពាក្យសម្ងាត់"}]
        }
      };
    },
    meteor: {
      $subscribe: {
        'app_setup': []
      },
      aboutUs() {
        if (!Meteor.userId()) {
          return App_setup.find({}).fetch()[0];
        }
      }
    },
    methods: {
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.loading = true;
            const dataForm = this.form;
            const username = dataForm.username,
              password = dataForm.password;
            // this.$store.dispatch("submitLoginForm", this.form);
            setTimeout(() => {
              Meteor.loginWithPassword(username, password, error => {
                if (error) {
                  this.loading = false;
                  const message = error.reason;
                  Notify.error({message});
                } else {
                  const message = "ជំរាបសួរ";
                  Notify.success({message});
                  this.$store.commit("updateUser", Meteor.user());
                }
              });
            }, 150);
          } else {
            return false;
          }
        });
      },
      resetForm() {
        this.$refs["form"].resetFields();
      }
    }
  };
</script>

<style lang="scss" scoped>
    $primaryColor: #31a9e0;
    $secondaryColor: #4587e8;
    $accent1: #31b5ec;
    $accent2: #4591f2;
    .vertical-offset-100 {
        padding-top: 100px;
    }

    .btn {
        width: 100% !important;
        margin-top: 10px !important;
        margin-bottom: 5px !important;
        border: none;
        background: $primaryColor;
        background: -moz-linear-gradient(-45deg, $primaryColor 0%, $secondaryColor 100%);
        background: -webkit-linear-gradient(-45deg, $primaryColor 0%, $secondaryColor 100%);
        background: linear-gradient(135deg, $primaryColor 0%, $secondaryColor 100%);
        text-transform: uppercase;
        color: #fff !important;
        cursor: pointer;
    }

    .btn:hover {
        color: #fff;
        background: $accent1;
        background: -moz-linear-gradient(-45deg, $accent1 0%, $accent2 100%);
        background: -webkit-linear-gradient(-45deg, $accent1 0%, $accent2 100%);
        background: linear-gradient(135deg, $accent1 0%, $accent2 100%);
    }

    .btn:active,
    :visited {
        color: #fff !important;
    }

    .logo {
        height: 55%;
        width: 55%;
    }

    .login-wrap {
        max-width: 320px;
        min-width: 320px;
    }

    .login-logo {
        text-align: center;
        margin-bottom: 30px;
    }

    .login-content {
        background: #fff;
        padding: 30px 30px 20px;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
        border-radius: 5px;
    }
</style>
