import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecenzijaService } from '../../services/recenzija.service';
import { AuthService } from '../../services/auth.service';

interface Recenzija {
  recenzijaId: number;
  kupacId: number;
  kupacIme: string;
  ocena: number;
  komentar: string;
  datumRecenzije: string;
}

@Component({
  selector: 'app-recenzije',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="recenzije-container">
      <h2>Recenzije ({{ averageRating.toFixed(1) }}/5.0)</h2>
      
      <mat-card class="add-review-card" [formGroup]="reviewForm">
        <h3>Dodaj recenziju</h3>
        <div class="form-group">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Ocena (1-5)</mat-label>
            <mat-select formControlName="ocena">
              <mat-option value="1">⭐ Loše</mat-option>
              <mat-option value="2">⭐⭐ Prihvatljivo</mat-option>
              <mat-option value="3">⭐⭐⭐ Dobro</mat-option>
              <mat-option value="4">⭐⭐⭐⭐ Odličnog</mat-option>
              <mat-option value="5">⭐⭐⭐⭐⭐ Izvanredno</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Komentar</mat-label>
          <textarea matInput 
                    formControlName="komentar"
                    placeholder="Unesite svoj komentar..."
                    rows="3"></textarea>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="submitReview()">
          Pošalji recenziju
        </button>
      </mat-card>

      <div class="reviews-list">
        <mat-card *ngFor="let recenzija of recenzije" class="review-card">
          <div class="review-header">
            <div class="reviewer-info">
              <h4>{{ recenzija.kupacIme }}</h4>
              <div class="stars">
                <mat-icon *ngFor="let i of [1,2,3,4,5]; let last = last"
                  [class.filled]="i <= recenzija.ocena">
                  {{ i <= recenzija.ocena ? 'star' : 'star_border' }}
                </mat-icon>
              </div>
            </div>
            <span class="review-date">{{ recenzija.datumRecenzije | date:'short' }}</span>
          </div>
          <p class="review-comment">{{ recenzija.komentar }}</p>
        </mat-card>
      </div>

      <div *ngIf="recenzije.length === 0" class="no-reviews">
        <p>Nema recenzija za ovog majstora</p>
      </div>
    </div>
  `,
  styles: [`
    .recenzije-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
    }

    .add-review-card {
      margin-bottom: 30px;
      padding: 20px;
    }

    .add-review-card h3 {
      margin-top: 0;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .review-card {
      padding: 15px;
      border-left: 4px solid #1976d2;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 10px;
    }

    .reviewer-info h4 {
      margin: 0 0 5px 0;
      color: #333;
    }

    .review-date {
      color: #999;
      font-size: 0.9em;
    }

    .review-comment {
      color: #555;
      line-height: 1.5;
      margin: 10px 0 0 0;
    }

    .no-reviews {
      text-align: center;
      padding: 40px;
      color: #999;
    }
  `]
})
export class RecenzijeComponent implements OnInit {
  recenzije: Recenzija[] = [];
  majstorId = 0;
  averageRating = 0;

  reviewForm: FormGroup;

  constructor(
    private recenzijaService: RecenzijaService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.reviewForm = this.formBuilder.group({
      ugovorId: [0, [Validators.required, Validators.min(1)]],
      ocena: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      komentar: ['', [Validators.required, Validators.maxLength(2000)]]
    });
  }

  ngOnInit() {
    this.majstorId = this.authService.getCurrentUser()?.userId ?? 0;
    if (!this.majstorId) {
      return;
    }
    this.loadRecenzije();
  }

  loadRecenzije() {
    this.recenzijaService.getRecenzije(this.majstorId).subscribe({
      next: (data: any) => {
        this.recenzije = data;
        this.calculateAverageRating();
      },
      error: (err: any) => {
        console.error('Greška pri učitavanju recenzija', err);
      }
    });
  }

  calculateAverageRating() {
    if (this.recenzije.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.recenzije.reduce((acc, r) => acc + r.ocena, 0);
    this.averageRating = sum / this.recenzije.length;
  }

  submitReview() {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const review = this.reviewForm.getRawValue();

    this.recenzijaService.createRecenzija(
      review.ugovorId,
      review.ocena,
      review.komentar
    ).subscribe({
      next: () => {
        this.reviewForm.reset({ ugovorId: 0, ocena: 5, komentar: '' });
        this.loadRecenzije();
      },
      error: (err: any) => {
        console.error('Greška pri dodavanju recenzije', err);
      }
    });
  }
}
