import SimpleSchema from 'simpl-schema';

export const App_setup = new Mongo.Collection('app_setup');

App_setup.schema = new SimpleSchema({
  logoUrl: {type: String, optional: true},
  khMinistry: {
    type: String,
  },
  shortKhMinistry: {
    type: String
  },
  enMinistry: {
    type: String,
  },
  shortEnMinistry: {
    type: String
  },
  khInstitute: {
    type: String
  },
  shortKhInstitute: {
    type: String,
  },
  enInstitute: {
    type: String
  },
  shortEnInstitute: {
    type: String,
  },
  khAddress: {
    type: String,
    optional: true
  },
  enAddress: {
    type: String,
    optional: true
  },
  phoneNumber: {
    type: String,
    optional: true
  },
  email: {
    type: String,
    optional: true
  },
  website: {
    type: String,
    optional: true
  },
  app: {
    type: Object,
    optional: true
  },
  'app.khInstitute': String,
  'app.shortKhInstitute': String,
  'app.enInstitute': String,
  'app.shortEnInstitute': String,
  'app.khProvince': String,
  'app.shortKhProvince': String,
  'app.enProvince': String,
  'app.shortEnProvince': String,
});

App_setup.attachSchema(App_setup.schema);