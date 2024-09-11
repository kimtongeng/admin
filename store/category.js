export const state = () => ({
    categories: [],
})

// getters
export const getters = {
    getCategories: (state) => state.categories,
}

// mutations
export const mutations = {
    SET_CATEGORY(state, categories) {
        state.categories = categories
    },
}

// action
export const actions = {
    setCategory({ commit }, categories) {
        commit('SET_CATEGORY', categories)
    },
}
