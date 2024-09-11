export const state = () => ({
    currencies: [],
})

// getters
export const getters = {
    getCurrencies: (state) => state.currencies,
    getDefaultCurrency: (state) => {
        return state.currencies[0]
    },
}

// mutations
export const mutations = {
    SET_CURRENCY(state, currencies) {
        state.currencies = currencies
    },
}

// action
export const actions = {
    setCurrency({ commit }, currencies) {
        commit('SET_CURRENCY', currencies)
    },
}
