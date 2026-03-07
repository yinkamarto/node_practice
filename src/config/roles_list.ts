export const RolesList = {
    Admin: 5200,
    Editor: 1951,
    User: 2400
}

export type RolesListType = typeof RolesList[keyof typeof RolesList];