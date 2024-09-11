export const state = () => ({
    list: [],
    total_not_read: 0,
})

// getters
export const getters = {
    getList: (state) => state.list,
    getTotalNotRead: (state) => state.total_not_read,
}

// mutations
export const mutations = {
    SET_LIST(state, list) {
        state.list = list
    },
    SET_TOTAL_NOT_READ(state, total_not_read) {
        state.total_not_read = total_not_read
    },
}

// action
export const actions = {
    async fetchData({ commit }) {
        const { data } = await this.$axios.$post(
            'notifications/get_badge_data',
            { loading: false }
        )
        commit('SET_LIST', data.list)
        commit('SET_TOTAL_NOT_READ', data.total_not_read)
    },
    updateList({ commit }, list) {
        commit('SET_LIST', list)
    },
    updateTotalCount({ commit }, total_not_read) {
        commit('SET_TOTAL_NOT_READ', total_not_read)
    },
}
