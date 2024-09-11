export const state = () => ({
    customer: [],
})

// getters
export const getters = {
    getCustomer: (state) => state.customer,
}

// mutations
export const mutations = {
    SET_CUSTOMER(state, customer) {
        state.customer = customer
    },
}

// action
export const actions = {
    setCustomer({ commit }, customer) {
        commit('SET_CUSTOMER', customer)
    },
}
