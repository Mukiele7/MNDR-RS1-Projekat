import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MajstorService } from '../../services/majstor.service';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-landing-majstor',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './landing-majstor.component.html',
  styleUrl: './landing-majstor.component.scss'
})
export class LandingMajstorComponent implements OnInit {
  newsletterEmail: string = '';
  isMenuOpen: boolean = false;
  Math = Math; // For template

  // Filter properties
  filters = {
    specijalizacija: '',
    grad: '',
    minOcjena: null as number | null,
    minGodineIskustva: null as number | null,
    maxCijena: null as number | null
  };

  // Sorting properties
  sortBy: string = '';
  sortOrder: string = 'asc';
  currentSortLabel: string = 'Standardno';
  
  sortOptions = [
    { value: 'ime-asc', label: 'Ime (A-Z)', sortBy: 'ime', sortOrder: 'asc' },
    { value: 'ime-desc', label: 'Ime (Z-A)', sortBy: 'ime', sortOrder: 'desc' },
    { value: 'ocjena-desc', label: 'Ocjena (najviša)', sortBy: 'prosjecnaocjena', sortOrder: 'desc' },
    { value: 'ocjena-asc', label: 'Ocjena (najniža)', sortBy: 'prosjecnaocjena', sortOrder: 'asc' },
    { value: 'iskustvo-desc', label: 'Iskustvo (najviše)', sortBy: 'godineiskustva', sortOrder: 'desc' },
    { value: 'iskustvo-asc', label: 'Iskustvo (najmanje)', sortBy: 'godineiskustva', sortOrder: 'asc' },
    { value: 'cijena-asc', label: 'Cijena (najniža)', sortBy: 'cijenamjesecne', sortOrder: 'asc' },
    { value: 'cijena-desc', label: 'Cijena (najviša)', sortBy: 'cijenamjesecne', sortOrder: 'desc' }
  ];

  // Paging properties
  majstori: any[] = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 9;
  isLoading: boolean = false;
  hasSearched: boolean = false;
  favoriteStatuses: Map<number, boolean> = new Map();

  constructor(
    private majstorService: MajstorService,
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // Ne učitavaj automatski - čekaj da korisnik klikne na pretragu
  }

  loadMajstori(): void {
    this.isLoading = true;
    this.hasSearched = true;
    this.majstorService.getMajstori(
      this.pageNumber,
      this.pageSize,
      this.filters.specijalizacija || undefined,
      this.filters.minOcjena || undefined,
      this.filters.grad || undefined,
      this.filters.minGodineIskustva || undefined,
      this.filters.maxCijena || undefined,
      this.sortBy || undefined,
      this.sortOrder
    ).subscribe({
      next: (response) => {
        this.majstori = [...response.items];
        this.totalCount = response.totalCount;
        this.isLoading = false;
        this.loadFavoriteStatuses();
        setTimeout(() => this.cdr.detectChanges(), 0);
      },
      error: (error) => {
        console.error('Greška pri učitavanju majstora:', error);
        this.isLoading = false;
      }
    });
  }

  sortMajstori(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.loadMajstori();
  }
  
  applySorting(option: any): void {
    this.sortBy = option.sortBy;
    this.sortOrder = option.sortOrder;
    this.currentSortLabel = option.label;
    
    if (this.hasSearched) {
      this.loadMajstori();
    }
  }

  searchMajstori(): void {
    this.pageNumber = 1;
    this.loadMajstori();
  }

  resetFilters(): void {
    this.filters = {
      specijalizacija: '',
      grad: '',
      minOcjena: null,
      minGodineIskustva: null,
      maxCijena: null
    };
    this.pageNumber = 1;
    this.loadMajstori();
  }

  quickFilter(specijalizacija: string): void {
    this.filters.specijalizacija = specijalizacija;
    this.pageNumber = 1;
    this.loadMajstori();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  features = [
    {
      icon: '🎯',
      title: 'Pronađi Posao',
      description: 'Pristupaj stotinama oglasa dnevno. Biraj projekte koji odgovaraju tvojim veštinama.'
    },
    {
      icon: '📊',
      title: 'Gradi Profil',
      description: 'Prikaži svoje radove, recenzije i sertifikate. Dokaži svoju stručnost.'
    },
    {
      icon: '💰',
      title: 'Zaradjuj Više',
      description: 'Dobij fer cenu za svoj rad. Bez skrivenih troškova ili provizija.'
    },
    {
      icon: '📱',
      title: 'Jednostavna Komunikacija',
      description: 'Razgovaraj direktno sa klijentima kroz našu platformu.'
    },
    {
      icon: '✅',
      title: 'Sigurni Ugovori',
      description: 'Zaštiti sebe formalnim ugovorima za svaki projekat.'
    },
    {
      icon: '⭐',
      title: 'Sistem Recenzija',
      description: 'Dobij zaslužene ocene i gradi svoju reputaciju.'
    }
  ];

  subscribeNewsletter() {
    if (this.newsletterEmail) {
      console.log('Newsletter subscription:', this.newsletterEmail);
      alert('Hvala na pretplati!');
      this.newsletterEmail = '';
    }
  }

  isCurrentUserMajstor(korisnikId: number): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.korisnikId === korisnikId;
  }

  loadFavoriteStatuses(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.uloga !== 'Kupac' || !currentUser.korisnikId) {
      return;
    }

    this.majstori.forEach(majstor => {
      this.favoritesService.isFavorite(currentUser.korisnikId!, majstor.korisnikId)
        .subscribe({
          next: (isFavorite) => {
            this.favoriteStatuses.set(majstor.korisnikId, isFavorite);
          },
          error: (error) => {
            console.error('Greška pri provjeri favorita:', error);
          }
        });
    });
  }

  isFavorite(majstorId: number): boolean {
    return this.favoriteStatuses.get(majstorId) || false;
  }

  toggleFavorite(majstor: any, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('Opcija dostupna samo prijavljenim korisnicima');
      return;
    }
    
    if (currentUser.uloga !== 'Kupac' || !currentUser.korisnikId) {
      alert('Samo kupci mogu dodavati omiljene majstore.');
      return;
    }

    const isFav = this.isFavorite(majstor.korisnikId);
    
    if (isFav) {
      this.favoritesService.removeFavorite(currentUser.korisnikId!, majstor.korisnikId)
        .subscribe({
          next: () => {
            this.favoriteStatuses.set(majstor.korisnikId, false);
          },
          error: (error) => {
            console.error('Greška pri uklanjanju favorita:', error);
          }
        });
    } else {
      this.favoritesService.addFavorite(currentUser.korisnikId!, majstor.korisnikId)
        .subscribe({
          next: () => {
            this.favoriteStatuses.set(majstor.korisnikId, true);
          },
          error: (error) => {
            console.error('Greška pri dodavanju favorita:', error);
          }
        });
    }
  }

  isKupac(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.uloga === 'Kupac';
  }
}

