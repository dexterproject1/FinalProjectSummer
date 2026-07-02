import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './inventory-dashboard.html',
  styleUrl: './inventory-dashboard.css',
})
export class InventoryDashboard implements OnInit {
  inventoryService = inject(InventoryService);

  isLocked = signal<boolean>(true);
  errorMessage = signal<string>('');

  itemForm = new FormGroup({
    itemName: new FormControl('', Validators.required),
    sku: new FormControl('', Validators.required),
    quantity: new FormControl(1, [Validators.required, Validators.min(0)]),
    shippingStatus: new FormControl('In Warehouse', Validators.required)
  });

  ngOnInit() {
    this.inventoryService.loadInventory();
  }

  unlockTerminal(pin: string) {
    if (pin === 'APPDEV1') {
      this.isLocked.set(false);
      this.errorMessage.set('');
    } else {
      this.errorMessage.set('❌ Invalid Terminal PIN. Access Denied.');
    }
  }

  onSubmit() {
    if (this.itemForm.valid) {
      this.inventoryService.addItem(this.itemForm.value);
      this.itemForm.reset({ quantity: 1, shippingStatus: 'In Warehouse'});
    }
  }

  shipItem(id: string, currentItem: any) {
    const updated = { ...currentItem, shippingStatus: 'In Transit' };
    this.inventoryService.updateItem(id, updated);
  }
}
