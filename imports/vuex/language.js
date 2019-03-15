const language = {
  state: {
    currentLanguage: 'km'
  },
  mutations: {
    updateLanguage(state, value) {
      state.currentLanguage = value;
    },
  },
  actions: {
    updateLanguage({commit, state}, value){
      state.currentLanguage = value;
    }
  }
};

export default language;
