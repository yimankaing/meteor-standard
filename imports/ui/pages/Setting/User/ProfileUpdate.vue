<template>
    <el-dialog v-draggable
               title="ព័ត៌មានអ្នកប្រើប្រាស់"
               :visible.sync="dialogVisible"
               width="50%"
               :before-close="handleClose"
    >
        <el-form :model="formData" :rules="rules" ref="profileUpdate" label-width="120px" status-icon
                 v-loading="loading">
            <el-row style="padding-bottom: 25px">
                <el-col :span="5" style="text-align: center;">
                    <el-upload
                            class="image-uploader"
                            action="#"
                            :show-file-list="false"
                            :on-success="handleImageSuccess"
                            :before-upload="beforeImageUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus image-uploader-icon"></i>
                    </el-upload>
                </el-col>
                <el-col :span="19">
                    <el-row>
                        <el-form-item label="ឈ្មោះប្រើប្រាស់" prop="username">
                            <el-input v-model="formData.username" :disabled="formData.username==='super'"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="ឈ្មោះបង្ហាញ" prop="profile.fullName">
                            <el-input v-model="formData.profile.fullName"></el-input>
                        </el-form-item>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
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
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('profileUpdate')" icon="fa fa-save"
                       :loading="loading">រក្សាទុក {{progress}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
  import Msg from '../../../../libs/message';
  import storagePath from '../../../../firebase/storage_path';
  import firebase from '../../../../firebase/config';
  import numeral from 'numeral';

  export default {
    name: "ProfileUpdate",
    props: ['dialogVisible', 'currentRow'],
    data() {
      return {
        currentUser: this.$store.state.auth.user,
        currentModule: this.$store.state.module.currentModule,
        loading: false,
        progress: '',
        imageUrl: this.$store.state.auth.user.profile.photoUrl || '/images/avatar.png',
        file: '',
        formData: {
          username: '',
          password: '',
          emails: [{address: ''}],
          profile: {
            fullName: '',
            photoUrl: ''
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
          'profile.photoUrl': [{required: false, message: 'ភ្ជាប់រូបថត', trigger: 'blur'}],
        },
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            setTimeout(() => this.updateProfile(), 500);
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleImageSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.file = file.raw;
      },
      beforeImageUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          Msg.error('រូបថតត្រូវមានទំហំ តិចជាង២MB!');
        }
        return isLt2M;
      },
      updateProfile() {
        Meteor.call('app_updateUser', {
          userId: this.currentUser._id,
          module: this.currentModule,
          selector: {_id: this.currentRow._id},
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
        const {profile} = updateDoc;
        if (!!file) {
          if (!!profile.photoUrl) {
            let storageRef = storagePath.user(firebase.storage);
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
        let storageRef = storagePath.user(firebase.storage);
        const vm = this;
        const {file} = this;
        if (!!file) {
          const fileId = updateDocId;
          const fileName = file.name;
          let metadata = {
            customMetadata: {
              '_id': updateDocId,
              'username': this.currentUser.username,
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
        let {profile} = Meteor.user();
        profile.photoUrl = downloadUrl;

        Meteor.call('app_updateUser', {
          userId: this.currentUser._id,
          module: this.currentModule,
          selector: {_id: updateId},
          updateDoc: {profile}
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
        if (this.currentRow._id === this.currentUser._id) {
          this.$store.commit("updateUser", Meteor.user());
        }
        Msg.success();
        this.handleClose();
      },
      handleClose() {
        this.imageUrl = !!Meteor.user().profile.photoUrl ? Meteor.user().profile.photoUrl : '/images/avatar.png';
        this.file = '';
        this.$emit('close');
        this.$emit('reset');
        this.resetForm('profileUpdate');
      },
    },
    watch: {
      currentRow(nextVal) {
        this.formData._id = !!nextVal._id ? nextVal._id : '';
        this.formData.username = !!nextVal.username ? nextVal.username : '';
        this.formData.password = !!nextVal.password ? nextVal.password : '';
        //photoUrl
        this.formData.profile.fullName = !!nextVal.profile ? nextVal.profile.fullName : '';
        this.formData.profile.photoUrl = !!nextVal.profile ? nextVal.profile.photoUrl : '';
        this.formData.profile.approved = !!nextVal.profile ? nextVal.profile.approved : false;
        this.formData.profile.modules = !!nextVal.profile ? nextVal.profile.modules : [];
        this.formData.emails[0].address = !!nextVal.emails ? nextVal.emails[0].address : '';
      },
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

    .avatar {
        width: 115px;
        height: 115px;
        display: block;
    }

</style>