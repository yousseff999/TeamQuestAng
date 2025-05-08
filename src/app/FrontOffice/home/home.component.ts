import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatMessage } from 'src/app/models/chat-message';
import { NotificationService } from 'src/app/services/notification.service';
import { Portfolio, PortfolioService } from 'src/app/services/portfolio.service'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit  {
  portfolios: Portfolio[] = [];
  imageUrls: { [key: number]: string } = {};
  constructor(private router: Router,private notificationService: NotificationService,private route: ActivatedRoute, private portfolioService: PortfolioService) {}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  ngOnInit(): void {
    const opponentId = 'opponentUsername'; // Use logged-in user's username
    this.notificationService.connect(opponentId, (msg: ChatMessage) => {
      alert(`📢 Message from ${msg.sender}: ${msg.content}`);
    });
    this.loadPortfolios();
  }
  loadPortfolios(): void {
    this.portfolioService.getAllPortfolios().subscribe(portfolios => {
      this.portfolios = portfolios;
      portfolios.forEach(portfolio => {
        this.portfolioService.getImageUrlById(portfolio.idPortfolio).subscribe(url => {
          this.imageUrls[portfolio.idPortfolio] = url;
        });
      });
    });
  }
  scrollTo(id: string, event: Event) {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  ngOnDestroy(): void {
    this.notificationService.disconnect();
  }

}
