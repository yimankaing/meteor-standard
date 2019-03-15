<template>
    <div v-loading.fullscreen.lock="!connected" :element-loading-text="loadingText">
        <vue-ins-progress-bar></vue-ins-progress-bar>
        <app-layout></app-layout>
    </div>
</template>

<script>
  import {Meteor} from "meteor/meteor";
  import Msg from '../libs/message';
  import {toKhNumber} from "../libs/toKh";
  import AppLayout from "/imports/ui/layouts/AppLayout.vue";

  export default {
    name: "app",
    components: {AppLayout},
    meteor: {
      status() {
        const status = Meteor.status();
        this.connected = status.connected;
        if (!status.connected) {
          let retry = Math.round((status.retryTime - (new Date()).getTime()) / 1000);
          switch (status.status) {
            case   'connecting':
              this.loadingText = 'ប្រព័ន្ធកំពុងតភ្ជាប់ សូមមេត្តារង់ចាំ';
              break;
            case   'connected':
              this.loadingText = 'ប្រព័ន្ធបានតភ្ជាប់';
              break;
            case   'disconnected':
              this.loadingText = `ប្រព័ន្ធត្រូវបានផ្តាច់`;
              break;
            case   'waiting':
              this.loadingText = `ប្រព័ន្ធត្រូវបានផ្តាច់ កំពុងព្យាយាមតភ្ជាប់ក្នុង ${toKhNumber(retry + "")}វិនាទី`;
              break;
            case   'retry':
              this.loadingText = 'ព្យាយាមម្តងទៀត';
              break;
            default :
              this.loadingText = '';
              break;
          }
        }
      },
      meteorUser() {
        if (!Meteor.userId()) {
          this.$store.commit("updateUser", Meteor.user());
        }
      }
    },
    data() {
      return {
        connected: false,
        loadingText: ''
      }
    },
    methods: {},
    created() {
      this.$insProgress.start();
      this.$router.beforeEach((to, from, next) => {
        this.$insProgress.start();
        next();
      });
      this.$router.afterEach((to, from) => {
        this.$insProgress.finish();
      });
    },
    mounted() {
      this.$insProgress.finish();
    }
  };
</script>

<style scoped>

</style>