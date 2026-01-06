import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { KreditService } from '../../services/kredit.service';

interface Kredit {
  kreditId: number;
  korisnikId: number;
  korisnikIme: string;
  kolicina: number;
  tip: string;
  datumTransakcije: string;
  status: string;
}

@Component({
  selector: 'app-krediti',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="krediti-container">
      <mat-card class="balance-card">
        <h2>Stanje Kredita</h2>
        <div class="balance-display">
          <div class="balance-amount">{{ currentBalance | number:'1.2-2' }} KM</div>
          <button mat-raised-button color="accent" (click)="openBuyCreditsDialog()">
            <mat-icon>add</mat-icon> Kupi kredite
          </button>
        </div>
      </mat-card>

      <mat-card class="transactions-card">
        <h3>Istorija transakcija</h3>
        <table mat-table [dataSource]="krediti" class="krediti-table">
          <!-- Date Column -->
          <ng-container matColumnDef="datumTransakcije">
            <th mat-header-cell *matHeaderCellDef>Datum</th>
            <td mat-cell *matCellDef="let element">{{ element.datumTransakcije | date:'short' }}</td>
          </ng-container>

          <!-- Type Column -->
          <ng-container matColumnDef="tip">
            <th mat-header-cell *matHeaderCellDef>Tip</th>
            <td mat-cell *matCellDef="let element">
              <span [ngClass]="'type-' + element.tip.toLowerCase()">{{ element.tip }}</span>
            </td>
          </ng-container>

          <!-- Amount Column -->
          <ng-container matColumnDef="kolicina">
            <th mat-header-cell *matHeaderCellDef>Iznos</th>
            <td mat-cell *matCellDef="let element">
              <span [ngClass]="element.tip === 'Uplata' ? 'positive' : 'negative'">
                {{ element.kolicina | number:'1.2-2' }}
              </span>
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let element">
              <span [ngClass]="'status-' + element.status.toLowerCase()">{{ element.status }}</span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .krediti-container {
      max-width: 1000px;
      margin: 20px auto;
      padding: 20px;
    }

    .balance-card {
      margin-bottom: 20px;
      padding: 30px;
      text-align: center;
    }

    .balance-card h2 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .balance-display {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 30px;
    }

    .balance-amount {
      font-size: 2.5em;
      font-weight: bold;
      color: #1976d2;
    }

    .transactions-card {
      padding: 20px;
    }

    .transactions-card h3 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .krediti-table {
      width: 100%;
    }

    .type-uplata {
      color: #4caf50;
      font-weight: bold;
    }

    .type-trošak {
      color: #f44336;
      font-weight: bold;
    }

    .positive {
      color: #4caf50;
    }

    .negative {
      color: #f44336;
    }

    .status-završena {
      background-color: #c8e6c9;
      padding: 4px 8px;
      border-radius: 4px;
      color: #2e7d32;
    }

    .status-u_toku {
      background-color: #fff9c4;
      padding: 4px 8px;
      border-radius: 4px;
      color: #f57f17;
    }
  `]
})
export class KreditiComponent implements OnInit {
  krediti: Kredit[] = [];
  currentBalance = 0;
  displayedColumns: string[] = ['datumTransakcije', 'tip', 'kolicina', 'status'];
  korisnikId = 1; // TODO: Get from auth service

  constructor(private kreditService: KreditService) {}

  ngOnInit() {
    this.loadKrediti();
  }

  loadKrediti() {
    this.kreditService.getKrediti(this.korisnikId).subscribe({
      next: (data: any) => {
        this.krediti = data;
        this.calculateBalance();
      },
      error: (err: any) => {
        console.error('Greška pri učitavanju kredita', err);
      }
    });
  }

  calculateBalance() {
    this.currentBalance = this.krediti.reduce((acc, k) => {
      return k.tip === 'Uplata' ? acc + k.kolicina : acc - k.kolicina;
    }, 0);
  }

  openBuyCreditsDialog() {
    console.log('Otvori dialog za kupovinu kredita');
  }
}
