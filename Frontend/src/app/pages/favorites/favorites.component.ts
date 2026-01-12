import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  newsletterEmail: string = '';
  isMenuOpen: boolean = false;
  
  favoriteMajstori: any[] = [];
  isLoading: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 12;
  totalCount: number = 0;

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Check if user is logged in as Kupac
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || !currentUser.korisnikId) {
      alert('Morate biti prijavljeni da biste pristupili favoritima.');
      this.router.navigate(['/login']);
      return;
    }

    // Check if user has Kupac role
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'Kupac') {
      alert('Samo kupci mogu pristupiti favoritima.');
      this.router.navigate(['/']);
      return;
    }

    this.loadFavorites();
  }

  loadFavorites(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || !currentUser.korisnikId) {
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.favoritesService.getFavorites(currentUser.korisnikId, this.pageNumber, this.pageSize)
      .subscribe({
        next: (response) => {
          this.favoriteMajstori = response.items;
          this.totalCount = response.totalCount;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Greška pri učitavanju favorita:', error);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  removeFavorite(majstor: any): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || !currentUser.korisnikId) {
      alert('Morate biti prijavljeni da biste upravljali favoritima.');
      return;
    }

    if (confirm(`Da li ste sigurni da želite ukloniti ${majstor.ime} ${majstor.prezime} iz favorita?`)) {
      this.favoritesService.removeFavorite(currentUser.korisnikId, majstor.korisnikId)
        .subscribe({
          next: () => {
            this.loadFavorites();
          },
          error: (error) => {
            console.error('Greška pri uklanjanju favorita:', error);
            alert('Došlo je do greške pri uklanjanju favorita.');
          }
        });
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  subscribeNewsletter(): void {
    if (this.newsletterEmail) {
      console.log('Newsletter subscription:', this.newsletterEmail);
      alert('Hvala na pretplati!');
      this.newsletterEmail = '';
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
