import { Component } from '@angular/core';
import { DefiService } from '../../services/defi.service';
import { Defi } from '../../models/defi';

@Component({
  selector: 'app-createdefi',
  templateUrl: './createdefi.component.html',
  styleUrls: ['./createdefi.component.css']
})
export class CreatedefiComponent {
  newDefi: Defi = {
    theme: '',
    title: '',
    description: '',
    deadline: new Date().toISOString().slice(0, 16)
  };
  isLoading = false;
  message = '';

  constructor(private defiService: DefiService) { }

  createDefi(): void {
    if (!this.validateForm()) {
      this.message = 'Please fill all required fields';
      return;
    }

    this.isLoading = true;
    this.message = '';

    const defiToCreate = {
      ...this.newDefi,
      deadline: new Date(this.newDefi.deadline)
    };

    this.defiService.createDefi(defiToCreate).subscribe({
      next: (createdDefi) => {
        this.message = `"${createdDefi.title}" challenge created successfully!`;
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        this.message = 'Failed to create challenge. Please try again.';
        console.error('Creation error:', error);
        this.isLoading = false;
      }
    });
  }

  private validateForm(): boolean {
    return !!this.newDefi.theme && 
           !!this.newDefi.title && 
           !!this.newDefi.description && 
           !!this.newDefi.deadline;
  }

  private resetForm(): void {
    this.newDefi = {
      theme: '',
      title: '',
      description: '',
      deadline: new Date().toISOString().slice(0, 16)
    };
  }
}