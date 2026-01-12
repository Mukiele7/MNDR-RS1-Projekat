import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MajstorService } from '../../services/majstor.service';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { MajstorMapComponent } from '../majstor-map/majstor-map.component';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-landing-majstor',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatIconModule, 
    MatMenuModule, 
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MajstorMapComponent
  ],
  templateUrl: './landing-majstor.component.html',
  styleUrl: './landing-majstor.component.scss'
})
export class LandingMajstorComponent implements OnInit {
  newsletterEmail: string = '';
  isMenuOpen: boolean = false;
  isDropdownOpen = false;
  Math = Math; // For template

  // Autocomplete
  searchControl = new FormControl('');
  suggestions: any[] = [];

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

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  getProfileImage(): string {
    const user = this.currentUser;
    if (user?.slikaProfila) {
      return `http://localhost:5017${user.slikaProfila}`;
    }
    const firstName = this.currentUser?.ime || 'K';
    const lastName = this.currentUser?.prezime || 'K';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + '+' + lastName)}&size=200&background=13ab24&color=ffffff&bold=true`;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.isDropdownOpen = false;
    this.authService.logout();
  }

  ngOnInit(): void {
    // Ne učitavaj automatski - čekaj da korisnik klikne na pretragu
    
    // Setup autocomplete
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (value && typeof value === 'string' && value.trim().length >= 2) {
          return this.majstorService.getSuggestions(value.trim());
        }
        return of([]);
      })
    ).subscribe(suggestions => {
      this.suggestions = suggestions;
    });
  }

  onSuggestionSelected(suggestion: any): void {
    // Navigate to majstor detail or apply filter
    this.filters.specijalizacija = '';
    this.filters.grad = '';
    // Could navigate to detail: this.router.navigate(['/majstor', suggestion.korisnikId]);
    // Or search by name:
    this.searchControl.setValue(`${suggestion.ime} ${suggestion.prezime}`, { emitEvent: false });
    this.searchMajstori();
  }

  displayFn(majstor: any): string {
    return majstor ? `${majstor.ime} ${majstor.prezime}` : '';
  }

  loadMajstori(): void {
    this.isLoading = true;
    this.hasSearched = true;
    this.majstorService.getMajstori({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      specijalizacija: this.filters.specijalizacija || undefined,
      minOcjena: this.filters.minOcjena || undefined,
      grad: this.filters.grad || undefined,
      minGodineIskustva: this.filters.minGodineIskustva || undefined,
      maxCijena: this.filters.maxCijena || undefined,
      sortBy: this.sortBy || undefined,
      sortOrder: this.sortOrder
    }).subscribe({
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

