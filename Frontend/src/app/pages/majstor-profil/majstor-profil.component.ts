import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MajstorService } from '../../services/majstor.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-majstor-profil',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './majstor-profil.html',
  styleUrl: './majstor-profil.scss',
})
export class MajstorProfilComponent implements OnInit {
  majstor: any = null;
  loading = true;
  error = false;
  isFavorite = false;
  majstorId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private majstorService: MajstorService,
    private favoritesService: FavoritesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('MajstorProfil ngOnInit pozvan');
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      this.majstorId = +params['id'];
      console.log('MajstorId:', this.majstorId);
      if (this.majstorId && !isNaN(this.majstorId)) {
        this.loadMajstorProfile();
        this.checkIfFavorite();
      } else {
        console.error('Invalidan majstorId');
        this.router.navigate(['/majstor']);
      }
    });
  }

  loadMajstorProfile(): void {
    console.log('Učitavanje profila za majstorId:', this.majstorId);
    this.error = false;
    this.cdr.detectChanges();
    
    this.majstorService.getMajstorById(this.majstorId).subscribe({
      next: (data) => {
        console.log('Profil učitan:', data);
        this.majstor = data;
        this.loading = false;
        console.log('Loading flag postavljen na false');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Greška pri učitavanju profila:', err);
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges()
        this.loading = false;
      }
    });
  }

  checkIfFavorite(): void {
    // TODO: Get current user's kupacId from auth service
    const currentKupacId = 1; // Temporary hardcoded value
    this.favoritesService.isFavorite(currentKupacId, this.majstorId).subscribe({
      next: (result) => {
        this.isFavorite = result;
      },
      error: () => {
        this.isFavorite = false;
      }
    });
  }

  toggleFavorite(): void {
    const currentKupacId = 1; // Temporary hardcoded value
    if (this.isFavorite) {
      this.favoritesService.removeFavorite(currentKupacId, this.majstorId).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (err) => console.error('Greška pri uklanjanju iz favorita:', err)
      });
    } else {
      this.favoritesService.addFavorite(currentKupacId, this.majstorId).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (err) => console.error('Greška pri dodavanju u favorite:', err)
      });
    }
  }

  getDefaultAvatar(): string {
    return 'assets/default-avatar.png';
  }

  goBack(): void {
    this.router.navigate(['/majstor']);
  }

  contactMajstor(): void {
    // TODO: Navigate to chat or contact form
    alert('Funkcionalnost kontaktiranja će biti implementirana uskoro');
  }

  createContract(): void {
    // TODO: Navigate to contract creation
    alert('Funkcionalnost kreiranja ugovora će biti implementirana uskoro');
  }
}
