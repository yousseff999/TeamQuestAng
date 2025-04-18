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
      () => {
        const userId = this.authService.getUserId();
        if (!userId) {
          this.errorMessage = 'Login failed: User ID is undefined.';
          console.error('Login failed: User ID is undefined.');
          this.loading = false;
          return;
        }

        const role = this.authService.getRole();
        if (role === 'USER') {
          this.router.navigate(['/home', userId]);
        } else if (role === 'ADMIN') {
          this.router.navigate(['/admin', userId]);
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