import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MajstorService } from '../../services/majstor.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing-majstor',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
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

  // Paging properties
  majstori: any[] = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 9;
  isLoading: boolean = false;
  hasSearched: boolean = false; // Track if search was performed

  constructor(
    private majstorService: MajstorService,
    private authService: AuthService
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
      this.filters.maxCijena || undefined
    ).subscribe({
      next: (response) => {
        this.majstori = response.items;
        this.totalCount = response.totalCount;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Greška pri učitavanju majstora:', error);
        this.isLoading = false;
      }
    });
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
}
