import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './inventory-dashboard.html',
  styleUrl: './inventory-dashboard.css',
})
export class InventoryDashboard {
  inventoryService = inject(InventoryService);

  itemForm = new FormGroup({
    itemName: new FormControl('', Validators.required),
    sku: new FormControl('', Validators.required),
    quantity: new FormControl(1, [Validators.required, Validators.min(0)]),
    shippingStatus: new FormControl('In Warehouse', Validators.required)
  });

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
