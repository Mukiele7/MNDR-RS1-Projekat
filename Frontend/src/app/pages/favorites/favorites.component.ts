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
  isDropdownOpen = false;
  
  favoriteMajstori: any[] = [];
  isLoading: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 12;
  totalCount: number = 0;
  isAuthorized = false;

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get profileRoute(): string {
    const user = this.currentUser;
    if (user?.uloga === 'Administrator' || user?.role === 'Administrator') {
      return '/admin';
    }
    if (user?.uloga === 'Majstor' || user?.role === 'Majstor') {
      return `/majstor/${user.korisnikId ?? user.userId}`;
    }
    return '/kupac/moj-profil';
  }

  get isAdmin(): boolean {
    const user = this.currentUser;
    return user?.uloga === 'Administrator' || user?.role === 'Administrator';
  }

  getProfileImage(): string {
    const user = this.currentUser;
    if (user?.slikaProfila) {
      return `http://localhost:5017${user.slikaProfila}`;
    }
    const name = `${user?.ime ?? 'K'}+${user?.prezime ?? 'K'}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=13ab24&color=ffffff&bold=true`;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngOnInit(): void {
    this.clearFavorites();

    // Check if user is logged in as Kupac
    const currentUser = this.authService.getCurrentUser();
    
    if (!this.authService.isAuthenticated() || !currentUser || !currentUser.korisnikId) {
      alert('Morate biti prijavljeni da biste pristupili favoritima.');
      this.router.navigate(['/login']);
      return;
    }

    // Read the role from the same session object that AuthService stores on login.
    const userRole = currentUser.uloga ?? currentUser.role;
    if (userRole !== 'Kupac') {
      alert('Samo kupci mogu pristupiti favoritima.');
      this.router.navigate(['/']);
      return;
    }

    this.isAuthorized = true;
    this.loadFavorites();
  }

  loadFavorites(): void {
    const currentUser = this.authService.getCurrentUser();
    const userRole = currentUser?.uloga ?? currentUser?.role;
    
    if (
      !this.authService.isAuthenticated() ||
      !currentUser ||
      userRole !== 'Kupac' ||
      !currentUser.korisnikId
    ) {
      this.clearFavorites();
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

  private clearFavorites(): void {
    this.isAuthorized = false;
    this.favoriteMajstori = [];
    this.totalCount = 0;
    this.isLoading = false;
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

  logout(): void {
    this.isDropdownOpen = false;
    this.authService.logout();
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
