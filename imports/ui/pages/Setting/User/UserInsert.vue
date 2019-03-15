<template>
    <el-dialog v-draggable
            title="បន្ថែមអ្នកប្រើប្រាស់"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
    >
        <el-form :model="formData" :rules="rules" ref="userInsert" label-width="140px" status-icon v-loading="loading">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="ឈ្មោះប្រើប្រាស់" prop="username">
                        <el-input v-model="formData.username"></el-input>
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
                    <el-form-item label="ពាក្យសម្ងាត់" prop="password">
                        <el-input v-model="formData.password" type="password"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="អ៊ីម៉ែល" prop="email">
                        <el-input v-model="formData.email"></el-input>
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
            <el-button @click="resetForm('userInsert')" icon="fa fa-undo">កំណត់ឡើងវិញ</el-button>
            <el-button type="primary" @click="submitForm('userInsert')" icon="fa fa-save" :loading="loading">រក្សាទុក</el-button>
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
    name: "UserInsert",
    props: ['dialogVisible'],
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
          email: '',
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
          password: [{required: true, message: 'សូមបំពេញ ពាក្យសម្ងាត់', trigger: 'blur'}],
          email: [{required: true, message: 'សូមបំពេញ អ៊ីម៉ែល', trigger: 'blur'}, {
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
    watch: {
      vehicleRegisterBookRoles(val) {
        this.formData.roles["VehicleRegisterBook"] = val;
      },
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            setTimeout(() => this.insertUser(), 500);
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.formData.roles = {
          VehicleRegisterBook: [],
        };
        this.vehicleRegisterBookRoles = [];
      },
      insertUser() {
        Meteor.call('app_insertUser', {
          userId: this.currentUser._id,
          module: this.currentModule,
          doc: this.formData
        }, (err, res) => {
          if (!err) {
            Msg.success();
            this.resetForm('userInsert');
            this.$emit('findUser');
          } else {
            Msg.error(err.message);
          }
          this.loading = false;
        });
      },
      handleClose() {
        this.$emit('close');
        this.resetForm('userInsert');
      },
    }
  }
</script>

<style lang="scss" scoped>
    @import "table";
</style>