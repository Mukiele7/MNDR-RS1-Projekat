import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { UgovorService } from '../../services/ugovor.service';

interface Ugovor {
  ugovorId: number;
  kupacId: number;
  kupacIme: string;
  oglasId: number;
  oglasNaslov: string;
  datumOd: string;
  datumDo: string;
  cena: number;
  status: string;
  datumKreiranja: string;
}

@Component({
  selector: 'app-ugovori',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule
  ],
  template: `
    <div class="ugovori-container">
      <h2>Moji ugovori</h2>
      
      <!-- Sorting Controls -->
      <div class="sort-controls">
        <span>Sortiraj po:</span>
        <button mat-button [class.active]="sortBy === 'datumkreiranja'" (click)="sortUgovori('datumkreiranja')">
          Datum {{ sortBy === 'datumkreiranja' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
        </button>
        <button mat-button [class.active]="sortBy === 'status'" (click)="sortUgovori('status')">
          Status {{ sortBy === 'status' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
        </button>
        <button mat-button [class.active]="sortBy === 'cena'" (click)="sortUgovori('cena')">
          Cijena {{ sortBy === 'cena' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
        </button>
        <button mat-button [class.active]="sortBy === 'datumod'" (click)="sortUgovori('datumod')">
          Početak {{ sortBy === 'datumod' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
        </button>
      </div>
      
      <mat-tab-group>
        <mat-tab label="Aktivni">
          <div class="tab-content">
            <table mat-table [dataSource]="aktivniUgovori" class="ugovori-table">
              <ng-container matColumnDef="oglasNaslov">
                <th mat-header-cell *matHeaderCellDef>Oglas</th>
                <td mat-cell *matCellDef="let element">{{ element.oglasNaslov }}</td>
              </ng-container>

              <ng-container matColumnDef="kupacIme">
                <th mat-header-cell *matHeaderCellDef>Kupac</th>
                <td mat-cell *matCellDef="let element">{{ element.kupacIme }}</td>
              </ng-container>

              <ng-container matColumnDef="datumOd">
                <th mat-header-cell *matHeaderCellDef>Početak</th>
                <td mat-cell *matCellDef="let element">{{ element.datumOd | date:'short' }}</td>
              </ng-container>

              <ng-container matColumnDef="datumDo">
                <th mat-header-cell *matHeaderCellDef>Završetak</th>
                <td mat-cell *matCellDef="let element">{{ element.datumDo | date:'short' }}</td>
              </ng-container>

              <ng-container matColumnDef="cena">
                <th mat-header-cell *matHeaderCellDef>Cena</th>
                <td mat-cell *matCellDef="let element">{{ element.cena | number:'1.2-2' }} KM</td>
              </ng-container>

              <ng-container matColumnDef="akcije">
                <th mat-header-cell *matHeaderCellDef>Akcije</th>
                <td mat-cell *matCellDef="let element">
                  <button mat-icon-button color="primary" (click)="completeContract(element.ugovorId)">
                    <mat-icon>done</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="cancelContract(element.ugovorId)">
                    <mat-icon>close</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </mat-tab>

        <mat-tab label="Završeni">
          <div class="tab-content">
            <table mat-table [dataSource]="zavrseniUgovori" class="ugovori-table">
              <ng-container matColumnDef="oglasNaslov">
                <th mat-header-cell *matHeaderCellDef>Oglas</th>
                <td mat-cell *matCellDef="let element">{{ element.oglasNaslov }}</td>
              </ng-container>

              <ng-container matColumnDef="kupacIme">
                <th mat-header-cell *matHeaderCellDef>Kupac</th>
                <td mat-cell *matCellDef="let element">{{ element.kupacIme }}</td>
              </ng-container>

              <ng-container matColumnDef="cena">
                <th mat-header-cell *matHeaderCellDef>Cena</th>
                <td mat-cell *matCellDef="let element">{{ element.cena | number:'1.2-2' }} KM</td>
              </ng-container>

              <ng-container matColumnDef="datumKreiranja">
                <th mat-header-cell *matHeaderCellDef>Završeno</th>
                <td mat-cell *matCellDef="let element">{{ element.datumKreiranja | date:'short' }}</td>
              </ng-container>

              <ng-container matColumnDef="akcije">
                <th mat-header-cell *matHeaderCellDef>Akcije</th>
                <td mat-cell *matCellDef="let element">
                  <button mat-button color="primary" (click)="reviewContract(element.ugovorId)">
                    <mat-icon>rate_review</mat-icon> Recenzija
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="zavrseniColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: zavrseniColumns;"></tr>
            </table>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .ugovori-container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
    }

    .tab-content {
      padding: 20px 0;
    }

    .ugovori-table {
      width: 100%;
      border-collapse: collapse;
    }

    .ugovori-table th,
    .ugovori-table td {
      padding: 12px;
      text-align: left;
    }

    .ugovori-table tr:hover {
      background-color: #f5f5f5;
    }

    button {
      margin: 0 4px;
    }
    
    .sort-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 15px 0;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    
    .sort-controls span {
      font-weight: 500;
      color: #666;
    }
    
    .sort-controls button.active {
      background-color: #1976d2;
      color: white;
    }
  `]
})
export class UgovoriComponent implements OnInit {
  ugovori: Ugovor[] = [];
  aktivniUgovori: Ugovor[] = [];
  zavrseniUgovori: Ugovor[] = [];
  displayedColumns = ['oglasNaslov', 'kupacIme', 'datumOd', 'datumDo', 'cena', 'akcije'];
  zavrseniColumns = ['oglasNaslov', 'kupacIme', 'cena', 'datumKreiranja', 'akcije'];
  korisnikId = 1; // TODO: Get from auth service
  
  // Sorting
  sortBy: string = 'datumkreiranja';
  sortOrder: string = 'desc';

  constructor(private ugovorService: UgovorService) {}

  ngOnInit() {
    this.loadUgovori();
  }

  loadUgovori() {
    this.ugovorService.getUgovori(this.korisnikId, this.sortBy, this.sortOrder).subscribe({
      next: (data: any) => {
        this.ugovori = data;
        this.filterUgovori();
      },
      error: (err: any) => {
        console.error('Greška pri učitavanju ugovora', err);
      }
    });
  }

  sortUgovori(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'desc';
    }
    this.loadUgovori();
  }

  filterUgovori() {
    this.aktivniUgovori = this.ugovori.filter(u => u.status === 'Aktivan');
    this.zavrseniUgovori = this.ugovori.filter(u => u.status === 'Završen');
  }

  completeContract(ugovorId: number) {
    this.ugovorService.completeUgovor(ugovorId).subscribe({
      next: () => {
        this.loadUgovori();
      },
      error: (err: any) => {
        console.error('Greška pri završavanju ugovora', err);
      }
    });
  }

  cancelContract(ugovorId: number) {
    console.log('Otkaži ugovor', ugovorId);
  }

  reviewContract(ugovorId: number) {
    console.log('Napraviti recenziju za ugovor', ugovorId);
  }
}
