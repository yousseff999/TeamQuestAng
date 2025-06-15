import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-getstarted',
  templateUrl: './getstarted.component.html',
  styleUrls: ['./getstarted.component.css']
})
export class GetstartedComponent {
constructor(
    private router: Router
  ) {}
  scrollTo(id: string, event: Event) {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  navigateToCategory(category: string) {
  this.router.navigate(['/eventscategory', category]);
}
}
