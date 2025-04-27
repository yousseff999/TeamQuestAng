import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { ChatMessage } from '../models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private stompClient!: Client;

  connect(username: string, onMessage: (msg: any) => void): void {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8086/ws', // Replace with your backend WS URL
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected via STOMP');
        this.stompClient.subscribe(`/topic/notifications/${username}`, (message: IMessage) => {
          const msg = JSON.parse(message.body);
          onMessage(msg);
        });
      },
      debug: (str) => {
        console.log(str);
      }
    });

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }
  sendMessage(message: any): void {
    this.stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(message),
    });
  }
  sendPrivateMessage(opponentUsername: string, message: ChatMessage) {
    this.stompClient.publish({
      destination: `/private-message/${opponentUsername}`, 
      body: JSON.stringify(message)
    });
  }
}
