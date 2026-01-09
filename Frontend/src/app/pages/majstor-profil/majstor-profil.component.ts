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
import { PortfolioGalleryComponent } from '../portfolio-gallery/portfolio-gallery.component';
import { PortfolioCarouselComponent } from '../portfolio-carousel/portfolio-carousel.component';

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
  
  // Portfolio images (mock data for now)
  portfolioImages: any[] = [];
  
  // Profile images by majstorId
  profileImages: { [key: number]: string } = {
    1: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    2: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    3: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    4: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    5: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  };
  
  // Mock portfolio data by majstorId
  portfolioData: { [key: number]: any[] } = {
    1: [
      { url: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800', alt: 'Renovacija dnevne sobe', description: 'Kompletna renovacija dnevne sobe sa modernim dizajnom' },
      { url: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800', alt: 'Kuhinja', description: 'Moderna kuhinja po mjeri sa kvalitetnim materijalima' },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', alt: 'Kupatilo', description: 'Luksuzno kupatilo sa hidromasažnom kadom' },
      { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', alt: 'Spavaća soba', description: 'Elegantna spavaća soba sa garderoberom' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', alt: 'Terasa', description: 'Uređenje terase sa drvenim podom' }
    ],
    2: [
      { url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800', alt: 'Električne instalacije', description: 'Kompletna električna instalacija u novogradnji' },
      { url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800', alt: 'LED rasvjeta', description: 'Montaža LED rasvjete u poslovnom prostoru' },
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'Smart home', description: 'Instalacija smart home sistema sa kontrolom osvjetljenja' },
      { url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800', alt: 'Elektro orman', description: 'Profesionalno montiran elektro orman' },
      { url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800', alt: 'Solarne ploče', description: 'Instalacija solarnih panela na krovu kuće' },
      { url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800', alt: 'Elektro revizija', description: 'Kompletna revizija električne instalacije' }
    ],
    3: [
      { url: 'https://images.unsplash.com/photo-1607400201515-c2c41c07d307?w=800', alt: 'Vodovodne instalacije', description: 'Moderna vodovodna instalacija u stambenoj zgradi' },
      { url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800', alt: 'Grijanje', description: 'Centralno grijanje sa podnim sistemom' },
      { url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800', alt: 'Sanitarije', description: 'Montaža sanitarija i armatura' },
      { url: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=800', alt: 'Bojler', description: 'Instalacija termičkog bojlera' }
    ]
  };
  
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
        this.loadPortfolioImages();
      } else {
        console.error('Invalidan majstorId');
        this.router.navigate(['/majstor']);
      }
    });
  }

  loadPortfolioImages(): void {
    // Load portfolio images based on majstorId
    this.portfolioImages = this.portfolioData[this.majstorId] || this.portfolioData[1];
    console.log('Portfolio images loaded:', this.portfolioImages.length);
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
