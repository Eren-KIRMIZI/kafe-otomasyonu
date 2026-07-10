import { UserRole } from '@/types'

export interface Permission {
  resource: string
  actions: ('create' | 'read' | 'update' | 'delete')[]
}

const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    { resource: 'dashboard', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'orders', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'tables', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'categories', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'customers', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'payments', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'inventory', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reservations', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'discounts', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'kitchen', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'barista', actions: ['create', 'read', 'update', 'delete'] },
  ],
  [UserRole.CASHIER]: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'orders', actions: ['create', 'read', 'update'] },
    { resource: 'customers', actions: ['create', 'read', 'update'] },
    { resource: 'payments', actions: ['create', 'read'] },
    { resource: 'reports', actions: ['read'] },
    { resource: 'discounts', actions: ['read'] },
  ],
  [UserRole.WAITER]: [
    { resource: 'tables', actions: ['read', 'update'] },
    { resource: 'orders', actions: ['create', 'read', 'update'] },
    { resource: 'kitchen', actions: ['read'] },
  ],
  [UserRole.KITCHEN]: [
    { resource: 'kitchen', actions: ['read', 'update'] },
    { resource: 'products', actions: ['read'] },
  ],
  [UserRole.BARISTA]: [
    { resource: 'barista', actions: ['read', 'update'] },
    { resource: 'products', actions: ['read'] },
  ],
}

export function hasPermission(
  role: UserRole,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete'
): boolean {
  const permissions = rolePermissions[role]
  if (!permissions) return false

  const resourcePermission = permissions.find((p) => p.resource === resource)
  if (!resourcePermission) return false

  return resourcePermission.actions.includes(action)
}

export function hasAnyPermission(
  role: UserRole,
  resource: string
): boolean {
  const permissions = rolePermissions[role]
  if (!permissions) return false

  return permissions.some((p) => p.resource === resource)
}

export function getRolePermissions(role: UserRole): Permission[] {
  return rolePermissions[role] || []
}

export const routeAccess: Record<string, UserRole[]> = {
  '/': [UserRole.ADMIN, UserRole.CASHIER],
  '/dashboard': [UserRole.ADMIN, UserRole.CASHIER],
  '/cashier': [UserRole.ADMIN, UserRole.CASHIER],
  '/tables': [UserRole.ADMIN, UserRole.WAITER],
  '/orders': [UserRole.ADMIN, UserRole.CASHIER, UserRole.WAITER],
  '/kitchen': [UserRole.ADMIN, UserRole.KITCHEN],
  '/barista': [UserRole.ADMIN, UserRole.BARISTA],
  '/products': [UserRole.ADMIN],
  '/categories': [UserRole.ADMIN],
  '/customers': [UserRole.ADMIN, UserRole.CASHIER],
  '/inventory': [UserRole.ADMIN],
  '/reports': [UserRole.ADMIN, UserRole.CASHIER],
  '/users': [UserRole.ADMIN],
  '/settings': [UserRole.ADMIN],
  '/reservations': [UserRole.ADMIN, UserRole.CASHIER],
  '/discounts': [UserRole.ADMIN],
}

export function canAccessRoute(role: UserRole, route: string): boolean {
  const allowedRoles = routeAccess[route]
  if (!allowedRoles) return false
  return allowedRoles.includes(role)
}
