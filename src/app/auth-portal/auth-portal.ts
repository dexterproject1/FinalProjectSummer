import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-auth-portal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth-portal.html',
  styleUrl: './auth-portal.css'
})
export class AuthPortal {
  private inventoryService = inject(InventoryService);
  private router = inject(Router);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  onLogin() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    if (username === 'admin' && password === 'APPDEV1') {
      
      this.inventoryService.currentUser = 'admin';
      
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid credentials!');
    }
  }
}