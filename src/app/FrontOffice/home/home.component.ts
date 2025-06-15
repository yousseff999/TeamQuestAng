import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ChatMessage } from 'src/app/models/chat-message';
import { GiftCard } from 'src/app/models/gift-card';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { GiftCardService } from 'src/app/services/gift-card.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Portfolio, PortfolioService } from 'src/app/services/portfolio.service'; 
import { RankService } from 'src/app/services/rank.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit  {
  portfolios: Portfolio[] = [];
  imageUrls: { [key: number]: string } = {};
categories: string[] = ['SPORTS', 'CAMPING', 'CULTURAL', 'PARTY']; 
  selectedCategory: string = '';
topScorer?: User;
topScoringTeam: any;
  currentUserScore: number = 0;
  giftCards: GiftCard[] = [];
  userId: number | null = null;
  loadingGiftCards: boolean = false;
  constructor(private router: Router,private notificationService: NotificationService,
    private route: ActivatedRoute, private portfolioService: PortfolioService,
  private rankService : RankService, private feedbackService: FeedbackService,
 private userService : UserService ,  private teamService : TeamService,
 private authService: AuthService,private giftCardService: GiftCardService) {}
contact = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
   loading = false;
  successMessage = '';
  errorMessage = '';
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  ngOnInit(): void {
    const userIdString = this.authService.getUserId();
    if (userIdString) {
      this.userId = parseInt(userIdString, 10);
      this.loadGiftCards();
      this.loadCurrentUserScore();
    } else {
      console.warn('User not logged in');
    }
    const opponentId = 'opponentUsername'; // Use logged-in user's username
    this.notificationService.connect(opponentId, (msg: ChatMessage) => {
      alert(`📢 Message from ${msg.sender}: ${msg.content}`);
    });
    this.loadPortfolios();
    this.loadTopScorer(); 
    this.loadTopScoringTeam();
    
  }
 loadCurrentUserScore(): void {
    if (this.userId !== null) {
      this.userService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.currentUserScore = user.score_u; // Assuming 'score' exists
        },
        error: (err) => {
          console.error('Error fetching user score:', err);
        },
      });
    } else {
      console.warn('User ID is null. Cannot load score.');
    }
  }

  loadGiftCards(): void {
    if (this.userId) {
      this.loadingGiftCards = true;
      this.giftCardService.getGiftCards(this.userId).subscribe({
        next: (data) => {
          this.giftCards = data;
          this.loadingGiftCards = false;
        },
        error: (error) => {
          console.error('Error loading gift cards:', error);
          this.loadingGiftCards = false;
        }
      });
    }
  }

  exchangeGiftCard(giftCard: GiftCard): void {
    if (!giftCard.canAfford || giftCard.alreadyOwned || !this.userId) {
      return;
    }

    this.loading = true;
    const request = {
      giftCardId: giftCard.id,
      userId: this.userId
    };

    this.giftCardService.exchangeGiftCard(request).subscribe({
  next: (response) => {
    alert(response); // ✔ pas de .message
    this.currentUserScore -= giftCard.requiredScore;
    giftCard.alreadyOwned = true;
    this.loading = false;
    this.loadGiftCards();
  },
  error: (error) => {
    alert('Exchange failed: ' + (error.error?.error || error.message));
    this.loading = false;
  }
});

  }
  loadTopScorer(): void {
    this.userService.getTopScorer().subscribe({
      next: (user: User) => {
        this.topScorer = user;
        console.log('Top scorer:', user);
      },
      error: (err) => {
        console.error('Failed to load top scorer:', err);
      }
    });
  }
  loadTopScoringTeam() {
  this.teamService.getTopScoringTeam().subscribe({
    next: (data) => {
      this.topScoringTeam = data;
    },
    error: (err) => console.error('Error loading top scoring team', err)
  });
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
sendMessage() {
    this.loading = true;
    this.feedbackService.sendContactForm(this.contact).subscribe({
      next: () => {
        this.successMessage = 'Your message has been sent. Thank you!';
        this.errorMessage = '';
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Something went wrong. Please try again later.';
        this.successMessage = '';
        this.loading = false;
      }
    });
  }
  navigateToCategory(category: string) {
  this.router.navigate(['/eventscategory', category]);
}
}
