import {Accounts} from "meteor/accounts-base";

Accounts.config({
  loginExpirationInDays: 1
});
Accounts.onCreateUser((options, user) => {
  user.profile = !!options.profile ? options.profile : {};
  // user.services = !user.services && !!options.services ? options.services : user.services; //social sign in
  /*super*/
  if (user.username === "super") {
    user.profile.modules = ["VehicleRegisterBook"];
    user.profile.approved = true;
    user.profile.owner = true;
    user.profile.language = 'km';
    // user.roles = ["super", "admin"];
    Roles.addUsersToRoles(user._id, ["super", "admin"], "VehicleRegisterBook");
  }
  /*admin*/
  else if (user.username === "admin") {
    user.profile.modules = ["VehicleRegisterBook"];
    user.profile.approved = true;
    user.profile.owner = false;
    user.profile.language = 'km';
    // user.roles = ["admin"];
    Roles.addUsersToRoles(user._id, ["admin"], "VehicleRegisterBook");
  }
  else {
    // user.profile.modules = [];
    // user.profile.approved = false;
    user.profile.owner = false;
    // user.roles = ["guest"];

    // Roles.addUsersToRoles(user._id, ["guest"]);
  }

  return user;
});
