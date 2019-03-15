import {Meteor} from "meteor/meteor";
import ElementUI from "element-ui";
import Vue from "vue";
import VueRouter from "vue-router";
import VueMeteorTracker from 'vue-meteor-tracker'
import VueInsProgressBar from "vue-ins-progress-bar";
import "/imports/ui/styles/fa-all.css";
import "/imports/ui/styles/fonts.css";
import WebFont from "webfontloader";
import BackToTop from '../imports/ui/components/BackToTop';
import DlgDraggable from "../imports/packages/vueElementDialogDraggable"
import {i18n} from "./configs/i18n";
//register
Vue.use(VueRouter);
Vue.use(BackToTop);
Vue.use(ElementUI, {locale, size: "large"});
Vue.use(VueInsProgressBar, {position: "fixed", show: true, height: "3px"});
Vue.use(VueMeteorTracker);
Vue.use(DlgDraggable);
//theme
import "./theme/index.css";
// import locale from "element-ui/lib/locale/lang/en";
import {km as locale} from "./configs/el-km";
import store from "/imports/vuex/store";
import App from "/imports/ui/App.vue";
import routes from "./routes/index";
import {messages} from './configs/i18n/messages';
import '../imports/ui/styles/report.css';
// import * as moment from 'moment';
// import 'moment/locale/km';


WebFont.load({
  google: {
    families: [
      "Roboto:regular,bold",
      "Cairo:regular,bold",
      "Lato:regular,bold,italic"
    ]
  }
});

//create instance
const router = new VueRouter({mode: "history", routes});

Meteor.startup(() => {
  new Vue({router, i18n, store, ...App}).$mount("app");
});
