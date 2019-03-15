<template>
    <div>
        <el-form :model="formData" :rules="rules" ref="AppSetup" label-width="145px" status-icon v-loading="loading">
            <el-row style="padding-bottom: 10px" :gutter="20">
                <el-col :span="2" style="text-align: center;">
                    <el-upload
                            class="image-uploader"
                            action="#"
                            :show-file-list="false"
                            :on-success="handleImageSuccess"
                            :before-upload="beforeImageUpload">
                        <img v-if="formData.logoUrl" :src="formData.logoUrl" class="image">
                        <i v-else class="el-icon-plus image-uploader-icon"></i>
                    </el-upload>
                </el-col>
                <el-col :span="22">
                    <el-row :gutter="20">
                        <el-col :span="11">
                            <el-form-item label="ឈ្មោះក្រសួង" prop="khMinistry">
                                <el-input v-model="formData.khMinistry"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="13">
                            <el-form-item label="ឈ្មោះខ្លីក្រសួង" prop="shortKhMinistry">
                                <el-input v-model="formData.shortKhMinistry"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="11">
                            <el-form-item label="ឈ្មោះក្រសួង (EN)" prop="enMinistry">
                                <el-input v-model="formData.enMinistry"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="13">
                            <el-form-item label="ឈ្មោះខ្លីក្រសួង (EN)" prop="shortEnMinistry">
                                <el-input v-model="formData.shortEnMinistry"></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="ឈ្មោះអង្គភាព" prop="khInstitute">
                        <el-input v-model="formData.khInstitute"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="ឈ្មោះអង្គភាព (EN)" prop="enInstitute">
                        <el-input v-model="formData.enInstitute"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="ឈ្មោះខ្លីអង្គភាព" prop="shortKhInstitute">
                        <el-input v-model="formData.shortKhInstitute"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="ឈ្មោះខ្លីអង្គភាព (EN)" prop="shortEnInstitute">
                        <el-input v-model="formData.shortEnInstitute"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="អាសយដ្ឋាន" prop="khAddress">
                        <el-input v-model="formData.khAddress"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="អាសយដ្ឋាន (EN)" prop="enAddress">
                        <el-input v-model="formData.enAddress"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="លេខទូរសព្ទ" prop="phoneNumber">
                        <el-input v-model="formData.phoneNumber"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="អ៊ីម៉ែល" prop="email">
                        <el-input v-model="formData.email"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="គេហទំព័រ" prop="website">
                        <el-input v-model="formData.website"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-button type="primary" @click="submitForm('AppSetup')" icon="fa fa-save"
                   :loading="loading">រក្សាទុក {{progress}}
        </el-button>
    </div>
</template>

<script>
    import Msg from '../../../../libs/message';
    import storagePath from '../../../../firebase/storage_path';
    import firebase from '../../../../firebase/config';
    import numeral from 'numeral';

  export default {
    name: "AppSetup",
    data() {
      return {
        currentUser: this.$store.state.auth.user,
        currentModule: this.$store.state.module.currentModule,
        currentData: '',
        progress: '',
        loading: false,
        file: '',
        formData: {
          logoUrl: '',
          khMinistry: '',
          shortKhMinistry: '',
          enMinistry: '',
          shortEnMinistry: '',
          khInstitute: '',
          shortKhInstitute: '',
          enInstitute: '',
          shortEnInstitute: '',
          khAddress: '',
          enAddress: '',
          phoneNumber: '',
          email: '',
          website: ''
        },
        rules: {
          khMinistry: [{required: true, message: 'សូមបំពេញ ឈ្មោះក្រសួង', trigger: 'blur'}],
          shortKhMinistry: [{required: true, message: 'សូមបំពេញ ឈ្មោះខ្លីក្រសួង', trigger: 'blur'}],
          enMinistry: [{required: true, message: 'សូមបំពេញ ឈ្មោះក្រសួង', trigger: 'blur'}],
          shortEnMinistry: [{required: true, message: 'សូមបំពេញ ឈ្មោះខ្លីក្រសួង', trigger: 'blur'}],
          khInstitute: [{required: true, message: 'សូមបំពេញ ឈ្មោះអង្គភាព', trigger: 'blur'}],
          shortKhInstitute: [{required: true, message: 'សូមបំពេញ ឈ្មោះខ្លីអង្គភាព', trigger: 'blur'}],
          enInstitute: [{required: true, message: 'សូមបំពេញ ឈ្មោះអង្គភាព', trigger: 'blur'}],
          shortEnInstitute: [{required: true, message: 'សូមបំពេញ ឈ្មោះខ្លីអង្គភាព', trigger: 'blur'}],
          khAddress: [{required: false, message: 'សូមបំពេញ អាសយដ្ឋាន', trigger: 'blur'}],
          enAddress: [{required: false, message: 'សូមបំពេញ អាសយដ្ឋានអង់គ្លេស', trigger: 'blur'}],
          phoneNumber: [{required: false, message: 'សូមបំពេញ លេខទូរស័ព្ធ', trigger: 'blur'}],
          email: [
            {required: false, message: 'សូមបំពេញ អ៊ីម៉ែល', trigger: 'blur'}, {
              type: 'email',
              message: 'សូមបំពេញ អ៊ីម៉ែលឲ្យបានត្រឹមត្រូវ',
              trigger: ['blur', 'change']
            }
          ],
          website: [{required: false, message: 'សូមបំពេញ គេហទំព័រ', trigger: 'blur'}],
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            setTimeout(() => this.updateSetup(), 500);
          } else {
            return false;
          }
        });
      },
      handleImageSuccess(res, file) {
        this.formData.logoUrl = URL.createObjectURL(file.raw);
        this.file = file.raw;
      },
      beforeImageUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          Msg.error('រូបថតត្រូវមានទំហំ តិចជាង២MB!');
        }
        return isLt2M;
      },
      updateSetup() {
        Meteor.call('app_updateSetup', {
          userId: this.currentUser._id,
          module: this.currentModule,
          selector: {_id: this.currentData._id},
          updateDoc: this.formData
        }, (err, res) => {
          if (!err) {
            /*removeFileFromFirebase*/
            //@updateDoc = fileUrl, updateDoc._id
            //@uploadFileToFirebase => uploadNewFileToFirebase
            this.removeFileFromFirebase({
              updateDoc: this.formData,
              uploadFileToFirebase: this.uploadFileToFirebase
            });
          } else {
            Msg.error(err.message);
            this.loading = false;
          }
        });
      },
      removeFileFromFirebase({updateDoc, uploadFileToFirebase}) {
        const vm = this;
        const {file} = this;
        if (!!file) {
          if (!!updateDoc.logoUrl) {
            let storageRef = storagePath.setup(firebase.storage);
            const fileId = updateDoc._id;
            let ref = storageRef.child(fileId);

            ref.delete().then(() => {
              /*uploadFileToFirebase [uploadFileToFirebase]*/
              //@updateDocId:
              //@onUploadSuccess
              uploadFileToFirebase({
                updateDocId: updateDoc._id,
                onUploadSuccess: (downloadUrl, fileName) => vm.updateDocWithFileUrl({
                  updateId: updateDoc._id,
                  downloadUrl,
                  fileName
                })
              });

            }).catch(function (error) {
              console.log('err_removeFileFromFirebase', error.message);
              //update file Url => successMessage
              Msg.error(`មិនអាចស្វែងរកទីតាំងឯកសារ`);
              uploadFileToFirebase({
                updateDocId: updateDoc._id,
                onUploadSuccess: (downloadUrl, fileName) => vm.updateDocWithFileUrl({
                  updateId: updateDoc._id,
                  downloadUrl,
                  fileName
                })
              })
            });
          } else {
            //checking new upload file
            uploadFileToFirebase({
              updateDocId: updateDoc._id,
              onUploadSuccess: (downloadUrl, fileName) => vm.updateDocWithFileUrl({
                updateId: updateDoc._id,
                downloadUrl,
                fileName
              })
            })
          }
        } else {
          this.successUpdate();
        }
      },
      uploadFileToFirebase({updateDocId, onUploadSuccess}) {
        let storageRef = storagePath.setup(firebase.storage);
        const vm = this;
        const {file} = this;
        if (!!file) {
          const fileId = updateDocId;
          const fileName = file.name;
          let metadata = {
            customMetadata: {
              '_id': updateDocId,
              'institute': this.formData.khInstitute,
            }
          };
          let ref = storageRef.child(fileId);
          let uploadTask = ref.put(file, metadata);

          uploadTask.on(
            "state_changed",
            function (snapshot) {
              var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
              switch (snapshot.state) {
                case firebase.storageState.PAUSED:
                  Msg.warning('upload is paused');
                  break;
                case firebase.storageState.RUNNING:
                  vm.progress = numeral(progress).format('0.00') + "%";
                  break;
              }
            },
            function (error) {
              Msg.error(error.message);
              this.loading = false;
            },
            function () {
              uploadTask.snapshot.ref.getDownloadURL().then(url => onUploadSuccess(url, fileName));
            }
          );
        } else {
          this.successUpdate();
        }
      },
      updateDocWithFileUrl({updateId, downloadUrl, fileName}) {
        Meteor.call('app_updateSetup', {
          userId: this.currentUser._id,
          module: this.currentModule,
          selector: {_id: updateId},
          updateDoc: {logoUrl: downloadUrl}
        }, (err, res) => {
          if (!err) {
            this.successUpdate();
          } else {
            Msg.error(err.message);
            this.loading = false;
          }
        });
      },
      successUpdate() {
        this.loading = false;
        this.progress = '';
        Msg.success();
        this.findSetup();
      },
      findSetup() {
        Meteor.call('app_findSetup', {userId: this.currentUser._id, module: this.currentModule}, (err, res) => {
          if (!err) {
            this.currentData = res[0];
          } else {
            Msg.error(err.message);
          }
        });
      }
    },
    created() {
      this.findSetup();
    },
    watch: {
      currentData(nextVal) {
        this.formData = nextVal;
      }
    }
  }
</script>

<style scoped>
    .image-uploader {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        height: 115px;
        width: 115px;
    }

    .image-uploader:hover {
        border-color: #409EFF;
    }

    .image-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 115px;
        height: 115px;
        line-height: 115px;
        text-align: center;
    }

    .image {
        width: 115px;
        height: 115px;
        display: block;
    }
</style>