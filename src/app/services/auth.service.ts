import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
/*interface LoginResponse {
    id: number;
    role: string;
    token: string;
  }*/

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8086/api/auth';
  
 
  constructor(private http: HttpClient,private router: Router) {}
forgotPassword(email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/forgot-password`, { email }, {
    responseType: 'json'  // Explicitly expect JSON
  }).pipe(
    catchError(error => {
      console.error('Forgot password error:', error);
      return throwError(() => ({
        message: error.error?.message || 'Failed to send reset link'
      }));
    })
  );
}

  resetPassword(token: string, newPassword: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/reset-password`, {
    token,
    newPassword
  }).pipe(
    catchError(error => {
      console.error('Reset password error:', error);
      return throwError(() => ({
        message: error.error?.message || 'Failed to reset password'
      }));
    })
  );
}
  signUp(name: string, email: string, password: string, confirmPassword: string): Observable<any> {
    const signUpData = { name, email, password, confirmPassword };
    return this.http.post<any>(`${this.apiUrl}/signup`, signUpData).pipe(
      tap(response => {
        if (response && response.userId && response.role && response.token) {
          localStorage.setItem('userId', response.userId.toString());
          localStorage.setItem('role', response.role);
          localStorage.setItem('token', response.token);
        }
      })
    );
  }
  // Login method that sends credentials to the backend and stores user data
  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };

    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        // Assuming the backend responds with { id, role, token }
        if (response && response.userId && response.role && response.token) {
          // Store user data in localStorage or sessionStorage
          localStorage.setItem('userId', response.userId.toString());
          localStorage.setItem('role', response.role);
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  // Method to retrieve userId from localStorage
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Method to retrieve user role from localStorage
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // Method to retrieve authentication token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Logout method to clear user data from localStorage
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    sessionStorage.clear();
    // Redirect to login page
    this.router.navigate(['/login']);
  }
  getUsername(): string | null {
    return localStorage.getItem('username'); // Or however you are saving username
  }
  // Method to check if the user is authenticated (has token)
  /*isAuthenticated(): boolean {
    return !!this.getToken(); // Returns true if token exists, false otherwise
  }*/
    isAuthenticated(): boolean {
      return !!localStorage.getItem('token');
    }
}
