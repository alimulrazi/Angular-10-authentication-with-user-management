import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermissionService, UserPermissions } from '../../services/permission.service';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-assign-permission',
  templateUrl: './assign-permission.component.html',
  styleUrls: ['./assign-permission.component.css']
})
export class AssignPermissionComponent implements OnInit {
  users: any[] = [];
  selectedUserId: number | null = null;
  permissions: UserPermissions = {
    canViewUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewSettings: false,
    canViewCustomers: false,
    canAssignRoles: false,
    canManagePermissions: false
  };

  permissionLabels = {
    canViewUsers: 'View Users',
    canEditUsers: 'Edit Users',
    canDeleteUsers: 'Delete Users',
    canViewSettings: 'View Settings',
    canViewCustomers: 'View Customers',
    canAssignRoles: 'Assign Roles',
    canManagePermissions: 'Manage Permissions'
  };

  constructor(
    private permissionService: PermissionService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  onUserSelect(): void {
    if (this.selectedUserId) {
      // First check for custom permissions
      const customPermissions = this.permissionService.getUserPermissions(this.selectedUserId);
      if (customPermissions) {
        this.permissions = { ...customPermissions };
      } else {
        // Fall back to role-based permissions
        const userRole = this.permissionService.getUserRole(this.selectedUserId);
        if (userRole) {
          const role = this.permissionService.getAllRoles().find(r => r.id === userRole);
          this.permissions = role ? { ...role.permissions } : { ...this.getDefaultPermissions() };
        } else {
          this.permissions = { ...this.getDefaultPermissions() };
        }
      }
    }
  }

  savePermissions(): void {
    if (!this.selectedUserId) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm Save',
        message: 'Are you sure you want to save these permissions?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.permissionService.saveUserPermissions(this.selectedUserId!, this.permissions, 1);
        this.snackBar.open('Permissions saved successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
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
}