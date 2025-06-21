import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { ChatMessage } from '../models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private stompClient!: Client;

  connect(username: string, onMessage: (msg: ChatMessage) => void): void {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8086/ws',
      reconnectDelay: 5000,
      connectHeaders: {
        username: username  
      },
      onConnect: () => {
        console.log('Connected via STOMP as:', username);
        
        // S'abonner aux messages privés pour cet utilisateur
        this.stompClient.subscribe(`/user/${username}/queue/messages`, (message: IMessage) => {
          const msg = JSON.parse(message.body) as ChatMessage;
          onMessage(msg);
        });
        
        // S'abonner aussi aux messages publics si nécessaire
        this.stompClient.subscribe('/topic/public', (message: IMessage) => {
          const msg = JSON.parse(message.body) as ChatMessage;
          onMessage(msg);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
      debug: (str) => {
        console.log('STOMP debug:', str);
      }
    });

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
      console.log('Disconnected from STOMP');
    }
  }

  sendMessage(message: ChatMessage): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(message),
      });
    } else {
      console.error('Cannot send message: STOMP client not connected');
    }
  }

  // Méthode pour envoyer une notification de challenge
  sendChallengeNotification(opponentUsername: string, challengeDetails: any, senderUsername: string): void {
    if (this.stompClient && this.stompClient.active) {
      const notificationMessage: ChatMessage = {
        id: 0, // Sera généré côté serveur
        sender: senderUsername,
        content: `Nouveau défi reçu: ${challengeDetails.title} - ${challengeDetails.description}`
      };
      
      this.stompClient.publish({
        destination: `/app/private-message/${opponentUsername}`,
        body: JSON.stringify(notificationMessage)
      });
      
      console.log('Challenge notification sent to:', opponentUsername);
    } else {
      console.error('Cannot send challenge notification: STOMP client not connected');
    }
  }

  sendPrivateMessage(opponentUsername: string, message: ChatMessage): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.publish({
        destination: `/app/private-message/${opponentUsername}`,
        body: JSON.stringify(message)
      });
    } else {
      console.error('Cannot send private message: STOMP client not connected');
    }
  }
}
