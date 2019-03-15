import store from "../../imports/vuex/store";
import {CheckRoles} from '../../imports/libs/checkRoles';

export const requiredUserFn = (to, from, next) => {
  // if (store.state.auth.user) {
  //   if (!CheckRoles({roles: ['admin', 'super', 'read'], module: store.state.module.currentModule})) {
  //     return next("/app_permission");
  //   }
  return next();
  // }
  // return next("/");
};
