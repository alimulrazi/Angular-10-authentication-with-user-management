import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.css']
})
export class CustomerDialogComponent {
  customer: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'Active',
    orders: 0,
    totalSpent: '$0'
  };

  constructor(
    public dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.customer) {
      this.customer = { ...data.customer };
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.customer);
  }

  get isViewMode(): boolean {
    return this.data.mode === 'view';
  }

  get dialogTitle(): string {
    switch (this.data.mode) {
      case 'add': return 'Add Customer';
      case 'edit': return 'Edit Customer';
      case 'view': return 'View Customer Details';
      default: return 'Customer';
    }
  }
}