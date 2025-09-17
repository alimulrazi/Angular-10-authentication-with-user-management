import { Injectable } from '@angular/core';

export interface UserPermissions {
  canViewUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewSettings: boolean;
  canViewCustomers: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private currentUserRole: string = 'Admin'; // This would come from auth service

  constructor() { }

  setUserRole(role: string): void {
    this.currentUserRole = role;
  }

  getUserRole(): string {
    return this.currentUserRole;
  }

  getPermissions(): UserPermissions {
    switch (this.currentUserRole) {
      case 'Admin':
        return {
          canViewUsers: true,
          canEditUsers: true,
          canDeleteUsers: true,
          canViewSettings: true,
          canViewCustomers: true
        };
      case 'Editor':
        return {
          canViewUsers: true,
          canEditUsers: true,
          canDeleteUsers: false,
          canViewSettings: false,
          canViewCustomers: true
        };
      case 'User':
        return {
          canViewUsers: false,
          canEditUsers: false,
          canDeleteUsers: false,
          canViewSettings: false,
          canViewCustomers: false
        };
      default:
        return {
          canViewUsers: false,
          canEditUsers: false,
          canDeleteUsers: false,
          canViewSettings: false,
          canViewCustomers: false
        };
    }
  }

  hasPermission(permission: keyof UserPermissions): boolean {
    return this.getPermissions()[permission];
  }
}
