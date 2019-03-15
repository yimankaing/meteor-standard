const appModule = {
  state: {
    currentModule: null
  },
  mutations: {
    updateModule(state, value) {
      state.currentModule = value;
    },
  },
  actions: {
    updateModule({commit, state}, value){
      state.currentModule = value;
    }
  }
};

export default appModule;
