import { Injectable } from '@angular/core';

export interface UserPermissions {
  canViewUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewSettings: boolean;
  canViewCustomers: boolean;
  canAssignRoles: boolean;
  canManagePermissions: boolean;
}

export interface Role {
  id: string;
  name: string;
  permissions: UserPermissions;
}

export interface UserRole {
  userId: number;
  roleId: string;
  assignedBy: number;
  assignedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private currentUserRole: string = 'editor';
  private userRoles: UserRole[] = [];

  private roles: Role[] = [
    {
      id: 'admin',
      name: 'Administrator',
      permissions: {
        canViewUsers: true,
        canEditUsers: true,
        canDeleteUsers: true,
        canViewSettings: true,
        canViewCustomers: true,
        canAssignRoles: true,
        canManagePermissions: true
      }
    },
    {
      id: 'editor',
      name: 'Editor',
      permissions: {
        canViewUsers: true,
        canEditUsers: true,
        canDeleteUsers: false,
        canViewSettings: false,
        canViewCustomers: true,
        canAssignRoles: false,
        canManagePermissions: false
      }
    },
    {
      id: 'user',
      name: 'User',
      permissions: {
        canViewUsers: false,
        canEditUsers: false,
        canDeleteUsers: false,
        canViewSettings: false,
        canViewCustomers: false,
        canAssignRoles: false,
        canManagePermissions: false
      }
    }
  ];

  constructor() {
    this.loadUserRoles();
  }

  setUserRole(role: string): void {
    this.currentUserRole = role;
  }

  getPermissions(): UserPermissions {
    const role = this.roles.find(r => r.id === this.currentUserRole);
    return role ? role.permissions : this.getDefaultPermissions();
  }

  private getDefaultPermissions(): UserPermissions {
    return {
      canViewUsers: false,
      canEditUsers: false,
      canDeleteUsers: false,
      canViewSettings: false,
      canViewCustomers: false,
      canAssignRoles: false,
      canManagePermissions: false
    };
  }

  getAllRoles(): Role[] {
    return this.roles;
  }

  getUserRole(userId: number): string | null {
    const userRole = this.userRoles.find(ur => ur.userId === userId);
    return userRole ? userRole.roleId : null;
  }

  assignRole(userId: number, roleId: string, assignedBy: number): boolean {
    if (!this.hasPermission('canAssignRoles')) {
      return false;
    }

    const existingIndex = this.userRoles.findIndex(ur => ur.userId === userId);
    const newUserRole: UserRole = {
      userId,
      roleId,
      assignedBy,
      assignedAt: new Date()
    };

    if (existingIndex >= 0) {
      this.userRoles[existingIndex] = newUserRole;
    } else {
      this.userRoles.push(newUserRole);
    }

    this.saveUserRoles();
    return true;
  }

  canAssignRole(targetRoleId: string): boolean {
    if (!this.hasPermission('canAssignRoles')) {
      return false;
    }

    // Admin can assign any role, others cannot assign admin role
    if (targetRoleId === 'admin' && this.currentUserRole !== 'admin') {
      return false;
    }

    return true;
  }

  private loadUserRoles(): void {
    const stored = localStorage.getItem('userRoles');
    if (stored) {
      this.userRoles = JSON.parse(stored).map((ur: any) => ({
        ...ur,
        assignedAt: new Date(ur.assignedAt)
      }));
    }
  }

  private saveUserRoles(): void {
    localStorage.setItem('userRoles', JSON.stringify(this.userRoles));
  }

  hasPermission(permission: keyof UserPermissions): boolean {
    return this.getPermissions()[permission];
  }

  setCurrentUserRole(roleId: string): void {
    this.currentUserRole = roleId;
  }
}
