import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { OglasService } from '../../services/oglas.service';

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

  constructor(private oglasService: OglasService) {}

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
}
