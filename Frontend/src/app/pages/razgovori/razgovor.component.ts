import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { RazgovorService } from '../../services/razgovor.service';
import { SignalRService, SignalRMessage } from '../../services/signalr.service';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

interface RazgovorPoruka {
  razgovorPorukaId: number;
  posiljaocId: number;
  sadrzaj: string;
  vrijemeSlanja: string;
  posiljaocIme: string;
  status?: string;
  isNew?: boolean; // For animation
}

interface RazgovorDetail {
  razgovorId: number;
  kupacId: number;
  majstorId: number;
  oglasId: number;
  kupacIme: string;
  majstorIme: string;
  datumKreiranja: string;
  datumUpdate: string;
  poruke: RazgovorPoruka[];
}

@Component({
  selector: 'app-razgovor',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  template: `
    <div class="razgovor-container" *ngIf="razgovor">
      <mat-card class="header-card">
        <div class="razgovor-header">
          <button mat-icon-button class="back-button" (click)="goBack()" matTooltip="Nazad na listu razgovora">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div class="header-info">
            <h2>{{ razgovor.kupacIme }} - {{ razgovor.majstorIme }}</h2>
            <p class="metadata">
              Započeto: {{ razgovor.datumKreiranja | date:'short' }}
            </p>
          </div>
          <div class="online-status">
            <mat-icon [class.online]="isOtherUserOnline" [class.offline]="!isOtherUserOnline">
              {{ isOtherUserOnline ? 'circle' : 'radio_button_unchecked' }}
            </mat-icon>
            <span [class.online-text]="isOtherUserOnline" [class.offline-text]="!isOtherUserOnline">
              {{ isOtherUserOnline ? 'Online' : 'Offline' }}
            </span>
          </div>
        </div>
      </mat-card>

      <mat-card class="messages-card">
        <div class="messages-list" #messagesContainer>
          <!-- Empty State -->
          <div *ngIf="!razgovor.poruke || razgovor.poruke.length === 0" class="empty-state">
            <mat-icon class="empty-icon">chat_bubble_outline</mat-icon>
            <h3>Još uvijek niste započeli konverzaciju</h3>
            <p>Pošaljite prvu poruku i započnite razgovor!</p>
          </div>

          <!-- Messages -->
          <div *ngFor="let poruka of razgovor.poruke; trackBy: trackByMessageId" 
               [ngClass]="{'message': true, 'own-message': poruka.posiljaocId === currentUserId, 'other-message': poruka.posiljaocId !== currentUserId, 'message-enter': poruka.isNew}">
            <div class="message-header">
              <span class="sender-name">{{ poruka.posiljaocIme }}</span>
              <span class="time">{{ poruka.vrijemeSlanja | date:'short' }}</span>
              <mat-icon *ngIf="poruka.posiljaocId === currentUserId && poruka.status === 'read'" class="read-icon" matTooltip="Pročitano">
                done_all
              </mat-icon>
              <mat-icon *ngIf="poruka.posiljaocId === currentUserId && poruka.status === 'sent'" class="sent-icon" matTooltip="Poslano">
                done
              </mat-icon>
            </div>
            <div class="message-content">
              {{ poruka.sadrzaj }}
            </div>
          </div>

          <!-- Typing Indicator -->
          <div *ngIf="isOtherUserTyping" class="typing-indicator">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span class="typing-text">{{ otherUserName }} piše...</span>
          </div>
        </div>
      </mat-card>

      <mat-card class="input-card">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Vaša poruka</mat-label>
          <textarea matInput 
                    [(ngModel)]="newMessage" 
                    (ngModelChange)="onTyping()"
                    (keydown.enter)="onEnterPress($any($event))"
                    placeholder="Upišite poruku..."
                    rows="3"></textarea>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="sendMessage()" [disabled]="!newMessage.trim() || isSending">
          <mat-icon>send</mat-icon> 
          {{ isSending ? 'Šalje se...' : 'Pošalji' }}
        </button>
      </mat-card>

      <!-- Connection Status -->
      <div *ngIf="!isSignalRConnected" class="connection-warning">
        <mat-icon>warning</mat-icon>
        <span>Povezivanje sa serverom...</span>
      </div>
    </div>

    <div *ngIf="!razgovor" class="loading">
      <mat-spinner></mat-spinner>
      <p>Učitavanje razgovora...</p>
    </div>
  `,
  styles: [`
    .razgovor-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0;
      display: flex;
      flex-direction: column;
      height: calc(100vh - 100px);
      position: relative;
      background: linear-gradient(to bottom, #f0f2f5 0%, #e8eaed 100%);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .header-card {
      padding: 16px 24px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .razgovor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .back-button {
      color: white !important;
      background: rgba(255, 255, 255, 0.15) !important;
      transition: all 0.3s ease;
    }

    .back-button:hover {
      background: rgba(255, 255, 255, 0.25) !important;
      transform: translateX(-2px);
    }

    .back-button mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .header-info {
      flex: 1;
    }

    .razgovor-header h2 {
      margin: 0;
      color: white;
      font-size: 1.3em;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .metadata {
      color: rgba(255, 255, 255, 0.85);
      margin: 6px 0 0 0;
      font-size: 0.85em;
      font-weight: 400;
    }

    .online-status {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.15);
      padding: 8px 14px;
      border-radius: 20px;
      backdrop-filter: blur(10px);
    }

    .online-status mat-icon {
      font-size: 12px;
      width: 12px;
      height: 12px;
    }

    .online-status mat-icon.online {
      color: #4ade80;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .online-status mat-icon.offline {
      color: rgba(255, 255, 255, 0.5);
    }

    .online-text {
      color: white;
      font-weight: 500;
      font-size: 0.9em;
    }

    .offline-text {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9em;
    }

    .messages-card {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      background: linear-gradient(to bottom, #f0f2f5 0%, #e8eaed 100%);
      background-image: 
        repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 20px);
    }

    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .message {
      margin-bottom: 10px;
      opacity: 1;
      transform: translateY(0);
      transition: all 0.3s ease-in-out;
    }

    .message-enter {
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .own-message {
      align-self: flex-end;
      max-width: 75%;
    }

    .own-message .message-content {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border-radius: 18px 18px 4px 18px;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }

    .other-message {
      align-self: flex-start;
      max-width: 75%;
    }

    .other-message .message-content {
      background: white;
      color: #2c3e50;
      border-radius: 18px 18px 18px 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;
      margin-bottom: 6px;
      font-size: 0.8em;
      gap: 8px;
    }

    .own-message .message-header {
      color: rgba(255, 255, 255, 0.85);
    }

    .other-message .message-header {
      color: #64748b;
    }

    .sender-name {
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .time {
      margin-left: auto;
      opacity: 0.8;
      font-size: 0.95em;
    }

    .read-icon, .sent-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-left: 4px;
    }

    .read-icon {
      color: #4ade80;
    }

    .sent-icon {
      color: rgba(255, 255, 255, 0.6);
    }

    .other-message .sent-icon {
      color: #94a3b8;
    }

    .message-content {
      padding: 12px 16px;
      word-wrap: break-word;
      line-height: 1.5;
      font-size: 0.95em;
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      align-self: flex-start;
    }

    .typing-dots {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
      background: white;
      border-radius: 18px 18px 18px 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .typing-dots span {
      width: 8px;
      height: 8px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 50%;
      animation: typing 1.4s infinite;
    }

    .typing-dots span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .typing-dots span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%, 60%, 100% {
        opacity: 0.3;
        transform: translateY(0);
      }
      30% {
        opacity: 1;
        transform: translateY(-6px);
      }
    }

    .typing-text {
      color: #64748b;
      font-size: 0.85em;
      font-style: italic;
      font-weight: 500;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
      height: 100%;
      min-height: 300px;
    }

    .empty-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #cbd5e1;
      margin-bottom: 20px;
      opacity: 0.7;
    }

    .empty-state h3 {
      margin: 0 0 10px 0;
      color: #475569;
      font-size: 1.3em;
      font-weight: 600;
    }

    .empty-state p {
      margin: 0;
      color: #94a3b8;
      font-size: 1em;
    }

    .input-card {
      padding: 16px 20px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
      background: white;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
      border-top: 1px solid #e2e8f0;
    }

    .full-width {
      width: 100%;
    }

    .input-card button {
      margin-top: 4px;
      border-radius: 24px !important;
      padding: 0 24px !important;
      height: 48px;
      font-weight: 600;
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
      transition: all 0.3s ease;
    }

    .input-card button:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.5);
    }

    .input-card button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .connection-warning {
      position: absolute;
      bottom: 140px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
      padding: 12px 24px;
      border-radius: 24px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
      z-index: 1000;
      font-weight: 500;
      backdrop-filter: blur(10px);
      animation: slideInUp 0.3s ease-out;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translate(-50%, 20px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }

    .loading {
      text-align: center;
      padding: 60px 40px;
      color: #94a3b8;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      background: linear-gradient(to bottom, #f0f2f5 0%, #e8eaed 100%);
      border-radius: 12px;
      margin: 20px;
    }

    .loading p {
      font-size: 1.1em;
      font-weight: 500;
    }
  `]
})
export class RazgovorComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  razgovor: RazgovorDetail | null = null;
  newMessage = '';
  currentUserId: number = 0;
  isSending = false;
  isSignalRConnected = false;
  isOtherUserOnline = false;
  isOtherUserTyping = false;
  otherUserName = '';
  otherUserId = 0;
  
  private destroy$ = new Subject<void>();
  private typingTimeout: any;
  private shouldScrollToBottom = false;

  constructor(
    private razgovorService: RazgovorService,
    private signalRService: SignalRService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Check if user is logged in
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('Morate biti prijavljeni da biste pristupili razgovorima.');
      this.router.navigate(['/login']);
      return;
    }

    this.currentUserId = currentUser.userId || currentUser.korisnikId || 0;

    // Get razgovorId from route
    this.route.params.subscribe(params => {
      const razgovorId = +params['id'];
      if (razgovorId) {
        this.loadRazgovor(razgovorId);
        this.initializeSignalR();
      } else {
        // If no ID, redirect to razgovori list
        this.router.navigate(['/razgovori']);
      }
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clear typing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  /**
   * Navigate back to razgovori list
   */
  goBack(): void {
    this.router.navigate(['/razgovori']);
  }

  /**
   * Initialize SignalR connection and listeners
   */
  private async initializeSignalR(): Promise<void> {
    try {
      // Start connection
      await this.signalRService.startConnection();
      
      // Set as connected immediately after successful start
      this.isSignalRConnected = true;
      this.cdr.markForCheck();
      
      // Monitor connection state
      this.signalRService.connectionState$
        .pipe(takeUntil(this.destroy$))
        .subscribe(state => {
          // Check if connected - state can be number 1 or string "Connected"
          this.isSignalRConnected = (state as any) === 1 || (state as any) === 'Connected';
          this.cdr.markForCheck();
        });

      // Listen for incoming messages
      this.signalRService.messageReceived$
        .pipe(takeUntil(this.destroy$))
        .subscribe(message => {
          this.handleReceivedMessage(message);
        });

      // Listen for message sent confirmation
      this.signalRService.messageSent$
        .pipe(takeUntil(this.destroy$))
        .subscribe(message => {
          this.handleMessageSent(message);
        });

      // Listen for typing indicator
      this.signalRService.userTyping$
        .pipe(takeUntil(this.destroy$))
        .subscribe(indicator => {
          if (indicator.razgovorId === this.razgovor?.razgovorId && indicator.userId !== this.currentUserId) {
            this.isOtherUserTyping = true;
            this.shouldScrollToBottom = true;
          }
        });

      // Listen for stopped typing
      this.signalRService.userStoppedTyping$
        .pipe(takeUntil(this.destroy$))
        .subscribe(indicator => {
          if (indicator.razgovorId === this.razgovor?.razgovorId && indicator.userId !== this.currentUserId) {
            this.isOtherUserTyping = false;
          }
        });

      // Listen for read receipts
      this.signalRService.messageRead$
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.handleMessageRead(data.razgovorPorukaId);
        });

      // Check other user online status
      this.checkOtherUserOnlineStatus();
      
    } catch (error) {
      console.error('Error initializing SignalR:', error);
    }
  }

  /**
   * Load razgovor from API
   */
  loadRazgovor(razgovorId: number) {
    if (!this.currentUserId) {
      console.error('No current user ID');
      return;
    }
    
    console.log('Loading razgovor:', razgovorId, 'for user:', this.currentUserId);
    this.razgovorService.getRazgovor(razgovorId, this.currentUserId).subscribe({
      next: (data: any) => {
        console.log('Razgovor data received:', data);
        this.razgovor = data;
        
        // Determine other user
        if (this.razgovor) {
          this.otherUserId = this.razgovor.kupacId === this.currentUserId 
            ? this.razgovor.majstorId 
            : this.razgovor.kupacId;
          this.otherUserName = this.razgovor.kupacId === this.currentUserId
            ? this.razgovor.majstorIme
            : this.razgovor.kupacIme;
        }
        
        this.shouldScrollToBottom = true;
        this.checkOtherUserOnlineStatus();
        
        // Mark messages as read
        this.markMessagesAsRead();
        
        // Force change detection
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('Greška pri učitavanju razgovora', err);
        if (err.status === 404 || err.status === 500) {
          alert('Razgovor nije pronađen.');
          this.router.navigate(['/razgovori']);
        }
      }
    });
  }

  /**
   * Send message via SignalR
   */
  async sendMessage() {
    if (!this.newMessage.trim() || !this.razgovor || this.isSending) return;

    this.isSending = true;

    try {
      // Send via SignalR instead of HTTP
      await this.signalRService.sendMessage(
        this.razgovor.razgovorId,
        this.otherUserId,
        this.newMessage
      );
      
      this.newMessage = '';
      
      // Stop typing indicator
      if (this.razgovor) {
        await this.signalRService.notifyStoppedTyping(this.razgovor.razgovorId, this.otherUserId);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to HTTP if SignalR fails
      this.razgovorService.sendMessage(this.razgovor!.razgovorId, this.currentUserId, this.newMessage)
        .subscribe({
          next: () => {
            this.newMessage = '';
            this.loadRazgovor(this.razgovor!.razgovorId);
          },
          error: (err: any) => {
            console.error('Greška pri slanju poruke', err);
          }
        });
    } finally {
      this.isSending = false;
    }
  }

  /**
   * Handle received message from SignalR
   */
  private handleReceivedMessage(message: SignalRMessage) {
    if (!this.razgovor || message.razgovorId !== this.razgovor.razgovorId) return;

    const newPoruka: RazgovorPoruka = {
      razgovorPorukaId: message.razgovorPorukaId,
      posiljaocId: message.posiljaocId,
      sadrzaj: message.sadrzaj,
      vrijemeSlanja: message.vrijemeSlanja,
      posiljaocIme: message.posiljaocIme,
      status: message.status,
      isNew: true
    };

    // Add message to list - create new array reference
    this.razgovor.poruke = [...this.razgovor.poruke, newPoruka];
    this.shouldScrollToBottom = true;
    this.cdr.markForCheck();

    // Remove animation flag after animation completes
    setTimeout(() => {
      newPoruka.isNew = false;
      this.cdr.markForCheck();
    }, 300);

    // Mark as read if from other user
    if (message.posiljaocId !== this.currentUserId) {
      this.signalRService.markMessageAsRead(message.razgovorPorukaId);
    }
  }

  /**
   * Handle message sent confirmation
   */
  private handleMessageSent(message: SignalRMessage) {
    if (!this.razgovor || message.razgovorId !== this.razgovor.razgovorId) return;

    // Check if message already exists
    const exists = this.razgovor.poruke.some(p => p.razgovorPorukaId === message.razgovorPorukaId);
    
    if (!exists) {
      const newPoruka: RazgovorPoruka = {
        razgovorPorukaId: message.razgovorPorukaId,
        posiljaocId: message.posiljaocId,
        sadrzaj: message.sadrzaj,
        vrijemeSlanja: message.vrijemeSlanja,
        posiljaocIme: message.posiljaocIme,
        status: message.status,
        isNew: true
      };

      // Create new array reference - Angular detects this better
      this.razgovor.poruke = [...this.razgovor.poruke, newPoruka];
      this.shouldScrollToBottom = true;
      this.cdr.markForCheck();

      setTimeout(() => {
        newPoruka.isNew = false;
        this.cdr.markForCheck();
      }, 300);
    }
  }

  /**
   * Handle message read receipt
   */
  private handleMessageRead(razgovorPorukaId: number) {
    if (!this.razgovor) return;

    const message = this.razgovor.poruke.find(p => p.razgovorPorukaId === razgovorPorukaId);
    if (message) {
      message.status = 'read';
    }
  }

  /**
   * Handle typing event
   */
  onTyping() {
    if (!this.razgovor || !this.newMessage.trim()) return;

    // Clear existing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Send typing notification
    this.signalRService.notifyTyping(this.razgovor.razgovorId, this.otherUserId);

    // Stop typing after 2 seconds of inactivity
    this.typingTimeout = setTimeout(() => {
      if (this.razgovor) {
        this.signalRService.notifyStoppedTyping(this.razgovor.razgovorId, this.otherUserId);
      }
    }, 2000);
  }

  /**
   * Handle Enter key press
   */
  onEnterPress(event: KeyboardEvent) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Check if other user is online
   */
  private async checkOtherUserOnlineStatus() {
    if (this.otherUserId > 0) {
      this.isOtherUserOnline = await this.signalRService.isUserOnline(this.otherUserId);
    }
  }

  /**
   * Mark all unread messages as read
   */
  private async markMessagesAsRead() {
    if (!this.razgovor) return;

    const unreadMessages = this.razgovor.poruke.filter(
      p => p.posiljaocId !== this.currentUserId && p.status !== 'read'
    );

    for (const message of unreadMessages) {
      await this.signalRService.markMessageAsRead(message.razgovorPorukaId);
    }
  }

  /**
   * Scroll to bottom of messages
   */
  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  /**
   * Track by function for messages
   */
  trackByMessageId(index: number, poruka: RazgovorPoruka): number {
    return poruka.razgovorPorukaId;
  }
}
