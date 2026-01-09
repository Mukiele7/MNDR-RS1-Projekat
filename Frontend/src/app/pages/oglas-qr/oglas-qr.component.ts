import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OglasService } from '../../services/oglas.service';

interface OglasDetails {
  oglasId: number;
  naslov: string;
  opis: string;
  datumObjave: string;
  status: string;
  majstorIme: string;
  kategorije: string[];
}

@Component({
  selector: 'app-oglas-qr',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="oglas-qr-container">
      <div *ngIf="loading" class="loading">
        <mat-spinner></mat-spinner>
        <p>Učitavanje oglasa...</p>
      </div>

      <div *ngIf="!loading && !oglas" class="error">
        <mat-icon>error_outline</mat-icon>
        <h2>Oglas nije pronađen</h2>
        <button mat-raised-button color="primary" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon> Nazad na oglase
        </button>
      </div>

      <mat-card *ngIf="!loading && oglas" class="oglas-card">
        <mat-card-header>
          <mat-card-title>{{ oglas.naslov }}</mat-card-title>
          <mat-card-subtitle>
            <mat-icon>person</mat-icon> {{ oglas.majstorIme }}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="info-section">
            <h3>Opis</h3>
            <p>{{ oglas.opis }}</p>
          </div>

          <div class="info-section">
            <h3>Kategorije</h3>
            <div class="kategorije">
              <span *ngFor="let kat of oglas.kategorije" class="kategorija-badge">
                {{ kat }}
              </span>
            </div>
          </div>

          <div class="info-section">
            <h3>Informacije</h3>
            <p>
              <mat-icon>calendar_today</mat-icon>
              <strong>Datum objave:</strong> {{ oglas.datumObjave | date:'dd.MM.yyyy' }}
            </p>
            <p>
              <mat-icon>info</mat-icon>
              <strong>Status:</strong> 
              <span [ngClass]="'status-' + oglas.status.toLowerCase()">{{ oglas.status }}</span>
            </p>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="contactMajstor()">
            <mat-icon>mail</mat-icon> Kontaktiraj majstora
          </button>
          <button mat-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon> Nazad
          </button>
        </mat-card-actions>
      </mat-card>

      <div class="qr-info" *ngIf="!loading && oglas">
        <mat-icon>qr_code_scanner</mat-icon>
        <p>Ovu stranicu ste posjetili skeniranjem QR koda</p>
      </div>
    </div>
  `,
  styles: [`
    .oglas-qr-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
    }

    .loading, .error {
      text-align: center;
      padding: 60px 20px;
    }

    .loading mat-spinner {
      margin: 0 auto 20px;
    }

    .error mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #f44336;
      margin-bottom: 20px;
    }

    .error h2 {
      color: #666;
      margin-bottom: 30px;
    }

    .oglas-card {
      margin-bottom: 20px;
    }

    mat-card-subtitle {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    mat-card-subtitle mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .info-section {
      margin: 20px 0;
    }

    .info-section h3 {
      color: #1976d2;
      margin-bottom: 10px;
      font-size: 1.1em;
    }

    .info-section p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 10px 0;
      color: #666;
    }

    .info-section mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #1976d2;
    }

    .kategorije {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .kategorija-badge {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 0.9em;
      font-weight: 500;
    }

    .status-aktivan {
      color: #4caf50;
      font-weight: bold;
    }

    .status-neaktivan {
      color: #f44336;
      font-weight: bold;
    }

    mat-card-actions {
      display: flex;
      gap: 10px;
      padding: 16px;
    }

    .qr-info {
      text-align: center;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .qr-info mat-icon {
      color: #1976d2;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .qr-info p {
      margin: 0;
      color: #666;
      font-size: 0.9em;
    }
  `]
})
export class OglasQrComponent implements OnInit {
  oglasId: number | null = null;
  oglas: OglasDetails | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private oglasService: OglasService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.oglasId = +params['id'];
      if (this.oglasId) {
        this.loadOglas();
      }
    });
  }

  loadOglas() {
    this.loading = true;
    this.oglasService.getOglasById(this.oglasId!).subscribe({
      next: (result: any) => {
        this.oglas = result;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Greška pri učitavanju oglasa', err);
        this.loading = false;
      }
    });
  }

  contactMajstor() {
    console.log('Kontaktiraj majstora za oglas', this.oglasId);
    // Implementiraj logiku za kontaktiranje
  }

  goBack() {
    this.router.navigate(['/oglasi']);
  }
}
