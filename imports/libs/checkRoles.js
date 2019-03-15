export const CheckRoles = ({userId, roles, module}) => {
  let currentUser = Meteor.user();
  if (userId) {
    currentUser = Meteor.users.findOne({_id: userId}); //use to check on server only
    if (currentUser && !currentUser.profile.approved) {
      return false;
    }
  }
  if (currentUser && currentUser.username === 'super') {
    return Roles.userIsInRole(currentUser._id, roles, module);
  }
  if (currentUser) {
    return Roles.userIsInRole(currentUser._id, roles, module);
  }
};