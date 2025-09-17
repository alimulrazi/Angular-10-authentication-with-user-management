import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from './user.component';
import { PermissionService, Role } from '../../services/permission.service';

@Component({
  selector: 'app-user-dialog',
  template: `
    <h2 mat-dialog-title>{{data.isEdit ? 'Edit' : 'Add'}} User</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm" class="user-form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role" required [disabled]="!canAssignRoles">
            <mat-option *ngFor="let role of availableRoles" 
                       [value]="role.name" 
                       [disabled]="!permissionService.canAssignRole(role.id)">
              {{role.name}}
            </mat-option>
          </mat-select>
          <mat-hint *ngIf="!canAssignRoles">You don't have permission to assign roles</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status" required>
            <mat-option value="Active">Active</mat-option>
            <mat-option value="Inactive">Inactive</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!userForm.valid">
        {{data.isEdit ? 'Update' : 'Create'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .user-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
      padding: 8px 0;
    }

    mat-dialog-content {
      padding: 0 24px;
      margin: 0;
      max-height: 65vh;
      overflow: auto;
    }

    mat-dialog-actions {
      padding: 8px 24px 24px;
      margin: 0;
      justify-content: flex-end;
    }

    h2[mat-dialog-title] {
      margin: 0;
      padding: 24px 24px 0;
      font-size: 20px;
      font-weight: 500;
      color: #1f2937;
    }

    .mat-mdc-form-field {
      width: 100%;
    }

    .mat-mdc-raised-button {
      margin-left: 8px;
    }
  `]
})
export class UserDialogComponent {
  userForm = this.fb.group({
    name: [this.data.user?.name || '', [Validators.required]],
    email: [this.data.user?.email || '', [Validators.required, Validators.email]],
    role: [this.data.user?.role || 'User', [Validators.required]],
    status: [this.data.user?.status || 'Active', [Validators.required]]
  });

  availableRoles: Role[] = [];
  canAssignRoles: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User | null, isEdit: boolean },
    private fb: FormBuilder,
    public permissionService: PermissionService
  ) {
    this.availableRoles = this.permissionService.getAllRoles();
    this.canAssignRoles = this.permissionService.hasPermission('canAssignRoles');
    
    if (!this.canAssignRoles) {
      this.userForm.get('role')?.disable();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}
