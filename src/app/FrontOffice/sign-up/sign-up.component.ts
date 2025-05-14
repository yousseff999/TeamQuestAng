import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Handle form submission
  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    const { name, email, password, confirmPassword } = this.signUpForm.value;

    this.authService.signUp(name, email, password, confirmPassword).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! Redirecting...';
        this.errorMessage = null;
        setTimeout(() => {
          this.router.navigate(['/home']); // Redirect to dashboard
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'An error occurred during registration.';
        this.successMessage = null;
      }
    });
  }

  // Clear error message when user starts typing
  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }
}