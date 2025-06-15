import { Component } from '@angular/core';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { AuthService } from 'src/app/services/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent {
  title = '';
  description = '';
  imageFile!: File;
  successMessage: string | null = null;
  constructor(
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  createPortfolio() {
    const userIdStr = this.authService.getUserId();
  
    if (!userIdStr) {
      alert('Utilisateur non connecté !');
      return;
    }
  
    const userId = Number(userIdStr); 
  
    this.portfolioService.createPortfolioWithImage(
      this.title,
      this.description,
      this.imageFile,
      userId
    ).subscribe({
      next: (res) => {
        console.log('Portfolio créé:', res);
        this.successMessage = "Votre portfolio a été mis à jour avec une nouvelle photo avec succès.";
  
        // Affichage de l'alerte avant de rediriger
        alert(this.successMessage); 
  
        // Redirection après un délai (pour donner le temps à l'alerte de s'afficher)
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000); // Délai de 2 secondes pour que l'alerte soit visible
      },
      error: (err) => {
        console.error('Erreur création portfolio:', err);
      }
    });
  }
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
