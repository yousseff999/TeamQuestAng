import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatMessage } from 'src/app/models/chat-message';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit  {

  constructor(private router: Router,private notificationService: NotificationService) {}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  ngOnInit(): void {
    const opponentId = 'opponentUsername'; // Use logged-in user's username
    this.notificationService.connect(opponentId, (msg: ChatMessage) => {
      alert(`📢 Message from ${msg.sender}: ${msg.content}`);
    });
  }

  ngOnDestroy(): void {
    this.notificationService.disconnect();
  }

}
