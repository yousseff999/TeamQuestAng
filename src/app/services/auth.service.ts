import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
/*interface LoginResponse {
    id: number;
    role: string;
    token: string;
  }*/

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8086/api/auth'; // Replace with your actual backend API URL
  
 
  constructor(private http: HttpClient) {}

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
  }

  // Method to check if the user is authenticated (has token)
  isAuthenticated(): boolean {
    return !!this.getToken(); // Returns true if token exists, false otherwise
  }
}

