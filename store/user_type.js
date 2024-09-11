export const state = () => ({
    level: {
        IDG: 7,
        SUPER_ADMIN: 6,
        USER: 1,
    },
    type_id: {
        IDG: 1,
        SUPER_ADMIN: 2,
        USER: 3,
    },
    user_type: [
        { id: 1, type: 'IDG', level: '7' },
        { id: 2, type: 'Super Admin', level: '6' },
        { id: 3, type: 'User', level: '1' },
    ],
})

export const getters = {
    IDG: (state) => state.level.IDG,
    SUPER_ADMIN: (state) => state.level.SUPER_ADMIN,
    level: (state) => state.level,
    getUserType: (state) => state.user_type,
    USER_TYPE_ID: (state) => state.type_id,
}

export const mutations = {}

export const actions = {}
