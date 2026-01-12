import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthService } from './auth.service';

export interface SignalRMessage {
  razgovorPorukaId: number;
  razgovorId: number;
  posiljaocId: number;
  primaocId: number;
  sadrzaj: string;
  vrijemeSlanja: string;
  posiljaocIme: string;
  status: string;
}

export interface TypingIndicator {
  razgovorId: number;
  userId: number;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;
  private connectionState = new BehaviorSubject<signalR.HubConnectionState>(signalR.HubConnectionState.Disconnected);
  public connectionState$ = this.connectionState.asObservable();

  // Observable for receiving messages
  private messageReceived = new Subject<SignalRMessage>();
  public messageReceived$ = this.messageReceived.asObservable();

  // Observable for message sent confirmation
  private messageSent = new Subject<SignalRMessage>();
  public messageSent$ = this.messageSent.asObservable();

  // Observable for typing indicator
  private userTyping = new Subject<TypingIndicator>();
  public userTyping$ = this.userTyping.asObservable();

  private userStoppedTyping = new Subject<TypingIndicator>();
  public userStoppedTyping$ = this.userStoppedTyping.asObservable();

  // Observable for message read receipts
  private messageRead = new Subject<{ razgovorPorukaId: number, primaocId: number }>();
  public messageRead$ = this.messageRead.asObservable();

  // Observable for online users
  private onlineUsers = new BehaviorSubject<Set<number>>(new Set());
  public onlineUsers$ = this.onlineUsers.asObservable();

  constructor(private authService: AuthService) {}

  /**
   * Start SignalR connection
   */
  public async startConnection(): Promise<void> {
    const token = this.authService.getToken();
    
    if (!token) {
      console.warn('No authentication token found. SignalR connection skipped.');
      this.connectionState.next(signalR.HubConnectionState.Disconnected);
      return;
    }

    // If already connected or connecting, skip
    if (this.hubConnection && 
        (this.hubConnection.state === signalR.HubConnectionState.Connected ||
         this.hubConnection.state === signalR.HubConnectionState.Connecting)) {
      console.log('SignalR already connected or connecting');
      return;
    }

    // SignalR connection - token mora biti u query parametru za negotiate endpoint
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5017/hubs/chat?access_token=${encodeURIComponent(token)}`)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Retry intervals
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Register event handlers
    this.registerHandlers();

    // Handle connection state changes
    this.hubConnection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
      this.connectionState.next(signalR.HubConnectionState.Reconnecting);
    });

    this.hubConnection.onreconnected(() => {
      console.log('SignalR reconnected successfully');
      this.connectionState.next(signalR.HubConnectionState.Connected);
    });

    this.hubConnection.onclose((error) => {
      console.log('SignalR connection closed:', error?.message || 'No error');
      this.connectionState.next(signalR.HubConnectionState.Disconnected);
    });

    try {
      await this.hubConnection.start();
      console.log('SignalR connection started successfully');
      this.connectionState.next(signalR.HubConnectionState.Connected);
    } catch (error: any) {
      console.warn('Could not start SignalR connection:', error?.message || error);
      this.connectionState.next(signalR.HubConnectionState.Disconnected);
      
      // Ne retry-uj ako je 401 Unauthorized - znači da token nije validan
      if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        console.warn('Authentication failed. SignalR will not retry.');
        return;
      }
      
      // Retry samo ako postoji token
      if (this.authService.getToken()) {
        setTimeout(() => this.startConnection(), 5000);
      }
    }
  }

  /**
   * Register all SignalR event handlers
   */
  private registerHandlers(): void {
    if (!this.hubConnection) return;

    // Handle incoming messages
    this.hubConnection.on('ReceiveMessage', (message: SignalRMessage) => {
      console.log('Message received via SignalR:', message);
      this.messageReceived.next(message);
    });

    // Handle message sent confirmation (for sync across devices)
    this.hubConnection.on('MessageSent', (message: SignalRMessage) => {
      console.log('Message sent confirmation:', message);
      this.messageSent.next(message);
    });

    // Handle typing indicator
    this.hubConnection.on('UserIsTyping', (indicator: TypingIndicator) => {
      console.log('User is typing:', indicator);
      this.userTyping.next(indicator);
    });

    // Handle stopped typing
    this.hubConnection.on('UserStoppedTyping', (indicator: TypingIndicator) => {
      console.log('User stopped typing:', indicator);
      this.userStoppedTyping.next(indicator);
    });

    // Handle message read receipts
    this.hubConnection.on('MessageRead', (data: { razgovorPorukaId: number, primaocId: number }) => {
      console.log('Message read:', data);
      this.messageRead.next(data);
    });
  }

  /**
   * Send a message
   */
  public async sendMessage(razgovorId: number, primaocId: number, poruka: string): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR connection is not established');
    }

    try {
      await this.hubConnection.invoke('SendMessage', razgovorId, primaocId, poruka);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Notify that user is typing
   */
  public async notifyTyping(razgovorId: number, primaocId: number): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    try {
      await this.hubConnection.invoke('UserTyping', razgovorId, primaocId);
    } catch (error) {
      console.error('Error sending typing notification:', error);
    }
  }

  /**
   * Notify that user stopped typing
   */
  public async notifyStoppedTyping(razgovorId: number, primaocId: number): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    try {
      await this.hubConnection.invoke('UserStoppedTyping', razgovorId, primaocId);
    } catch (error) {
      console.error('Error sending stopped typing notification:', error);
    }
  }

  /**
   * Mark message as read
   */
  public async markMessageAsRead(razgovorPorukaId: number): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    try {
      await this.hubConnection.invoke('MarkMessageAsRead', razgovorPorukaId);
      console.log('Message marked as read:', razgovorPorukaId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  /**
   * Check if user is online
   */
  public async isUserOnline(userId: number): Promise<boolean> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      return false;
    }

    try {
      return await this.hubConnection.invoke('IsUserOnline', userId);
    } catch (error) {
      console.error('Error checking online status:', error);
      return false;
    }
  }

  /**
   * Get connection ID for specific user
   */
  public async getConnectionIdForUser(userId: number): Promise<string | null> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      return null;
    }

    try {
      return await this.hubConnection.invoke('GetConnectionIdForUser', userId);
    } catch (error) {
      console.error('Error getting connection ID:', error);
      return null;
    }
  }

  /**
   * Stop SignalR connection
   */
  public async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
        console.log('SignalR connection stopped');
        this.connectionState.next(signalR.HubConnectionState.Disconnected);
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      }
    }
  }

  /**
   * Get current connection state
   */
  public getConnectionState(): signalR.HubConnectionState {
    return this.hubConnection?.state || signalR.HubConnectionState.Disconnected;
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.hubConnection?.state === signalR.HubConnectionState.Connected;
  }
}
