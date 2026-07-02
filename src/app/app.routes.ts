import { Routes } from '@angular/router';
import { InventoryDashboard } from './inventory-dashboard/inventory-dashboard';

export const routes: Routes = [
    { path: 'dashboard', component: InventoryDashboard },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
