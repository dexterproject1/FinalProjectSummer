import { Routes } from '@angular/router';
import { AuthPortal } from './auth-portal/auth-portal';
import { InventoryDashboard } from './inventory-dashboard/inventory-dashboard';

export const routes: Routes = [
  { path: '', component: AuthPortal },
  { path: 'dashboard', component: InventoryDashboard },
  { path: '**', redirectTo: '' }
];