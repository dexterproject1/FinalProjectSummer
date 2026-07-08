import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './inventory-dashboard.html',
  styleUrl: './inventory-dashboard.css'
})
export class InventoryDashboard implements OnInit {
  public inventoryService = inject(InventoryService);
  private router = inject(Router);

  selectedRoom: number = 1;
  searchWord: string = '';

  itemForm = new FormGroup({
    itemName: new FormControl('', [Validators.required]),
    sku: new FormControl('', [Validators.required]),
    quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    category: new FormControl(''),
    shippingStatus: new FormControl('In Warehouse', [Validators.required])
  });

  ngOnInit() {
    if (!this.inventoryService.currentUser) {
      this.router.navigate(['/']);
    }
  }

  switchRoom(roomNumber: number) {
    this.selectedRoom = roomNumber;
  }


  getAvailableCategories(): string[] {
    const activeCategories = this.inventoryService.itemList
      .filter(item => (item.quantity || 0) > 0)
      .map(item => item.category || 'General');
      
    return Array.from(new Set(activeCategories));
  }

  getRoomFilteredItems() {
    return this.inventoryService.itemList.filter(item => {
      const itemRoom = item.roomLocation || 1;
      const matchesRoom = itemRoom === this.selectedRoom;
      
      const targetQuery = this.searchWord.toLowerCase();
      const matchesSearch = item.itemName.toLowerCase().includes(targetQuery) || 
                            item.sku.toLowerCase().includes(targetQuery);
                            
      return matchesRoom && matchesSearch;
    });
  }

  getTotalQuantity() {
    return this.inventoryService.itemList
      .filter(item => (item.roomLocation || 1) === this.selectedRoom)
      .reduce((sum, item) => sum + (item.quantity || 0), 0);
  }

  getWarehouseCount() {
    return this.inventoryService.itemList
      .filter(item => (item.roomLocation || 1) === this.selectedRoom && item.shippingStatus === 'In Warehouse')
      .length;
  }

  getTransitCount() {
    return this.inventoryService.itemList
      .filter(item => (item.roomLocation || 1) === this.selectedRoom && item.shippingStatus === 'In Transit')
      .length;
  }

  onSave() {
    if (this.itemForm.invalid) return;

    const formValues = this.itemForm.value;

    const newItem = {
      _id: 'ID-' + Math.random().toString(36).substr(2, 9),
      itemName: formValues.itemName!,
      sku: formValues.sku!,
      quantity: Number(formValues.quantity!),
      category: formValues.category || 'General',
      shippingStatus: formValues.shippingStatus!,
      roomLocation: this.selectedRoom
    };

    this.inventoryService.itemList.push(newItem);

    this.itemForm.reset({
      itemName: '',
      sku: '',
      quantity: 1,
      shippingStatus: 'In Warehouse',
      category: ''
    });
  }

  changeToTransit(id: string, item: any) {
    item.shippingStatus = 'In Transit';
  }

  changeToDelivered(id: string, item: any) {
    item.shippingStatus = 'Delivered';
  }

  onDelete(id: string) {
    this.inventoryService.itemList = this.inventoryService.itemList.filter(i => i._id !== id);
  }

  logout() {
    this.inventoryService.currentUser = '';
    this.router.navigate(['/']);
  }
}