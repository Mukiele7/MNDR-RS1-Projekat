import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing-kupac',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './landing-kupac.component.html',
  styleUrl: './landing-kupac.component.scss'
})
export class LandingKupacComponent {
  newsletterEmail: string = '';
  isDropdownOpen = false;
  searchQuery: string = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
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

  features = [
    {
      icon: '🔍',
      title: 'Pretraži Majstore',
      description: 'Pronađi provjerene majstore sa recenzijama i ocjenama korisnika'
    },
    {
      icon: '💬',
      title: 'Direktna Komunikacija',
      description: 'Razgovaraj sa majstorima, dogovori detalje i cijenu'
    },
    {
      icon: '✅',
      title: 'Zaključi Ugovor',
      description: 'Sigurna platforma za postizanje dogovora'
    },
    {
      icon: '⭐',
      title: 'Ostavi Recenziju',
      description: 'Podijeli svoje iskustvo i pomozi drugima'
    },
    {
      icon: '💳',
      title: 'Krediti za Plaćanje',
      description: 'Kupi kredite i jednostavno plaćaj usluge na platformi'
    },
    {
        icon: '📱',
        title: 'Pristup sa Bilo Kojeg Uređaja',
        description: 'Koristi našu platformu na računaru, tabletu ili telefonu'
    },
  ];

  steps = [
    {
      number: '1',
      title: 'Registruj se',
      description: 'Napravi nalog i kompletiraj svoj profil'
    },
    {
      number: '2',
      title: 'Objavi ili Pretraži',
      description: 'Objavi oglas ili pretraži majstore po kategorijama'
    },
    {
      number: '3',
      title: 'Dogovori se',
      description: 'Komuniciraj sa majstorima i dogovori detalje'
    },
    {
      number: '4',
      title: 'Zaključi Posao',
      description: 'Potpiši ugovor i započni saradnju'
    }
  ];

  testimonials = [
    {
      name: 'Muhamed M.',
      text: 'Pronašao sam odličnog majstora za renoviranje kupatila. Sve je urađeno profesionalno i na vrijeme!',
      rating: 5
    },
    {
      name: 'Alem B.',
      text: 'Platforma je jednostavna za korištenje. Dogovaranje saradje je brzo i jednostavno!.',
      rating: 5
    },
    {
      name: 'Adil J.',
      text: 'Alem i Muhamed su pravi profesionalci. Preporučujem svima koji traže kvalitetne programere',
      rating: 4
    }
  ];

  subscribeNewsletter() {
    if (this.newsletterEmail) {
      console.log('Newsletter subscription:', this.newsletterEmail);
      // Ovde dodaj logiku za slanje email-a na backend
      alert('Hvala što ste se pretplatili!');
      this.newsletterEmail = '';
    }
  }

  searchMajstori(): void {
    // Navigate to majstor map page with search query
    if (this.searchQuery.trim()) {
      this.router.navigate(['/majstor-map'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
    } else {
      this.router.navigate(['/majstor-map']);
    }
  }
}
