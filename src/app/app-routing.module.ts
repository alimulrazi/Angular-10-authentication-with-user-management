import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../app/components/login/login.component';
import { DashboardComponent } from '../app/components/dashboard/dashboard.component';
import { ProfileComponent } from '../app/components/profile/profile.component';
import { SettingsComponent } from '../app/components/settings/settings.component';
import { UserComponent } from '../app/components/user/user.component';
import { CustomerManagementComponent } from '../app/components/customer-management/customer-management.component';
import { AuthGuard } from '../../src/app/guards/auth.guard';
import { PermissionGuard } from '../../src/app/guards/permission.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard, PermissionGuard], data: { permission: 'canViewSettings' } },
  { path: 'users', component: UserComponent, canActivate: [AuthGuard, PermissionGuard], data: { permission: 'canViewUsers' } },
  { path: 'customers', component: CustomerManagementComponent, canActivate: [AuthGuard, PermissionGuard], data: { permission: 'canViewCustomers' } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
