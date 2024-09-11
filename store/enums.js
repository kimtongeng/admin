export const state = () => ({
    enums: [],
})

// getters
export const getters = {
    getAllEnum: (state) => state.enums,
}

// mutations
export const mutations = {
    SET_enums(state, enums) {
        state.enums = enums
    },
}

// action
export const actions = {
    setAllEnum({ commit }, enums) {
        commit('SET_enums', enums)
    },
}
