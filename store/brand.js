export const state = () => ({
    brands: [],
})

// getters
export const getters = {
    getBrands: (state) => state.brands,
}

// mutations
export const mutations = {
    SET_BRAND(state, brands) {
        state.brands = brands
    },
}

// action
export const actions = {
    setBrand({ commit }, brands) {
        commit('SET_BRAND', brands)
    },
}
