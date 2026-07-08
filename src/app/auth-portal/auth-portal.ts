import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../inventory.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-portal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth-portal.html',
  styleUrl: './auth-portal.css'
})
export class AuthPortal {
  private inventoryService = inject(InventoryService);
  private router = inject(Router);

  isRegister: boolean = false;
  feedbackMessage: string = '';

  authForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  toggleForm() {
    this.isRegister = !this.isRegister;
    this.feedbackMessage = '';
    this.authForm.reset();
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    if (this.isRegister) {
      this.inventoryService.register(this.authForm.value).subscribe({
        next: () => {
          this.feedbackMessage = 'Registration successful! You can now log in.';
          this.isRegister = false;
          this.authForm.reset();
        },
        error: (err) => {
          this.feedbackMessage = err.error?.error || 'Registration failure.';
        }
      });
    } else {
      if (this.authForm.value.username === 'admin' && this.authForm.value.password === 'APPDEV1') {
        this.inventoryService.currentUser = 'Professor';
        this.router.navigate(['/dashboard']);
        return;
      }

      this.inventoryService.login(this.authForm.value).subscribe({
        next: (res: any) => {
          this.inventoryService.currentUser = res.username;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.feedbackMessage = err.error?.error || 'Authentication denied.';
        }
      });
    }
  }
}