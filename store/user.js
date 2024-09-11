export const state = () => ({
    currentUser: 0,
    loginError: null,
    processing: false,
    forgotMailSuccess: null,
    resetPasswordSuccess: null
})

// getters
export const getters = {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess: state => state.resetPasswordSuccess,
}

export const mutations = {
    setUser(state, payload) {
        state.currentUser = payload
        state.processing = false
        state.loginError = null
      },
      setLogout(state) {
        state.currentUser = null
        state.processing = false
        state.loginError = null
      },
      setProcessing(state, payload) {
        state.processing = payload
        state.loginError = null
      },
      setError(state, payload) {
        state.loginError = payload
        state.currentUser = null
        state.processing = false
      },
      setForgotMailSuccess(state) {
        state.loginError = null
        state.currentUser = null
        state.processing = false
        state.forgotMailSuccess = true
      },
      setResetPasswordSuccess(state) {
        state.loginError = null
        state.currentUser = null
        state.processing = false
        state.resetPasswordSuccess = true
      },
      clearError(state) {
        state.loginError = null
      }
}

// action
export const actions = {
	login({ commit }, payload) {
        
    },
    signOut({ commit }) {}
}