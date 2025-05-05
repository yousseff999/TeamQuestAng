import { Component } from '@angular/core';
import { DepartmentService } from 'src/app/services/department.service';
import { Department } from 'src/app/models/department';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createdepatment',
  templateUrl: './createdepatment.component.html',
  styleUrls: ['./createdepatment.component.css']
})
export class CreatedepatmentComponent {
  isSubmitting = false;
  newDepartment: Department = {
    id: 0,
    name: '',
    score_d: 0,
    floor: 0,
    users: [],
    ranks: []
  };
  

  constructor(private departmentService: DepartmentService, private router: Router) {}

  onSubmit(): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
  
    this.departmentService.createDepartment(this.newDepartment).subscribe({
      next: () => {
        this.router.navigate(['/alldepartments']);
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.isSubmitting = false;
      }
    });
  }
  createDepartment(): void {
    if (!this.newDepartment.name || this.newDepartment.score_d < 0 || this.newDepartment.floor < 0) {
      alert("Please fill all the fields correctly.");
      return;
    }

    this.departmentService.createDepartment(this.newDepartment).subscribe({
      next: (created) => {
        alert(`Department '${created.name}' created successfully!`);
        this.newDepartment = { id: 0, name: '', score_d: 0, floor: 0,users: [],ranks: [] };
      },
      error: (err) => {
        console.error('Error creating department:', err);
        alert("An error occurred while creating the department.");
      }
    });
  }
}
