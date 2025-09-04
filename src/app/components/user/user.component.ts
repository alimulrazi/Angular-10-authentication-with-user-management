import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { UserDialogComponent } from './user-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TitleService } from '../../services/title.service';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'user', 'role', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>();
  selection = new SelectionModel<User>(true, []);
  searchTerm: string = '';
  selectedUsers: User[] = [];
  selectedRole: string = '';
  selectedStatus: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', avatar: 'JS' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Editor', status: 'Inactive', avatar: 'MJ' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'User', status: 'Active', avatar: 'SW' },
    { id: 5, name: 'David Brown', email: 'david@example.com', role: 'User', status: 'Active', avatar: 'DB' },
    { id: 6, name: 'Lisa Garcia', email: 'lisa@example.com', role: 'Editor', status: 'Inactive', avatar: 'LG' }
  ];

  constructor(private dialog: MatDialog, private titleService: TitleService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Users');
    this.dataSource.data = this.users;
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const filters = JSON.parse(filter);
      const searchMatch = !filters.search ||
        data.name.toLowerCase().includes(filters.search) ||
        data.email.toLowerCase().includes(filters.search);
      const roleMatch = !filters.role || data.role === filters.role;
      const statusMatch = !filters.status || data.status === filters.status;

      return searchMatch && roleMatch && statusMatch;
    };

    this.selection.changed.subscribe(() => {
      this.selectedUsers = this.selection.selected;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(): void {
    const filterValue = {
      search: this.searchTerm.trim().toLowerCase(),
      role: this.selectedRole,
      status: this.selectedStatus
    };
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.applyFilter();
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user: null, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newUser: User = {
          id: Math.max(...this.users.map(u => u.id)) + 1,
          ...result,
          avatar: this.generateAvatar(result.name)
        };
        this.users.push(newUser);
        this.dataSource.data = [...this.users];
      }
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user: { ...user }, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = { ...user, ...result, avatar: this.generateAvatar(result.name) };
          this.dataSource.data = [...this.users];
        }
      }
    });
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
        confirmText: 'Yes',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.users = this.users.filter(u => u.id !== user.id);
        this.dataSource.data = [...this.users];
      }
    });
  }

  private generateAvatar(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'Admin': return 'admin_panel_settings';
      case 'Editor': return 'edit';
      case 'User': return 'person';
      default: return 'person';
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  exportSelected(): void {
    if (this.selectedUsers.length === 0) return;

    const csvData = this.convertToCSV(this.selectedUsers);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(users: User[]): string {
    const headers = ['ID', 'Name', 'Email', 'Role', 'Status'];
    const csvRows = [headers.join(',')];

    users.forEach(user => {
      const row = [user.id, user.name, user.email, user.role, user.status];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }
}

