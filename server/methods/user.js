import {Meteor} from 'meteor/meteor';
import {Accounts} from "meteor/accounts-base";
import _ from 'lodash';
import ValidateUser from '../../imports/libs/validate-user';
import {CheckRoles} from "../../imports/libs/checkRoles";

Meteor.methods({
  app_findUser({userId, selector = {}, module}) {
    ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to query user'});
    let roles = CheckRoles({userId, roles: ["super", "admin"], module});
    if (!roles) {
      throw new Meteor.Error('អ្នកពុំមានសិទ្ធិទេ! សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង');
    }
    return Meteor.users.find(selector).fetch();
  },
  app_insertUser({userId, doc = {}, module}) {
    ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to insert user'});
    let roles = CheckRoles({userId, roles: ["super", "admin"], module});
    if (!roles) {
      throw new Meteor.Error('អ្នកពុំមានសិទ្ធិទេ! សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង');
    }
    try {
      let id = Accounts.createUser({
        username: doc.username,
        email: doc.email,
        password: doc.password,
        profile: doc.profile,
        roles: doc.roles
      });

      for (let key in doc.roles) {
        if (doc.roles.hasOwnProperty(key)) {
          Roles.addUsersToRoles(id, doc.roles[key], key);
        }
      }
    } catch (e) {
      console.log(e);
      throw new Meteor.Error(e.message);
    }
  },
  app_updateUser({userId, selector = {}, updateDoc = {}, module}) {
    ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to update user'});
    let roles = CheckRoles({userId, roles: ["super", "admin", "create"], module});
    if (!roles) {
      throw new Meteor.Error('អ្នកពុំមានសិទ្ធិទេ! សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង');
    }
    let userUpdateDoc = Object.assign({}, updateDoc);
    delete userUpdateDoc.password;
    try {
      Meteor.users.update(
        selector,
        {$set: userUpdateDoc}
      );
      // Update password
      !!updateDoc.password ? Accounts.setPassword(selector._id, updateDoc.password) : null;
      // Add roles
      if (!!updateDoc.roles) {
        for (let key in updateDoc.roles) {
          if (updateDoc.roles.hasOwnProperty(key)) {
            Roles.addUsersToRoles(updateDoc._id, updateDoc.roles[key], key);
          }
        }
      }
    } catch (e) {
      console.log(e);
      throw new Meteor.Error(e.message);
    }
  },
  app_removeUser({userId, selector, module}) {
    ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to remove user'});
    let roles = CheckRoles({userId, roles: ["super", "admin"], module});
    if (!roles) {
      throw new Meteor.Error('អ្នកពុំមានសិទ្ធិទេ! សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង');
    }
    let currentUser = Meteor.users.findOne(selector);
    if (currentUser.username === 'super') {
      throw new Meteor.Error('អ្នកមិនអាចលុប គណនីនេះបានទេ');
    }
    try {
      return Meteor.users.remove(selector);
    } catch (e) {
      console.log(e);
      throw new Meteor.Error(e.message);
    }
  },
  app_userIsUsed({userId, selector = {}, options = {limit: 10, skip: 0}, module}) {
    ValidateUser.ifUserNotSignedIn({msg: 'Must be logged in to remove user'});
    let roles = CheckRoles({userId, roles: ["super", "admin", "delete"], module});
    if (!roles) {
      throw new Meteor.Error('អ្នកពុំមានសិទ្ធិទេ! សូមទំនាក់ទំនងអ្នកគ្រប់គ្រង');
    }
    // let letterOut = Letter_LetterOut.find(selector, options).fetch();
    // let letterIn = Letter_LetterIn.find(selector, options).fetch();
    // let fileLibrary = File_Library.find(selector, options).fetch();
    return false;
    // return letterOut.length > 0 || letterIn.length > 0 || fileLibrary.length > 0;
  },
});