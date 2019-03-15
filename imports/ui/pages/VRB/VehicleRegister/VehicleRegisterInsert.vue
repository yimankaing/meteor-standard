<template>
    <el-dialog v-draggable
               title="បន្ថែមលេខយានយន្ត"
               :visible.sync="dialogVisible"
               width="60%"
               :before-close="handleClose"
    >
        <el-form :model="formData" :rules="rules" ref="vehicleRegisterInsert" label-width="160px" status-icon
                 v-loading="loading">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="រាជធានី-ខេត្ត" prop="city">
                        <el-input v-model="formData.city"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="ប្រភេទ" prop="type">
                        <el-input v-model="formData.type"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="ផ្លាកលេខ" prop="plateNumber">
                        <el-input v-model="formData.plateNumber"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="ម៉ូដែល" prop="model">
                        <el-input v-model="formData.model"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="ពណ៌" prop="color">
                        <el-input v-model="formData.color"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="កម្លាំងម៉ាស៊ីន" prop="power">
                        <el-input v-model="formData.power"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="លេខម៉ាស៊ីន" prop="machineNumber">
                        <el-input v-model="formData.machineNumber"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="លេខតួ" prop="bodyNumber">
                        <el-input v-model="formData.bodyNumber"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="លេខសាក់ស៊ី" prop="shockCode">
                        <el-input v-model="formData.shockCode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="ឆ្នាំផលិត" prop="manufactureYear">
                        <el-input v-model="formData.manufactureYear"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="ចំនួនភ្លៅ" prop="thighNumber">
                        <el-input v-model="formData.thighNumber"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="ចំនួនស៊ីឡាំង" prop="cylinderNumber">
                        <el-input v-model="formData.cylinderNumber"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="ទំហំស៊ីឡាំង" prop="cylinderSize">
                        <el-input v-model="formData.cylinderSize"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="លេខសន្លឹកពន្ធ" prop="taxNumber">
                        <el-input v-model="formData.taxNumber"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="ឈ្មោះម្ចាស់កម្មសិទ្ធ" prop="ownerKhName">
                        <el-input v-model="formData.ownerKhName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="ឈ្មោះម្ចាស់កម្មសិទ្ធ (EN)" prop="ownerEnName">
                        <el-input v-model="formData.ownerEnName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="អាសយដ្ឋាន" prop="address">
                        <el-input v-model="formData.address"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="ថ្ងៃខែឆ្នាំចុះបញ្ជីដំបូង" prop="firstRegisterDate">
                        <el-date-picker
                                format="dd-MMM-yyyy"
                                v-model="formData.firstRegisterDate"
                                type="date"
                                placeholder="ជ្រើសរើស កាលបរិច្ឆេទ">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('vehicleRegisterInsert')" icon="fa fa-undo">កំណត់ឡើងវិញ</el-button>
            <el-button type="primary" @click="submitForm('vehicleRegisterInsert')" icon="fa fa-save"
                       :loading="loading">រក្សាទុក</el-button>
        </span>
    </el-dialog>
</template>

<script>
  import {Meteor} from 'meteor/meteor';
  import moment from 'moment';
  import numeral from 'numeral';
  import Msg from '../../../../libs/message';

  export default {
    name: "VehicleRegisterInsert",
    props:
      ['dialogVisible'],
    data() {
      return {
        currentUser: this.$store.state.auth.user,
        currentModule: this.$store.state.module.currentModule,
        loading: false,
        formData: {
          city: '',
          type: '',
          plateNumber: '',
          model: '',
          color: '',
          power: '',
          machineNumber: '',
          bodyNumber: '',
          shockCode: '',
          manufactureYear: '',
          thighNumber: '',
          cylinderNumber: '',
          cylinderSize: '',
          taxNumber: '',
          ownerKhName: '',
          ownerEnName: '',
          address: '',
          firstRegisterDate: '',
          user: this.$store.state.auth.user._id,
        },
        rules: {
          city: [{required: true, message: 'សូមបំពេញ រាជធានី-ខេត្ត', trigger: 'blur'}],
          type: [{required: true, message: 'សូមបំពេញ ប្រភេទ', trigger: 'blur'}],
          plateNumber: [{required: true, message: 'សូមបំពេញ ផ្លាកលេខ', trigger: 'blur'}],
          model: [{required: true, message: 'សូមបំពេញ ម៉ូដែល', trigger: 'blur'}],
          color: [{required: true, message: 'សូមបំពេញ ពណ៌', trigger: 'blur'}],
          power: [{required: true, message: 'សូមបំពេញ កម្លាំងម៉ាស៊ីន', trigger: 'blur'}],
          machineNumber: [{required: true, message: 'សូមបំពេញ លេខម៉ាស៊ីន', trigger: 'blur'}],
          bodyNumber: [{required: true, message: 'សូមបំពេញ លេខតួ', trigger: 'blur'}],
          shockCode: [{required: false, message: 'សូមបំពេញ លេខសាក់ស៊ី', trigger: 'blur'}],
          manufactureYear: [{required: true, message: 'សូមបំពេញ ឆ្នាំផលិត', trigger: 'blur'}],
          thighNumber: [{required: true, message: 'សូមបំពេញ ចំនួនភ្លៅ', trigger: 'blur'}],
          cylinderNumber: [{required: true, message: 'សូមបំពេញ ចំនួនស៊ីឡាំង', trigger: 'blur'}],
          cylinderSize: [{required: true, message: 'សូមបំពេញ ទំហំស៊ីឡាំង', trigger: 'blur'}],
          taxNumber: [{required: true, message: 'សូមបំពេញ លេខសន្លឹកពន្ធ', trigger: 'blur'}],
          ownerKhName: [{required: true, message: 'សូមបំពេញ ឈ្មោះម្ចាស់កម្មសិទ្ធ', trigger: 'blur'}],
          ownerEnName: [{required: true, message: 'សូមបំពេញ ឈ្មោះម្ចាស់កម្មសិទ្ធ (EN)', trigger: 'blur'}],
          address: [{required: true, message: 'សូមបំពេញ អាសយដ្ឋាន', trigger: 'blur'}],
          firstRegisterDate: [{required: true, message: 'សូមបំពេញ ថ្ងៃខែឆ្នាំចុះបញ្ជីដំបូង', trigger: 'blur'}],
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            setTimeout(() => this.insertVehicleRegister(), 500);
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      insertVehicleRegister() {
        Meteor.call('vehicle_insertRegister', {
          userId: this.currentUser._id,
          module: this.currentModule,
          doc: this.formData
        }, (err, res) => {
          if (!err) {
            Msg.success();
            this.resetForm('vehicleRegisterInsert');
          } else {
            Msg.error(err.message);
          }
          this.loading = false;
        });
      },
      handleClose() {
        this.$emit('close');
        this.resetForm('vehicleRegisterInsert');
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>