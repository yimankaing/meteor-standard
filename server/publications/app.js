import {App_setupHelper} from "../../imports/collections/setup";
import {App_setup} from "../../imports/collections/setup";


Meteor.publish('app_setup', function () {
  return App_setup.find({});
});
