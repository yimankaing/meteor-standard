import {requiredUserFn} from "./permission";
import Login from '../../imports/ui/auth/Login';
import NotFound from '../../imports/ui/pages/NotFound';
import Permission from '../../imports/ui/pages/Permission';
import Home from '../../imports/ui/pages/Home';
import Setting from '../../imports/ui/pages/Setting/Setting';

import {vehicleRegister, vehicleRegisterReport} from './vehicleRegister';

const routes = [
  {
    path: "/",
    name: "app_home",
    component: Home,
    meta: {
      pageTitle: "ទំព័រដើម",
      breadcrumb: {
        title: "ទំព័រដើម",
        icon: "fas fa-home"
      }
    },
    beforeEnter: requiredUserFn,
  },
  // Not Found
  {
    path: "*",
    name: "notFound",
    component: NotFound,
    meta: {
      pageTitle: " ",
      breadcrumb: {
        title: " ",
        ignore: true
      }
    },
    // beforeEnter: requiredUserFn,
  },
  {
    path: "/app_permission",
    name: "app_permission",
    component: Permission,
    meta: {
      pageTitle: " ",
      breadcrumb: {
        title: " ",
        ignore: true
      }
    },
  },
  // Login
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      layout: "login",
      notRequiresAuth: true,
      pageTitle: "Login"
    },
  },
  // Setting
  {
    path: "/app_setting",
    name: "app_setting",
    component: Setting,
    meta: {
      pageTitle: "ការកំណត់",
      breadcrumb: {
        title: "ការកំណត់",
        icon: "fas fa-cog"
        //   parent: "letter_home"
      }
    },
    beforeEnter: requiredUserFn,
  },

  ...vehicleRegister,
  ...vehicleRegisterReport,
];
export default routes;
