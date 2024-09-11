import Cookies from 'js-cookie'

export const state = () => ({
    user: null,
    token: null,
    roleModules: [],
    authLevel: null,
})

export const getters = {
    user: (state) => state.user,
    token: (state) => state.token,
    roleModules: (state) => state.roleModules,
    authLevel: (state) => state.authLevel,
}

export const mutations = {
    SAVE_TOKEN(state, token) {
        state.token = token
    },

    FETCH_USER_SUCCESS(state, user) {
        state.user = user
    },

    SET_ROLE_MODULE(state, roleModules) {
        state.roleModules = roleModules
    },
    SET_USER_AUTH_TOKEN(state, token) {
        state.user.token = token
    },
    SET_AUTH_LEVEL(state, authLevel) {
        state.authLevel = authLevel
    },

    FETCH_USER_FAIL(state, user) {
        state.token = null
        Cookies.remove('IDG_SUPER_APP_AUTH')
    },

    LOGOUT(state) {
        state.user = {}
        state.token = null
        state.roleModules = []
        state.authLevel = null
        Cookies.remove('IDG_SUPER_APP_AUTH')
    },
}

export const actions = {
    login({ commit }, { token, user, role_modules, auth_level }) {
        commit('SAVE_TOKEN', token)
        commit('FETCH_USER_SUCCESS', user)
        commit('SET_ROLE_MODULE', role_modules)
        commit('SET_AUTH_LEVEL', auth_level)
        Cookies.set('IDG_SUPER_APP_AUTH', token, { expires: 365 })
    },
    setUserAuthToken({ commit }, token) {
        commit('SET_USER_AUTH_TOKEN', token)
    },
    saveToken({ commit }, token) {
        commit('SAVE_TOKEN', token)
    },

    fetchUser({ commit }, { user, role_modules, auth_level }) {
        try {
            commit('FETCH_USER_SUCCESS', user)
            commit('SET_ROLE_MODULE', role_modules)
            commit('SET_AUTH_LEVEL', auth_level)
        } catch (e) {
            commit('FETCH_USER_FAIL')
        }
    },

    async logout({ commit }, device_id) {
        try {
            const input = {
                device_id: device_id,
            }

            await this.$axios.$post('logout', input)

            commit('LOGOUT')
        } catch (e) {
            commit('LOGOUT')
        }
    },

    clearLogout({ commit }) {
        commit('LOGOUT')
    },
}
