export const state = () => ({
    models: [],
})

// getters
export const getters = {
    getModels: (state) => state.models,
}

// mutations
export const mutations = {
    SET_MODEL(state, models) {
        state.models = models
    },
}

// action
export const actions = {
    setModel({ commit }, models) {
        commit('SET_MODEL', models)
    },
}
