import Cookies from 'js-cookie'

export const actions = {
    async initStore({ commit, dispatch }) {
        const { data } = await this.$axios.$post('getUser')
        dispatch('auth/fetchUser', {
            user: data.user,
            role_modules: data.role_modules,
            auth_level: data.auth_level,
        })
        dispatch('enums/setAllEnum', data.enums)
        dispatch('currency/setCurrency', data.currencies)
        dispatch('category/setCategory', data.categories)
        dispatch('brand/setBrand', data.brands)
        dispatch('product_model/setModel', data.models)
    },
}
