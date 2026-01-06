import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface DashboardStats {
  totalOglasi: number;
  aktivniRazgovori: number;
  zavrseniUgovori: number;
  prosecnaOcena: number;
  stanjeSuma: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    RouterModule
  ],
  template: `
    <div class="dashboard-container">
      <h1>Dobrodošli u MNDR Marketplace</h1>
      
      <mat-grid-list cols="4" rowHeight="200px" gutterSize="20px">
        <!-- Oglasi Card -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-header>
              <mat-card-title>Moji Oglasi</mat-card-title>
              <mat-icon class="card-icon">local_offer</mat-icon>
            </mat-card-header>
            <mat-card-content>
              <div class="stat-number">{{ stats.totalOglasi }}</div>
              <p>Aktivnih oglasa</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" routerLink="/oglasi">Pogledaj sve</button>
            </mat-card-actions>
          </mat-card>
        </mat-grid-tile>

        <!-- Razgovori Card -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-header>
              <mat-card-title>Razgovori</mat-card-title>
              <mat-icon class="card-icon">chat_bubble</mat-icon>
            </mat-card-header>
            <mat-card-content>
              <div class="stat-number">{{ stats.aktivniRazgovori }}</div>
              <p>Aktivnih razgovora</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" [routerLink]="['/razgovori', 1]">Otvori</button>
            </mat-card-actions>
          </mat-card>
        </mat-grid-tile>

        <!-- Ugovori Card -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-header>
              <mat-card-title>Ugovori</mat-card-title>
              <mat-icon class="card-icon">assignment</mat-icon>
            </mat-card-header>
            <mat-card-content>
              <div class="stat-number">{{ stats.zavrseniUgovori }}</div>
              <p>Završenih ugovora</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" routerLink="/ugovori">Pregled</button>
            </mat-card-actions>
          </mat-card>
        </mat-grid-tile>

        <!-- Rating Card -->
        <mat-grid-tile>
          <mat-card class="stat-card">
            <mat-card-header>
              <mat-card-title>Rejting</mat-card-title>
              <mat-icon class="card-icon">star</mat-icon>
            </mat-card-header>
            <mat-card-content>
              <div class="stat-number">{{ stats.prosecnaOcena.toFixed(1) }}/5</div>
              <p>Prosečna ocena</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" routerLink="/recenzije">Pregled</button>
            </mat-card-actions>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <!-- Quick Actions -->
      <mat-card class="quick-actions-card">
        <mat-card-title>Brze akcije</mat-card-title>
        <mat-card-content>
          <div class="actions-grid">
            <button mat-raised-button color="primary" routerLink="/oglasi">
              <mat-icon>add_circle</mat-icon> Novi oglas
            </button>
            <button mat-raised-button color="accent" routerLink="/razgovori">
              <mat-icon>message</mat-icon> Poruke
            </button>
            <button mat-raised-button routerLink="/krediti">
              <mat-icon>account_balance_wallet</mat-icon> Krediti
            </button>
            <button mat-raised-button routerLink="/ugovori">
              <mat-icon>description</mat-icon> Ugovori
            </button>
            <button *ngIf="isMajstor()" mat-raised-button color="primary" [routerLink]="['/majstor/edit-profile', currentUserId]">
              <mat-icon>edit</mat-icon> Uredi Profil
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 20px auto;
      padding: 20px;
    }

    h1 {
      color: #333;
      margin-bottom: 30px;
      text-align: center;
    }

    .stat-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      position: relative;
    }

    .stat-card:nth-child(2) {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .stat-card:nth-child(4) {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 10px;
    }

    mat-card-title {
      color: white;
      font-size: 1.1em;
    }

    .card-icon {
      font-size: 2.5em;
      width: 2.5em;
      height: 2.5em;
      opacity: 0.7;
    }

    mat-card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .stat-number {
      font-size: 2.5em;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .stat-card p {
      margin: 0;
      opacity: 0.9;
    }

    mat-card-actions {
      margin-top: auto;
    }

    .stat-card button {
      color: white !important;
    }

    .quick-actions-card {
      margin-top: 30px;
      padding: 20px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }

    button {
      height: 50px;
      font-size: 1em;
    }

    button mat-icon {
      margin-right: 8px;
    }

    @media (max-width: 900px) {
      mat-grid-list {
        cols: 2 !important;
      }
    }

    @media (max-width: 600px) {
      mat-grid-list {
        cols: 1 !important;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalOglasi: 0,
    aktivniRazgovori: 0,
    zavrseniUgovori: 0,
    prosecnaOcena: 0,
    stanjeSuma: 0
  };

  currentUserId: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadStats();
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.korisnikId) {
      this.currentUserId = currentUser.korisnikId;
    }
  }

  isMajstor(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.uloga === 'Majstor';
  }

  loadStats() {
    // TODO: Implementirati servis za učitavanje statistike
    this.stats = {
      totalOglasi: 5,
      aktivniRazgovori: 3,
      zavrseniUgovori: 12,
      prosecnaOcena: 4.5,
      stanjeSuma: 250
    };
  }
}
