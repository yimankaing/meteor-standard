<template>
    <div>
        <div style="display: flex;">
            <div>
                <el-button type="primary" icon="el-icon-plus" @click="userInsertVisible=true">បន្ថែម</el-button>
            </div>
        </div>
        <br/>
        <!--table-->
        <el-col :span="24">
            <el-table
                    border
                    stripe
                    :header-cell-style="{color:'#000000', backgroundColor:'#eef1f6'}"
                    v-loading="isLoading"
                    element-loading-text="កំពុងដំណើរការ..."
                    :data="userData"
                    highlight-current-row>
                <el-table-column
                        type="index"
                        width="50"
                >
                </el-table-column>
                <el-table-column
                        label="កូដសម្គាល់"
                        v-if="currentUser.username==='super'"
                        property="_id"
                        min-width="100"
                >
                </el-table-column>
                <el-table-column
                        sortable
                        property="username"
                        label="ឈ្មោះប្រើប្រាស់"
                        min-width="150">
                </el-table-column>
                <el-table-column
                        sortable
                        property="profile.fullName"
                        label="ឈ្មោះបង្ហាញ"
                        min-width="130">
                </el-table-column>
                <el-table-column
                        sortable
                        property="roles"
                        label="សិទ្ធិ"
                        min-width="280">
                    <template slot-scope="scope">
                        <div v-for="(value, key) in scope.row.roles" style="margin-bottom: 10px;">
                            <span class="text-title">{{toKhModule(key)}}៖</span>
                            <el-tag v-for="o in value" :key="o" size="mini" style="margin-left: 3px;">{{toKhRole(o)}}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        sortable
                        property="profile.modules"
                        label="កញ្ចប់"
                        min-width="130">
                    <template slot-scope="scope">
                        <div v-for="(value, key) in scope.row.profile.modules">
                            <el-tag size="mini" type="warning">{{toKhModule(value)}}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        sortable
                        property="profile.approved"
                        label="អនុញ្ញាត"
                        min-width="130">
                    <template slot-scope="scope">
                        <el-tag size="mini" :type="!!scope.row.profile.approved? 'success': 'danger'">
                            <span :class="!!scope.row.profile.approved? 'el-icon-success': 'el-icon-error'"></span>
                            {{!!scope.row.profile.approved? 'អនុញ្ញាត' : 'មិនអនុញ្ញាត' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        sortable
                        property="emails[0].address"
                        label="អ៊ីម៉ែល"
                        min-width="200">
                </el-table-column>
                <el-table-column
                        min-width="140"
                        fixed="right"
                        label="សកម្មភាព"
                >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   v-if="scope.row.username!=='super' || currentUser.username==='super'"
                                   @click.native="handleUpdate(scope.row)"
                        ></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   v-if="scope.row.username!=='super'"
                                   @click.native="handleRemove(scope.$index, scope.row, userData)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <br>
        <!--user insert-->
        <user-insert :dialog-visible="userInsertVisible"
                     @findUser="findUser"
                     @close="userInsertVisible=false"/>
        <!--user update-->
        <user-update :dialog-visible="userUpdateVisible"
                     :current-row="currentRow"
                     @findUser="findUser"
                     @reset="currentRow={}"
                     @close="userUpdateVisible=false"/>
    </div>
</template>

<script>
  import MsgBox from '../../../../libs/messageBox';
  import Msg from '../../../../libs/message';
  import UserInsert from './UserInsert';
  import UserUpdate from './UserUpdate';
  import Constants, {toKhRole, toKhModule} from '../../../../libs/constants';
  import _ from 'lodash';
  import numeral from 'numeral';
  import moment from 'moment';

  export default {
    name: "User",
    components: {
      UserInsert,
      UserUpdate,
    },
    data() {
      return {
        currentUser: this.$store.state.auth.user,
        currentModule: this.$store.state.module.currentModule,
        isLoading: true,
        userData: [],
        userInsertVisible: false,
        userUpdateVisible: false,
        currentRow: {}
      }
    },
    methods: {
      toKhRole(enRole) {
        return toKhRole(enRole);
      },
      toKhModule(enModule) {
        return toKhModule(enModule);
      },
      arrayFormatter(arr) {
        let str = "";
        if (!!arr && arr.length !== 0) {
          arr.map((o, i) => {
            i !== arr.length - 1 ? str += o + ", " : str += o;
          });
        }
        return str;
      },
      findUser() {
        Meteor.call('app_findUser', {userId: this.currentUser._id, module: this.currentModule}, (err, result) => {
          if (!err) {
            this.userData = result;
          } else {
            Msg.error(err.message);
          }
          this.isLoading = false;
        });
      },
      handleUpdate(row) {
        this.currentRow = Object.assign({}, row);
        this.userUpdateVisible = true;
      },
      handleRemove(index, row, rows) {
        Meteor.call('app_userIsUsed', {
          userId: this.currentUser._id,
          module: this.currentModule,
          selector: {userId: row._id},
          options: {limit: 1, skip: 0}
        }, (err, res) => {
          if (!err) {
            if (res) {
              Msg.error('គណនីត្រូវបានប្រើប្រាស់');
            } else {
              MsgBox.confirm({
                title: 'បញ្ជាក់',
                message: `តើអ្នកចង់លុប ឈ្មោះអ្នកប្រើប្រាស់ ${row.username}?`,
                callback: () => {
                  this.removeUser(index, row, rows);
                }
              });
            }
          } else {
            Msg.error(err.message);
          }
        });
      },
      removeUser(index, row, rows) {
        Meteor.call('app_removeUser', {
          userId: this.currentUser._id,
          module: this.currentModule,
          selector: {_id: row._id}
        }, (err, result) => {
          if (!err) {
            rows.splice(index, 1);
            Msg.success(`លុប ${row.username} បានជោគជ័យ`)
          } else {
            Msg.error(err.message);
          }
        })
      }
    },
    created() {
      this.findUser();
    },
  };

</script>
<style lang="scss" scoped>
    .text-title {
        font-weight: bold;
        font-size: 13px;

    }

    .text {
        font-size: 12px;
    }

    .item {
        margin-bottom: 18px;
    }
</style>