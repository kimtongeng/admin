export default async ({ dispatch, route, store, app, redirect }) => {

	
	const moduleKey = [].concat(
		...route.matched.map(r => {
			return r.components.default.options
				? r.components.default.options.moduleKey
				: r.components.default.moduleKey
		})
	)
	const viewKey = [].concat(
		...route.matched.map(r => {
			return r.components.default.options
				? r.components.default.options.viewKey
				: r.components.default.viewKey
		})
	)
	const module_key = moduleKey[0]
	const view_key = viewKey[0] == undefined || viewKey[0] == null || viewKey[0] == ''? 'view' : viewKey[0]
	// Set current module to state
	store.dispatch('module/setCurrentModule', module_key)
	const user = store.getters['auth/user']
	if (
		user.user_type_id == store.state.permission.IDG ||
		user.user_type_id == store.state.permission.SUPER_ADMIN
	) {
		return true
	} else {
		let userAuthorized = false
		store.state.auth.roleModules.forEach(obj => {
			if (obj.module_key == module_key) {
				let viewPermission = obj.permissions.find(ele => ele.permission_name == view_key)
				for (var key in viewPermission) {
					if (obj.hasOwnProperty(key)) userAuthorized = true
				}
			}
		})
		if (!userAuthorized) {
			redirect(app.localePath('403'))
		}
	}
}
