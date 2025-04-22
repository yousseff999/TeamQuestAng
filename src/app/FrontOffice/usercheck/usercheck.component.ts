import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usercheck',
  templateUrl: './usercheck.component.html',
  styleUrls: ['./usercheck.component.css']
})
export class UsercheckComponent {
   constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
