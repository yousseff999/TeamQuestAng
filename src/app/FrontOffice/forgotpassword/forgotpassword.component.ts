import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {
 resetForm: FormGroup;
  isLoading = false;
  message = '';
  isSuccess = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

 onSubmit() {
  if (this.resetForm.valid) {
    this.isLoading = true;
    this.message = '';
    
    this.authService.forgotPassword(this.resetForm.value.email).subscribe({
      next: (response: any) => {
        this.message = response.message || 'Reset link sent successfully';
        this.isSuccess = true;
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.message = err.message || 'An error occurred. Please try again.';
        this.isSuccess = false;
        this.isLoading = false;
      }
    });
  }
}
}
