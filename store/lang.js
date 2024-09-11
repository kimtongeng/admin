import Cookies from 'js-cookie'

export const state = () => ({
	locales: ['en', 'kh'],
	locale: 'kh'
})

// getters
export const getters = {
	locales: state => state.locales,
	locale: state => state.locale
}

// mutations
export const mutations = {
	SET_LOCALE(state, locale) {
		state.locale = locale.locale
	}
}

// action
export const actions = {
	setLocale({ commit }, { locale }) {
		commit('SET_LOCALE', { locale })
		Cookies.set('e', locale, {
			domain: process.env.domain
		})
	}
}
