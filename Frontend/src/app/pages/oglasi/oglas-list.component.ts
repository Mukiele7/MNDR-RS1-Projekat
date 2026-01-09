import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { OglasService } from '../../services/oglas.service';
import { QRCodeModule } from 'angularx-qrcode';

interface Oglas {
  oglasId: number;
  naslov: string;
  opis: string;
  datumObjave: string;
  status: string;
  majstorIme: string;
  kategorije: string[];
}

interface PagedResult {
  items: Oglas[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

@Component({
  selector: 'app-oglas-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    QRCodeModule,
    FormsModule
  ],
  template: `
    <div class="oglas-container">
      <h2>Dostupni oglasi</h2>
      
      <mat-card class="filter-card">
        <div class="filter-row">
          <mat-form-field appearance="outline">
            <mat-label>Pretraga</mat-label>
            <input matInput [(ngModel)]="searchTerm" placeholder="Pretraži oglase...">
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <input matInput [(ngModel)]="statusFilter" placeholder="Filtera po statusu...">
          </mat-form-field>
          
          <button mat-raised-button color="primary" (click)="onFilterChange()">
            <mat-icon>search</mat-icon> Pretraži
          </button>
        </div>
        
        <!-- Sorting Controls -->
        <div class="sort-controls">
          <span>Sortiraj po:</span>
          <button mat-button [class.active]="sortBy === 'datumobjave'" (click)="sortOglasi('datumobjave')">
            Datum {{ sortBy === 'datumobjave' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
          </button>
          <button mat-button [class.active]="sortBy === 'naslov'" (click)="sortOglasi('naslov')">
            Naslov {{ sortBy === 'naslov' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
          </button>
          <button mat-button [class.active]="sortBy === 'status'" (click)="sortOglasi('status')">
            Status {{ sortBy === 'status' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
          </button>
        </div>
      </mat-card>

      <mat-card class="data-card">
        <div *ngIf="loading" class="loading">
          <p>Učitavanje...</p>
        </div>

        <div *ngIf="!loading && oglasi.length === 0" class="no-data">
          <p>Nema dostupnih oglasa</p>
        </div>

        <div *ngIf="!loading && oglasi.length > 0" class="oglas-grid">
          <mat-card *ngFor="let oglas of oglasi" class="oglas-card">
            <mat-card-header>
              <mat-card-title>{{ oglas.naslov }}</mat-card-title>
              <mat-card-subtitle>{{ oglas.majstorIme }}</mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <p>{{ oglas.opis }}</p>
              <div class="kategorije">
                <span *ngFor="let kat of oglas.kategorije" class="kategorija-badge">
                  {{ kat }}
                </span>
              </div>
              <p class="metadata">
                <small>Objavljeno: {{ oglas.datumObjave | date:'short' }}</small>
                <br>
                <small [ngClass]="'status-' + oglas.status.toLowerCase()">
                  Status: {{ oglas.status }}
                </small>
              </p>
            </mat-card-content>
            
            <mat-card-actions>
              <button mat-button color="primary" (click)="viewDetails(oglas.oglasId)">
                <mat-icon>info</mat-icon> Detalji
              </button>
              <button mat-button color="accent" (click)="startConversation(oglas.oglasId)">
                <mat-icon>mail</mat-icon> Kontaktiraj
              </button>
              <button mat-button color="warn" (click)="openQRCodeDialog(oglas)">
                <mat-icon>qr_code</mat-icon> QR Code
              </button>
            </mat-card-actions>
          </mat-card>
        </div>

        <mat-paginator
          *ngIf="!loading && totalCount > 0"
          [length]="totalCount"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 25, 50]"
          (page)="onPageChange($event)"
        ></mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .oglas-container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
    }

    .filter-card {
      margin-bottom: 20px;
      padding: 20px;
    }

    .filter-row {
      display: flex;
      gap: 15px;
      align-items: end;
      flex-wrap: wrap;
    }

    mat-form-field {
      flex: 1;
      min-width: 200px;
    }

    .data-card {
      padding: 20px;
    }

    .oglas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .oglas-card {
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .oglas-card:hover {
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      transform: translateY(-4px);
    }

    .kategorije {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 10px 0;
    }

    .kategorija-badge {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.85em;
    }

    .metadata {
      color: #666;
      margin-top: 10px;
    }

    .status-aktivan {
      color: #4caf50;
      font-weight: bold;
    }

    .status-neaktivan {
      color: #f44336;
      font-weight: bold;
    }

    .loading, .no-data {
      text-align: center;
      padding: 40px;
      color: #999;
    }
    
    .sort-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e0e0e0;
    }
    
    .sort-controls span {
      font-weight: 500;
      color: #666;
    }
    
    .sort-controls button.active {
      background-color: #1976d2 !important;
      color: white !important;
    }
  `]
})
export class OglasListComponent implements OnInit {
  oglasi: Oglas[] = [];
  totalCount = 0;
  pageSize = 10;
  currentPage = 1;
  loading = false;
  searchTerm = '';
  statusFilter = '';
  
  // Sorting
  sortBy: string = 'datumobjave';
  sortOrder: string = 'desc';

  constructor(
    private oglasService: OglasService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadOglasi();
  }

  loadOglasi() {
    this.loading = true;
    this.oglasService.getOglasi(
      this.currentPage, 
      this.pageSize, 
      this.statusFilter, 
      this.searchTerm,
      this.sortBy,
      this.sortOrder
    ).subscribe({
        next: (result: any) => {
          this.oglasi = result.items;
          this.totalCount = result.totalCount;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Greška pri učitavanju oglasa', err);
          this.loading = false;
        }
      });
  }

  sortOglasi(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'desc';
    }
    this.loadOglasi();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadOglasi();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadOglasi();
  }

  viewDetails(oglasId: number) {
    console.log('Prikazi detalje oglasa', oglasId);
  }

  startConversation(oglasId: number) {
    console.log('Početak razgovora za oglas', oglasId);
  }

  openQRCodeDialog(oglas: Oglas) {
    this.dialog.open(QRCodeDialogComponent, {
      width: '400px',
      data: oglas
    });
  }
}

// QR Code Dialog Component
@Component({
  selector: 'app-qr-code-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    QRCodeModule
  ],
  template: `
    <h2 mat-dialog-title>QR Kod za Oglas</h2>
    <mat-dialog-content>
      <div class="qr-info">
        <h3>{{ data.naslov }}</h3>
        <p>{{ data.opis }}</p>
      </div>
      <div class="qr-container">
        <qrcode 
          [qrdata]="qrData" 
          [width]="256" 
          [errorCorrectionLevel]="'M'"
          #qrcode
        ></qrcode>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="shareQRCode()">
        <mat-icon>share</mat-icon> Podijeli
      </button>
      <button mat-raised-button color="primary" (click)="downloadQRCode()">
        <mat-icon>download</mat-icon> Preuzmi
      </button>
      <button mat-button mat-dialog-close>Zatvori</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .qr-info {
      text-align: center;
      margin-bottom: 20px;
    }
    .qr-info h3 {
      margin: 0;
      color: #333;
    }
    .qr-info p {
      color: #666;
      font-size: 0.9em;
      margin: 10px 0;
    }
    .qr-container {
      display: flex;
      justify-content: center;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    mat-dialog-actions {
      margin-top: 20px;
    }
  `]
})
export class QRCodeDialogComponent {
  qrData: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Oglas
  ) {
    // Kreiranje URL-a za oglas
    this.qrData = `${window.location.origin}/oglasi/${data.oglasId}`;
  }

  downloadQRCode() {
    const qrCodeElement = document.querySelector('qrcode canvas') as HTMLCanvasElement;
    if (qrCodeElement) {
      const url = qrCodeElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `oglas-${this.data.oglasId}-qrcode.png`;
      link.click();
    }
  }

  async shareQRCode() {
    const qrCodeElement = document.querySelector('qrcode canvas') as HTMLCanvasElement;
    if (qrCodeElement) {
      qrCodeElement.toBlob(async (blob) => {
        if (blob && navigator.share) {
          try {
            const file = new File([blob], `oglas-${this.data.oglasId}-qrcode.png`, { type: 'image/png' });
            await navigator.share({
              files: [file],
              title: this.data.naslov,
              text: `Pogledaj ovaj oglas: ${this.data.naslov}`
            });
          } catch (err) {
            console.error('Greška pri dijeljenju:', err);
            this.fallbackShare();
          }
        } else {
          this.fallbackShare();
        }
      });
    }
  }

  private fallbackShare() {
    // Fallback ako Web Share API nije dostupan
    const shareUrl = this.qrData;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      alert('Link kopiran u clipboard!');
    }
  }
}

// Dodaj import za Inject i MAT_DIALOG_DATA na vrh fajla
