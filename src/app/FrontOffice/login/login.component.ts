import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  emailTouched: boolean = false; // Track if the email input is touched
  passwordTouched: boolean = false; // Track if the password input is touched
  loading: boolean = false; // Loading state for the login button
  errorMessage: string = ''; // To show error messages if login fails

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
  this.loading = true; // Set loading to true when login request is sent

  this.authService.login(this.email, this.password).subscribe(
    response => {
      // ✅ Extract userId and role from the login response
      const userId = response.userId;
      const role = response.role;

      // ✅ Store userId and role in localStorage
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);

      if (!userId || !role) {
        this.errorMessage = 'Login failed: Missing user ID or role.';
        console.error('Login failed: Missing user ID or role.');
        this.loading = false;
        return;
      }

      // ✅ Navigate based on role only (without userId in URL)
      if (role === 'USER') {
        this.router.navigate(['/home']); // Updated to remove userId from URL
      } else if (role === 'ADMIN') {
        this.router.navigate(['/admin']); // Updated to remove userId from URL
      } else {
        this.errorMessage = 'Login failed: Unknown role.';
        console.error('Login failed: Unknown role:', role);
      }

      this.loading = false; // Reset loading after navigation
    },
    error => {
      this.loading = false; // Reset loading on error
      if (error.status === 401) {
        this.errorMessage = 'Invalid credentials. Please try again.';
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
        console.error('Login error:', error);
      }
    }
  );
}

  navigateToForgetPassword(): void {
    this.router.navigate(['/forgetpassword']);
  }

  /*logout(): void {
    // Clear user session data (e.g., token, user info)
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    sessionStorage.clear();  // Optionally clear sessionStorage

    // Redirect user to login page
    this.router.navigate(['/login']);
  }

  // You can also add other helper methods to manage authentication, such as:
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Example check for auth
  }*/
}