module.exports = {
  setup(storage) {
    return storage.ref('setup');
  },
  user(storage) {
    return storage.ref('/user');
  },
  letterIn(storage) {
    return storage.ref('/letterIn');
  },
  letterOut(storage) {
    return storage.ref('/letterOut');
  },
  fileLibrary(storage) {
    return storage.ref('/fileLibrary');
  }
};