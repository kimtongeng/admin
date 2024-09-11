export const state = () => ({
    unseen_chat: 0,
})

// getters
export const getters = {
    getUnSeenChat: (state) => state.unseen_chat,
}

// mutations
export const mutations = {
    SET_UNSEEN_CHAT(state, unseen_chat) {
        state.unseen_chat = unseen_chat
    },
}

// action
export const actions = {
    setUnSeenChat({ commit }, unseen_chat) {
        commit('SET_UNSEEN_CHAT', unseen_chat)
    },
}
