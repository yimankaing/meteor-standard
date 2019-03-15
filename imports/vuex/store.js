import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import auth from "./auth";
import appModule from "./module";
import language from "./language";

const store = new Vuex.Store({
  modules: {
    auth,
    module: appModule,
    language
  },
  state: {
    users: []
  },
  // mutations: {
  //   updateUsers(state, value) {
  //     console.log("users state mutated");
  //     state.users = value;
  //   },
  // },
});

export default store;
