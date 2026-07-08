import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../inventory.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './inventory-dashboard.html',
  styleUrl: './inventory-dashboard.css',
})
export class InventoryDashboard implements OnInit {
  inventoryService = inject(InventoryService);
  private router = inject(Router);
  
  searchWord: string = '';
  selectedRoom: number = 1;

  itemForm = new FormGroup({
    itemName: new FormControl('', Validators.required),
    sku: new FormControl('', Validators.required),
    quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    shippingStatus: new FormControl('In Warehouse', Validators.required),
    category: new FormControl('', Validators.required)
  });

  switchRoom(roomNumber: number) {
    this.selectedRoom = roomNumber;
  }

  getRoomFilteredItems() {
    return this.inventoryService.itemList.filter(item => {
      const matchesRoom = item.roomLocation === this.selectedRoom;
      
      const matchesSearch = item.itemName.toLowerCase().includes(this.searchWord.toLowerCase()) || 
                            item.sku.toLowerCase().includes(this.searchWord.toLowerCase());
                            
      return matchesRoom && matchesSearch;
    });
  }

  ngOnInit() {
    if (!this.inventoryService.currentUser) {
      this.router.navigate(['/']);
      return;
    }
    this.inventoryService.getItems();
  }

  getTotalQuantity() {
    return this.inventoryService.itemList.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }

  getWarehouseCount() {
    return this.inventoryService.itemList.filter(i => i.shippingStatus === 'In Warehouse').length;
  }

  getTransitCount() {
    return this.inventoryService.itemList.filter(i => i.shippingStatus === 'In Transit').length;
  }

  getFilteredItems() {
    return this.inventoryService.itemList.filter(item => {
      return item.itemName.toLowerCase().includes(this.searchWord.toLowerCase()) || 
             item.sku.toLowerCase().includes(this.searchWord.toLowerCase());
    });
  }

  onSave() {
    if (this.itemForm.invalid) return;
    const payload = {
      ...this.itemForm.value,
      roomLocation: this.selectedRoom
    };

    this.inventoryService.addItem(payload);

    this.itemForm.reset({
      quantity: 1,
      shippingStatus: 'In Warehouse',
      category: ''
    });
  }

  changeToTransit(id: string, item: any) {
    this.inventoryService.updateItem(id, { ...item, shippingStatus: 'In Transit' });
  }

  changeToDelivered(id: string, item: any) {
    this.inventoryService.updateItem(id, { ...item, shippingStatus: 'Delivered' });
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.inventoryService.deleteItem(id);
    }
  }

  logout() {
    this.inventoryService.currentUser = null;
    this.router.navigate(['/']);
  }
}