export const state = () => ({
    pageOptions: [10, 20, 50, 100],
})

export const getters = {
    getPageOptions: (state) => state.pageOptions,
}
