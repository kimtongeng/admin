export const state = () => ({
    create: 1,
    update: 2,
    delete: 3,
    view: 4,
    IDG: 1,
    SUPER_ADMIN: 2,
    USER: 3,
})

export const getters = {
    getCreatePermission: (state) => state.create,
    getUpdatePermission: (state) => state.update,
    getDeletePermission: (state) => state.delete,
    getViewPermission: (state) => state.view,
    IDG: (state) => state.IDG,
    SUPER_ADMIN: (state) => state.SUPER_ADMIN,
}

export const mutations = {}

export const actions = {}
