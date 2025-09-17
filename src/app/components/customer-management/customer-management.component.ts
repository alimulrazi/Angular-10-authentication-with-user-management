import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CustomerService, Customer } from '../../services/customer.service';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']
})
export class CustomerManagementComponent implements OnInit {
  customers: Customer[] = [];
  dataSource = new MatTableDataSource<Customer>(this.customers);
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['select', 'avatar', 'name', 'email', 'phone', 'orders', 'totalSpent', 'status', 'actions'];
  statusFilter = 'All';
  statusOptions = ['All', 'Active', 'Inactive'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.dataSource.data = this.customers;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByStatus() {
    if (this.statusFilter === 'All') {
      this.dataSource.data = this.customers;
    } else {
      this.dataSource.data = this.customers.filter(customer => customer.status === this.statusFilter);
    }
  }

  exportSelected() {
    const selectedData = this.selection.selected;
    const csvContent = this.convertToCSV(selectedData);
    this.downloadCSV(csvContent, 'customers.csv');
  }

  convertToCSV(data: any[]): string {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Status', 'Orders', 'Total Spent'];
    const csvArray = [headers.join(',')];

    data.forEach(customer => {
      const row = [
        customer.id,
        customer.firstName,
        customer.lastName,
        customer.email,
        customer.phone,
        customer.status,
        customer.orders,
        customer.totalSpent
      ];
      csvArray.push(row.join(','));
    });

    return csvArray.join('\n');
  }

  downloadCSV(csvContent: string, fileName: string) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  addCustomer(): void {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      width: '500px',
      data: { customer: null, mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newId = Math.max(...this.customers.map(c => c.id)) + 1;
        const newCustomer = { ...result, id: newId };
        this.customers.push(newCustomer);
        this.dataSource.data = this.customers;
      }
    });
  }

  editCustomer(customer: any): void {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      width: '500px',
      data: { customer: { ...customer }, mode: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.customers.findIndex(c => c.id === customer.id);
        this.customers[index] = { ...result, id: customer.id };
        this.dataSource.data = this.customers;
      }
    });
  }

  deleteCustomer(customer: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Delete Customer',
        message: `Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customers = this.customers.filter(c => c.id !== customer.id);
        this.dataSource.data = this.customers;
      }
    });
  }

  viewCustomer(customer: any): void {
    this.dialog.open(CustomerDialogComponent, {
      width: '500px',
      data: { customer, mode: 'view' }
    });
  }
}
