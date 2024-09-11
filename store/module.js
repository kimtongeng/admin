export const state = () => ({
    current_module: null,
})

export const getters = {
    getCurrentModule: (state) => state.current_module,
}

export const mutations = {
    SET_CURRENT_MODULE(state, module) {
        state.current_module = module
    },
}

export const actions = {
    setCurrentModule({ commit }, module) {
        commit('SET_CURRENT_MODULE', module)
    },
}
