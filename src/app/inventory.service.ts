import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/inventory';
  private itemsSignal = signal<any[]>([]);

  items = this.itemsSignal. asReadonly();

  loadInventory() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      this.itemsSignal.set(data);
    });
  }

  addItem(itemData: any) {
    this.http.post(this.apiUrl, itemData).subscribe(() => {
      this.loadInventory();
    });
  }

  updateItem(id: string, updatedData: any) {
    this.http.put(`${this.apiUrl}/${id}`, updatedData).subscribe(() => {
      this.loadInventory();
    });
  }

  deleteItem(id: string) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.loadInventory();
    });
  }
}