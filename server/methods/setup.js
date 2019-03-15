import {Meteor} from 'meteor/meteor';
import ValidateUser from '../../imports/libs/validate-user';

import {App_setup} from "../../imports/collections/setup";
import {CheckRoles} from "../../imports/libs/checkRoles";

Meteor.methods({
  app_findSetup({userId, selector = {}, module}) {
    ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to query institute'});
    let roles = CheckRoles({userId, roles: ["super", "admin"], module});
    if (!roles) {
      throw new Meteor.Error('អ្នកពុំមានសិទ្ធិទេ! សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង');
    }
    return App_setup.find(selector).fetch();
  },
  app_updateSetup({userId, selector = {}, updateDoc = {}, module}) {
    ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to update institute'});
    let roles = CheckRoles({userId, roles: ["super", "admin"], module});
    if (!roles) {
      throw new Meteor.Error('អ្នកពុំមានសិទ្ធិទេ! សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង');
    }
    return App_setup.update(selector, {$set: updateDoc});
  },
});