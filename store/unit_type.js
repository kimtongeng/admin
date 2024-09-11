export const state = () => ({
    unit_types: [],
})

// getters
export const getters = {
    getUnitTypes: (state) => state.unit_types,
    getUnitName: (state) => (val) => {
        if (val == null || val == '') return ''
        return state.unit_types.find(obj => obj.id == val).text
    }
}

// mutations
export const mutations = {
    SET_UNIT_TYPE(state, unit_types) {
        state.unit_types = unit_types
    },
}

// action
export const actions = {
    setUnitType({ commit }, unit_types) {
        commit('SET_UNIT_TYPE', unit_types)
    },
}
