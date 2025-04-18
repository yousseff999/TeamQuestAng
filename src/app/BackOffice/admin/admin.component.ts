import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TypeEvent } from 'src/app/models/event';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  
  dropdownOpen = false;
  eventTypes = Object.values(TypeEvent);
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }
  constructor(private authService: AuthService, private router: Router) {}
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
  // Logout function to clear session and navigate to login page
  logout(): void {
    this.authService.logout(); // Call logout from AuthService
     // Navigate to login page after logout
  }
}
