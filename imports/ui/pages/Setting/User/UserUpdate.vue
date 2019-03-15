<template>
    <el-dialog v-draggable
            title="កែប្រែអ្នកប្រើប្រាស់"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
    >
        <el-form :model="formData" :rules="rules" ref="userUpdate" label-width="140px" status-icon v-loading="loading">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="ឈ្មោះប្រើប្រាស់" prop="username">
                        <el-input v-model="formData.username" :disabled="formData.username==='super'"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="ឈ្មោះបង្ហាញ" prop="profile.fullName">
                        <el-input v-model="formData.profile.fullName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="ប្តូរពាក្យសម្ងាត់" prop="password">
                        <el-input v-model="formData.password" type="password"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="អ៊ីម៉ែល" prop="emails[0].address">
                        <el-input v-model="formData.emails[0].address"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <br/>
            <el-row>
                <el-col :span="24">
                    <table class="table-style">
                        <thead class="table-head-container">
                        <tr class="table-row">
                            <th class="table-head asterisk" style="border-right: 1px solid #ebeef5; padding-top: 24px;"
                                rowspan="2">
                                កញ្ចប់
                                <el-form-item prop="profile.modules"></el-form-item>
                            </th>
                            <th class="table-head asterisk" colspan="13" style="padding-top: 24px;">សិទ្ធិ
                                <el-form-item prop="roles"></el-form-item>
                            </th>
                        </tr>
                        <tr class="table-row">
                            <th class="table-head" v-for="vehicle in rolesOptions.VehicleRegisterBook">{{vehicle.label}}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr class="table-row">
                            <td class="table-data"
                                style="border-right: 1px solid #ebeef5; text-align: left; padding-left: 20px">

                                <el-checkbox v-model="formData.profile.modules"
                                             :label="modules[0].value" :key="modules[0].value">{{modules[0].label}}
                                </el-checkbox>


                            </td>
                            <td class="table-data" v-for="vehicle in rolesOptions.VehicleRegisterBook">
                                <el-checkbox-group v-model="vehicleRegisterBookRoles">
                                    <el-checkbox :value="vehicle.value" :key="vehicle.value"
                                                 :label="vehicle.value"
                                    >
                                        &nbsp;
                                    </el-checkbox>
                                </el-checkbox-group>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <el-form-item label="អនុញ្ញាត" prop="profile.approved">
                        <el-checkbox v-model="formData.profile.approved"></el-checkbox>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('userUpdate')" icon="fa fa-undo">កំណត់ឡើងវិញ</el-button>
            <el-button type="primary" @click="submitForm('userUpdate')" icon="fa fa-save" :loading="loading">រក្សាទុក</el-button>
        </span>
    </el-dialog>
</template>

<script>
  import {Meteor} from 'meteor/meteor';
  import moment from 'moment';
  import numeral from 'numeral';
  import Constants from '../../../../libs/constants';
  import Msg from '../../../../libs/message';

  export default {
    name: "UserUpdate",
    props: ['dialogVisible', 'currentRow'],
    data() {
      return {
        currentUser: this.$store.state.auth.user,
        currentModule: this.$store.state.module.currentModule,
        loading: false,
        rolesOptions: Constants.rolesOptions,
        modules: Constants.modulesOptions,
        vehicleRegisterBookRoles: [],
        formData: {
          username: '',
          password: '',
          emails: [{address: ''}],
          roles: {
            VehicleRegisterBook: [],
          },
          profile: {
            fullName: '',
            approved: false,
            modules: []
          }
        },
        rules: {
          username: [{required: true, message: 'សូមបំពេញ ឈ្មោះប្រើប្រាស់', trigger: 'blur'}],
          password: [{required: false, message: 'សូមបំពេញ ពាក្យសម្ងាត់', trigger: 'blur'}],
          'emails[0].address': [{required: true, message: 'សូមបំពេញ អ៊ីម៉ែល', trigger: 'blur'}, {
            type: 'email',
            message: 'សូមបំពេញ អ៊ីម៉ែលឲ្យបានត្រឹមត្រូវ',
            trigger: ['blur', 'change']
          }],
          'profile.fullName': [{required: true, message: 'សូមបំពេញ ឈ្មោះ', trigger: 'blur'}],
          'profile.approved': [{required: true, message: 'សូមបញ្ជាក់ការអនុញ្ញាតិ', trigger: 'change'}],
          'profile.modules': [{required: true, message: 'សូមជ្រើសរើសកញ្ចប់', trigger: 'change'}],
          roles: [{required: true, message: 'សូមកំណត់សិទ្ធិ', trigger: 'change'}],
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            setTimeout(() => this.updateUser(), 500);
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.vehicleRegisterBookRoles = this.currentRow.roles["VehicleRegisterBook"];
      },
      updateUser() {
        let {vehicleRegisterBookRoles} = this;
        if (this.formData.username === 'super') {
          !vehicleRegisterBookRoles.includes('super') ? vehicleRegisterBookRoles.push('super') : null;
          this.formData.profile.approved = true;
        }

        Meteor.call('app_updateUser', {
          userId: this.currentUser._id,
          module: this.currentModule,
          selector: {_id: this.currentRow._id},
          updateDoc: this.formData
        }, (err, res) => {
          if (!err) {
            if (this.currentRow._id === this.currentUser._id) {
              this.$store.commit("updateUser", Meteor.user());
            }
            Msg.success();
            this.handleClose();
            this.$emit('findUser');
          } else {
            Msg.error(err.message);
          }
          this.loading = false;
        });
      },
      handleClose() {
        this.$emit('close');
        this.$emit('reset');
        this.resetForm('userUpdate');
        this.formData.roles = {
          VehicleRegisterBook: [],
        };
        this.vehicleRegisterBookRoles = [];
      },
    },
    watch: {
      currentRow(nextVal) {
        this.formData._id = !!nextVal._id ? nextVal._id : '';
        this.formData.username = !!nextVal.username ? nextVal.username : '';
        this.formData.password = !!nextVal.password ? nextVal.password : '';

        if (!!nextVal.roles) {
          this.vehicleRegisterBookRoles = !!nextVal.roles["VehicleRegisterBook"] ? nextVal.roles["VehicleRegisterBook"] : [];
        }

        this.formData.profile.fullName = !!nextVal.profile ? nextVal.profile.fullName : '';
        this.formData.profile.approved = !!nextVal.profile ? nextVal.profile.approved : false;
        this.formData.profile.modules = !!nextVal.profile ? nextVal.profile.modules : [];
        this.formData.emails[0].address = !!nextVal.emails ? nextVal.emails[0].address : '';
      },
      vehicleRegisterBookRoles(val) {
        this.formData.roles["VehicleRegisterBook"] = val;
      },
    }
  }
</script>

<style lang="scss" scoped>
    @import "table";
</style>