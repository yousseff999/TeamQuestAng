import { Component, OnInit } from '@angular/core';
import { DepartmentService } from 'src/app/services/department.service';
import { Department } from 'src/app/models/department';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-alldepatments',
  templateUrl: './alldepatments.component.html',
  styleUrls: ['./alldepatments.component.css']
})
export class AlldepatmentsComponent implements OnInit {
  departments: Department[] = [];
  selectedUsers: User[] = [];
  selectedDepartmentId: number | null = null;
  allUsers: User[] = [];
  selectedUserIdToAdd: number = 0;
  showUsersPanel: boolean = false;

  constructor(
    private departmentService: DepartmentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadAllUsers();
  }

  loadAllUsers(): void {
    this.userService.getAllUsers().subscribe((users) => {
      this.allUsers = users;
    });
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe((data) => {
      this.departments = data;
    });
  }

  deleteDepartment(id: number): void {
    this.departmentService.deleteDepartment(id).subscribe(() => {
      this.loadDepartments();
      if (this.selectedDepartmentId === id) {
        this.selectedDepartmentId = null;
        this.selectedUsers = [];
        this.showUsersPanel = false;
      }
    });
  }

  getUsersByDepartment(departmentId: number): void {
    // Toggle visibility if clicking the same department again
    if (this.selectedDepartmentId === departmentId && this.showUsersPanel) {
      this.showUsersPanel = false;
      this.selectedDepartmentId = null;
      this.selectedUsers = [];
      return;
    }

    this.selectedDepartmentId = departmentId;
    this.showUsersPanel = true;

    this.departmentService.getUsersByDepartment(departmentId).subscribe((users) => {
      this.selectedUsers = users;
    });
  }

  addUserToDepartment(): void {
    if (!this.selectedDepartmentId || !this.selectedUserIdToAdd) return;
    this.departmentService.addUserToDepartment(
      this.selectedDepartmentId,
      this.selectedUserIdToAdd
    ).subscribe(() => {
      this.getUsersByDepartment(this.selectedDepartmentId!);
      this.selectedUserIdToAdd = 0;
    });
  }

  removeUserFromDepartment(userId: number): void {
    if (!this.selectedDepartmentId) return;
    this.departmentService.removeUserFromDepartment(
      this.selectedDepartmentId,
      userId
    ).subscribe(() => {
      this.getUsersByDepartment(this.selectedDepartmentId!);
    });
  }
  getSelectedDepartmentName(): string {
    const selectedDept = this.departments.find(dept => dept.id === this.selectedDepartmentId);
    return selectedDept ? selectedDept.name : 'Selected Department';
  }
}
