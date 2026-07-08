import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  
  itemList: any[] = [];
  currentUser: string | null = null;

  register(userData: any) {
    return this.http.post('http://localhost:3000/api/auth/register', userData);
  }

  login(userData: any) {
    return this.http.post('http://localhost:3000/api/auth/login', userData);
  }

  getItems() {
    this.http.get<any[]>('http://localhost:3000/api/inventory').subscribe((data) => {
      this.itemList = data;
    });
  }

  //Remove the delay after Adding Items
  addItem(item: any) {
    const clientSideItem = {
      ...item,
      _id: 'local-' + Date.now()
    };

    this.itemList.push(clientSideItem);

    this.http.post('http://localhost:3000/api/inventory', item).subscribe({
      next: (savedItem: any) => {
        const index = this.itemList.findIndex(i => i._id === clientSideItem._id);
        if (index !== -1) {
          this.itemList[index] = savedItem;
        }
      },
      error: () => {
        this.itemList = this.itemList.filter(i => i._id !== clientSideItem._id);
        alert('Network issue: Could not save item to backend database.');
      }
    });
  }

  updateItem(id: string, updatedData: any) {
    this.http.put(`http://localhost:3000/api/inventory/${id}`, updatedData).subscribe(() => {
      this.getItems();
    });
  }

  deleteItem(id: string) {
    this.http.delete(`http://localhost:3000/api/inventory/${id}`).subscribe(() => {
      this.getItems();
    });
  }
}