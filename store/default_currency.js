export const state = () => ({
    default_currency: [],
})

// getters
export const getters = {
    getCurrency: (state) => state.default_currency,
}

// mutations
export const mutations = {
    SET_CURRENCY(state, default_currency) {
        state.default_currency = default_currency
    },
}

// action
export const actions = {
    setCurrency({ commit }, default_currency) {
        commit('SET_CURRENCY', default_currency)
    },
}
