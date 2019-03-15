<template>
    <div>
        <el-tabs>
            <el-tab-pane>
                <span slot="label"><i class="fa fa-user"></i> អ្នកប្រើប្រាស់</span>
                <user/>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="fa fa-building"></i> អំពីយើង</span>
                <app-setup/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
  import User from './User/User';
  import AppSetup from './AppSetup/AppSetup';
  import Msg from '../../../libs/message';
  import XLSX from 'xlsx';
  import {CheckRoles} from "../../../libs/checkRoles";

  export default {
    name: "Setting",
    components: {
      User, AppSetup
    },
    data() {
      return {
        currentUser: this.$store.state.auth.user,
        currentModule: this.$store.state.module.currentModule,
      };
    },
    methods: {
      checkRole(roles) {
        return CheckRoles({roles, module: this.currentModule});
      }
    }
  }
</script>

<style scoped>

</style>
<!--ref-->
<!--https://codepen.io/Event_Horizon/pen/WodMjp?editors=0010#0-->