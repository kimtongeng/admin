export const state = () => ({
    cellType: {
        text: 1,
        status: 1,
        date: 2,
        amount: 3,
    },
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
