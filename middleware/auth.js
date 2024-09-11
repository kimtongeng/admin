import Cookies from 'js-cookie'
export default ({ app, redirect, route, store }) => {
  if (store.state.auth.token) {
    if (route.name && route.name.includes('login')) {
      // let redirect = Cookies.get('redirect')
      // redirect(app.localePath(redirect))
      let redirectPath = Cookies.get('redirect')
      if (redirectPath) {
        redirect(app.localePath(redirectPath))
      }
    }
  }
}
