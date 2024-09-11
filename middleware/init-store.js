import Cookies from 'js-cookie'

let alreadyDone = false
export default async ({ context, store }) => {
	
	if (alreadyDone) {
		return null
	}
	alreadyDone = true
	const token = Cookies.get('IDG_SUPER_APP_AUTH')
	if (token) {
		store.dispatch('auth/saveToken', token)
		await store.dispatch('initStore')
	}
	const newLocale = store.state.lang.locale
	store.dispatch('lang/setLocale', {
		locale: newLocale
	})
	/* ... */
}
