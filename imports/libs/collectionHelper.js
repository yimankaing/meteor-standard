
export const collectionHelper = (collectionHelper, id) => {
  let doc = collectionHelper.findOne();
  !!doc ? collectionHelper.update({_id: doc._id}, {$set: {id: id}}) : collectionHelper.insert({id: id});
};