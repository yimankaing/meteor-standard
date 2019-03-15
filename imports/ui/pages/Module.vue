<template>
    <div>
        <div style="display: flex;" v-if="!!user.profile.modules && user.profile.modules.length>0">
            <div style="cursor: pointer; margin: 10px;" v-for="(item, index) in user.profile.modules">
                <div v-on:click="onModuleSelected(item)">
                    <el-card :body-style="{ padding: '5px' }" class="animated fadeIn hvr-grow">
                        <div class="module"
                             :style="{'background-color': moduleColor[index]}"
                        >
                            <h1 class="module-title kh-muol-light">{{shortName(translateModuleName(item))}}</h1>
                        </div>
                        <div class="footer">
                            <h3 class="footer-text kh-muol-light">
                                <!--ប្រព័ន្ធគ្រប់គ្រង<br/>-->
                                {{translateModuleName(item)}}</h3>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>
        <div v-else>
            <permission/>
        </div>
    </div>

</template>

<script>
  import Permission from '../pages/Permission';
  export default {
    name: "Module",
    props: ["user"],
    components: {Permission},
    data() {
      return {
        moduleColor: ["#1d8bc7"]
      }
    },
    methods: {
      onModuleSelected(name) {
        this.$emit('onModuleSelected', name)
      },
      shortName(name) {
        return !!name ? name.split('')[0] : 'na';
      },
      translateModuleName(enName) {
        let khName = "";
        switch (enName) {
          case 'VehicleRegisterBook':
            khName = 'សៀវភៅចុះលេខយានយន្ត';
            break;
          default:
            khName = enName;
            break;
        }
        return khName;
      }
    }
  }
</script>

<style lang="scss" scoped>
    .outer {
        display: table;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }

    .middle {
        display: table-cell;
        vertical-align: middle;
    }

    .inner {
        margin-left: auto;
        margin-right: auto;
        width: 200px;
        /*whatever width you want*/
    }

    .module {
        /*background-color: #5daf34;*/
        border-radius: 4px;
        height: 170px;
    }

    .module-title {
        color: white;
        font-size: 100px;
        text-align: center;
    }

    .footer {
        width: 160px;
        padding-top: 14px;
        padding-bottom: 14px;
    }

    .footer-text {
        text-align: center;
    }
</style>