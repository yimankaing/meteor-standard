import {Meteor} from "meteor/meteor";
import {EJSON} from "meteor/ejson";
import {Roles} from "meteor/alanning:roles";
import {Accounts} from "meteor/accounts-base";
import './account';
import {App_setup} from "../imports/collections/setup";
import {Vehicle_Register} from "../imports/collections/VRB/vehicleRegister";

Meteor.startup(function () {
  //create index
  // Vehicle_Register._ensureIndex({plateNumber: 1}, {sparse: 1, unique: true});
  // Setup

  if (App_setup.find({}).count() === 0) {
    App_setup.insert({
      logoUrl: '/images/logo.png',
      khMinistry: 'ក្រសួងសាធារណការ និងដឹកជញ្ជូន',
      shortKhMinistry: 'កសកដជ',
      enMinistry: 'Ministry of Public Works and Transport',
      shortEnMinistry: 'MPWT',
      khInstitute: 'មន្ទីរសាធារណការ និងដឹកជញ្ជូនខេត្តបន្ទាយមានជ័យ',
      shortKhInstitute: 'សកដជ',
      enInstitute: 'Department of Public Works and Transport Banteay Mean Chey Province',
      shortEnInstitute: 'DPWT',
      khAddress: 'ខេត្តបន្ទាយមានជ័យ',
      enAddress: 'Banteay Mean Chey Province',
      phoneNumber: '+៨៥៥-០០-០០០-០០០',
      email: 'dpwt@bmc.com',
      website: 'na',
      app: {
        khInstitute: 'មន្ទីរសាធារណការ និងដឹកជញ្ជូន',
        shortKhInstitute: 'សកដជ',
        enInstitute: 'Department of Public Works and Transport',
        shortEnInstitute: 'DPWT',
        khProvince: 'ខេត្តបន្ទាយមានជ័យ',
        shortKhProvince: 'បជ',
        enProvince: 'Banteay Mean Chey Province',
        shortEnProvince: 'BMC',
      }
    });
  }

  // User
  if (Meteor.users.find({}).count() === 0) {
    const data = EJSON.parse(Assets.getText("user-account.json"));
    data.forEach(({username, email, password, profile, roles}) => {
      const userExists = Accounts.findUserByUsername(username);
      if (!userExists) {
        const userId = Accounts.createUser({
          username,
          email,
          password,
          profile
        });

        Roles.addUsersToRoles(userId, roles, "VehicleRegisterBook");
      }
    });
  }
});
