export const state = () => ({
    content_category: [],
})

// getters
export const getters = {
    getContentCategories: (state) => state.content_category,
}

// mutations
export const mutations = {
    SET_CONTENT_CATEGORY(state, content_category) {
        state.content_category = content_category
    },
}

// action
export const actions = {
    setContentCategory({ commit }, content_category) {
        commit('SET_CONTENT_CATEGORY', content_category)
    },
}
