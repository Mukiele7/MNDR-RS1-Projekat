import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MajstorService } from '../../services/majstor.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { PortfolioGalleryComponent } from '../portfolio-gallery/portfolio-gallery.component';
import { PortfolioCarouselComponent } from '../portfolio-carousel/portfolio-carousel.component';
import { environment } from '../../../environments/environment';

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
    CarouselModule,
    PortfolioGalleryComponent,
    PortfolioCarouselComponent
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
  showImageZoom = false;
  zoomLevel = 1;
  isMenuOpen = false;
  isDropdownOpen = false;
  
  carouselOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['<i class="material-icons">chevron_left</i>', '<i class="material-icons">chevron_right</i>'],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 3
      }
    },
    nav: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private majstorService: MajstorService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  get currentUser() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      return currentUser;
    }

    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('token') && !!this.currentUser;
  }

  get profileRoute(): string {
    const user = this.currentUser;
    if (user?.uloga === 'Administrator' || user?.role === 'Administrator') {
      return '/admin';
    }
    if (user?.uloga === 'Majstor') {
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
      return `${environment.apiRoot}${user.slikaProfila}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${user?.ime || 'K'}+${user?.prezime || 'K'}`
    )}&size=200&background=13ab24&color=ffffff&bold=true`;
  }

  logout(): void {
    this.isDropdownOpen = false;
    this.authService.logout();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.majstorId = +params['id'];
      if (this.majstorId && !isNaN(this.majstorId)) {
        this.loadMajstorProfile();
        if (this.currentUser?.uloga === 'Kupac') {
          this.checkIfFavorite();
        }
        this.loadPortfolioImages();
      } else {
        console.error('Invalidan majstorId');
        this.router.navigate(['/majstor']);
      }
    });
  }

  loadPortfolioImages(): void {
    // Portfolio is loaded by the dedicated API-backed child components.
  }

  loadMajstorProfile(): void {
    this.error = false;
    this.cdr.detectChanges();
    
    this.majstorService.getMajstorById(this.majstorId).subscribe({
      next: (data) => {
        this.majstor = data;
        this.loading = false;
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
    const currentUser = this.currentUser;
    if (currentUser?.uloga !== 'Kupac' || !currentUser.korisnikId) {
      return;
    }

    const currentKupacId = currentUser.korisnikId;
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
    const currentUser = this.currentUser;
    if (currentUser?.uloga !== 'Kupac' || !currentUser.korisnikId) {
      return;
    }

    const currentKupacId = currentUser.korisnikId;
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

  goBack(): void {
    this.router.navigate(['/majstor']);
  }

  contactMajstor(): void {
    const user = this.currentUser;
    if (!user || user.uloga !== 'Kupac') {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/razgovori'], {
      queryParams: { majstorId: this.majstorId }
    });
  }

  createContract(): void {
    if (this.currentUser?.uloga !== 'Kupac') {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/ugovori'], {
      queryParams: { oglasId: this.majstor?.oglasId ?? null, majstorId: this.majstorId }
    });
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

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  onImageError(event: any): void {
    console.error('Image load error, falling back to UI Avatars');
    const firstName = this.majstor?.ime || 'M';
    const lastName = this.majstor?.prezime || 'M';
    event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + '+' + lastName)}&size=200&background=13ab24&color=ffffff&bold=true`;
  }
}
