import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MajstorService } from '../../services/majstor.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { PortfolioCarouselComponent } from '../portfolio-carousel/portfolio-carousel.component';
import { PortfolioGalleryComponent } from '../portfolio-gallery/portfolio-gallery.component';

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
    MatDividerModule,
    PortfolioCarouselComponent,
    PortfolioGalleryComponent
  ],
  templateUrl: './majstor-profil.html',
  styleUrl: './majstor-profil.scss',
})
export class MajstorProfil implements OnInit {
  majstor: any = null;
  loading = true;
  error = false;
  isFavorite = false;
  majstorId!: number;
  isMenuOpen = false;
  showImageZoom = false;
  zoomLevel = 1;
  profileImages: { [key: number]: string } = {};
  currentKupacId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private majstorService: MajstorService,
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('MajstorProfil ngOnInit pozvan');
    
    // Dohvati trenutnog kupca
    const currentUser = this.authService.getCurrentUser();
    this.currentKupacId = currentUser?.korisnikId || null;
    
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      this.majstorId = +params['id'];
      console.log('MajstorId:', this.majstorId);
      if (this.majstorId && !isNaN(this.majstorId)) {
        this.loadMajstorProfile();
        if (this.currentKupacId) {
          this.checkIfFavorite();
        }
      } else {
        console.error('Invalidan majstorId');
        this.router.navigate(['/majstor']);
      }
    });
  }

  loadMajstorProfile(): void {
    console.log('Učitavanje profila za majstorId:', this.majstorId);
    this.loading = true;
    this.majstorService.getMajstorById(this.majstorId).subscribe({
      next: (data) => {
        console.log('Profil učitan:', data);
        this.majstor = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Greška pri učitavanju profila:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  checkIfFavorite(): void {
    if (!this.currentKupacId) return;
    
    this.favoritesService.getFavorites(this.currentKupacId).subscribe({
      next: (result) => {
        this.isFavorite = result.items.some(f => f.korisnikId === this.majstorId);
      },
      error: () => {
        this.isFavorite = false;
      }
    });
  }

  toggleFavorite(): void {
    if (!this.currentKupacId) {
      alert('Morate biti prijavljeni kao kupac da biste dodali u favorite');
      return;
    }
    
    if (this.isFavorite) {
      this.favoritesService.removeFavorite(this.currentKupacId, this.majstorId).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (err) => console.error('Greška pri uklanjanju iz favorita:', err)
      });
    } else {
      this.favoritesService.addFavorite(this.currentKupacId, this.majstorId).subscribe({
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

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  openImageZoom(): void {
    this.showImageZoom = true;
    this.zoomLevel = 1;
  }

  closeImageZoom(): void {
    this.showImageZoom = false;
    this.zoomLevel = 1;
  }

  zoomIn(): void {
    if (this.zoomLevel < 3) {
      this.zoomLevel += 0.25;
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.5) {
      this.zoomLevel -= 0.25;
    }
  }

  resetZoom(): void {
    this.zoomLevel = 1;
  }

  onImageError(event: any): void {
    event.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.majstor?.ime || 'M') + '&background=random&size=200';
  }
}
