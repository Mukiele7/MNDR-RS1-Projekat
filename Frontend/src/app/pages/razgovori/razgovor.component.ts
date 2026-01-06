import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RazgovorService } from '../../services/razgovor.service';

interface RazgovorPoruka {
  razgovorPorukaId: number;
  posiljaocId: number;
  sadrzaj: string;
  vrijemeSlanja: string;
  posiljaocIme: string;
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
    FormsModule
  ],
  template: `
    <div class="razgovor-container" *ngIf="razgovor">
      <mat-card class="header-card">
        <div class="razgovor-header">
          <h2>{{ razgovor.kupacIme }} - {{ razgovor.majstorIme }}</h2>
          <p class="metadata">
            Započeto: {{ razgovor.datumKreiranja | date:'short' }}
          </p>
        </div>
      </mat-card>

      <mat-card class="messages-card">
        <div class="messages-list">
          <div *ngFor="let poruka of razgovor.poruke" 
               [ngClass]="{'message': true, 'own-message': poruka.posiljaocId === currentUserId, 'other-message': poruka.posiljaocId !== currentUserId}">
            <div class="message-header">
              <span class="sender-name">{{ poruka.posiljaocIme }}</span>
              <span class="time">{{ poruka.vrijemeSlanja | date:'short' }}</span>
            </div>
            <div class="message-content">
              {{ poruka.sadrzaj }}
            </div>
          </div>
        </div>
      </mat-card>

      <mat-card class="input-card">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Vaša poruka</mat-label>
          <textarea matInput 
                    [(ngModel)]="newMessage" 
                    placeholder="Upišite poruku..."
                    rows="3"></textarea>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="sendMessage()">
          <mat-icon>send</mat-icon> Pošalji
        </button>
      </mat-card>
    </div>

    <div *ngIf="!razgovor" class="loading">
      <p>Učitavanje razgovora...</p>
    </div>
  `,
  styles: [`
    .razgovor-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      height: calc(100vh - 100px);
    }

    .header-card {
      padding: 20px;
    }

    .razgovor-header h2 {
      margin: 0;
      color: #333;
    }

    .metadata {
      color: #999;
      margin: 10px 0 0 0;
      font-size: 0.9em;
    }

    .messages-card {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background-color: #f5f5f5;
    }

    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .message {
      margin-bottom: 10px;
    }

    .own-message {
      align-self: flex-end;
      max-width: 70%;
    }

    .own-message .message-content {
      background-color: #1976d2;
      color: white;
      border-radius: 12px 0 12px 12px;
    }

    .other-message {
      align-self: flex-start;
      max-width: 70%;
    }

    .other-message .message-content {
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 0 12px 12px 12px;
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;
      margin-bottom: 4px;
      font-size: 0.85em;
      color: #666;
    }

    .sender-name {
      font-weight: bold;
    }

    .time {
      margin-left: 10px;
    }

    .message-content {
      padding: 10px 12px;
      word-wrap: break-word;
    }

    .input-card {
      padding: 20px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }

    .full-width {
      width: 100%;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #999;
    }
  `]
})
export class RazgovorComponent implements OnInit {
  razgovor: RazgovorDetail | null = null;
  newMessage = '';
  currentUserId = 1; // TODO: Get from auth service

  constructor(private razgovorService: RazgovorService) {}

  ngOnInit() {
    const razgovorId = 1; // TODO: Get from route
    this.loadRazgovor(razgovorId);
  }

  loadRazgovor(razgovorId: number) {
    this.razgovorService.getRazgovor(razgovorId).subscribe({
      next: (data: any) => {
        this.razgovor = data;
      },
      error: (err: any) => {
        console.error('Greška pri učitavanju razgovora', err);
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.razgovor) return;

    this.razgovorService.sendMessage(this.razgovor.razgovorId, this.currentUserId, this.newMessage)
      .subscribe({
        next: () => {
          this.newMessage = '';
          this.loadRazgovor(this.razgovor!.razgovorId);
        },
        error: (err: any) => {
          console.error('Greška pri slanju poruke', err);
        }
      });
  }
}
