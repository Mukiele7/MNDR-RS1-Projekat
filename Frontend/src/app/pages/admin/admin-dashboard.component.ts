import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of, timeout } from 'rxjs';
import { RouterModule } from '@angular/router';
import {
  AdminListing,
  AdminOverview,
  AdminReview,
  AdminService,
  AdminUser
} from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  overview: AdminOverview | null = null;
  users: AdminUser[] = [];
  listings: AdminListing[] = [];
  reviews: AdminReview[] = [];
  selectedTab = 'overview';
  search = '';
  loading = true;
  error = '';
  readonly statuses = ['Aktivan', 'Neaktivan', 'Završen', 'Odobren', 'Odbijen'];
  readonly roles = ['Kupac', 'Majstor', 'Administrator'];

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  get adminName(): string {
    return this.authService.getCurrentUser()?.fullName || 'Administrator';
  }

  loadData(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      overview: this.adminService.getOverview().pipe(
        timeout(10000),
        catchError(() => {
          this.error = 'Pregled statistike nije mogao biti učitan.';
          return of<AdminOverview>({
            ukupnoKorisnika: 0,
            ukupnoMajstora: 0,
            ukupnoKupaca: 0,
            ukupnoOglasa: 0,
            aktivniOglasi: 0,
            ukupnoUgovora: 0,
            ukupnoRecenzija: 0,
            ukupnoRazgovora: 0
          });
        })
      ),
      users: this.adminService.getUsers(this.search).pipe(
        timeout(10000),
        catchError(() => {
          this.error = 'Korisnici nisu mogli biti učitani.';
          return of<AdminUser[]>([]);
        })
      ),
      listings: this.adminService.getListings().pipe(
        timeout(10000),
        catchError(() => {
          this.error = 'Oglasi nisu mogli biti učitani.';
          return of<AdminListing[]>([]);
        })
      ),
      reviews: this.adminService.getReviews().pipe(
        timeout(10000),
        catchError(() => {
          this.error = 'Recenzije nisu mogle biti učitane.';
          return of<AdminReview[]>([]);
        })
      )
    }).subscribe({
      next: data => {
        this.overview = data.overview;
        this.users = data.users;
        this.listings = data.listings;
        this.reviews = data.reviews;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  searchUsers(): void {
    this.adminService.getUsers(this.search).subscribe({
      next: users => this.users = users,
      error: () => this.error = 'Pretraga korisnika nije uspela.'
    });
  }

  changeListingStatus(listing: AdminListing, status: string): void {
    this.adminService.updateListingStatus(listing.oglasId, status).subscribe({
      next: () => listing.status = status,
      error: () => this.error = 'Status oglasa nije promenjen.'
    });
  }

  changeUserRole(user: AdminUser, role: string): void {
    this.adminService.updateUserRole(user.korisnikId, role).subscribe({
      next: () => user.uloga = role,
      error: () => this.error = 'Uloga korisnika nije promenjena.'
    });
  }

  deleteReview(review: AdminReview): void {
    if (!confirm('Da li sigurno želiš obrisati ovu recenziju?')) return;
    this.adminService.deleteReview(review.recenzijaId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(item => item.recenzijaId !== review.recenzijaId);
        if (this.overview) this.overview = { ...this.overview, ukupnoRecenzija: this.overview.ukupnoRecenzija - 1 };
      },
      error: () => this.error = 'Recenzija nije obrisana.'
    });
  }

  deleteUser(user: AdminUser): void {
    if (!confirm(`Obrisati korisnika ${user.ime} ${user.prezime}?`)) return;
    this.adminService.deleteUser(user.korisnikId).subscribe({
      next: () => {
        this.users = this.users.filter(item => item.korisnikId !== user.korisnikId);
        this.loadData();
      },
      error: () => this.error = 'Korisnik nije obrisan. Možda ima povezane podatke koje prvo treba ukloniti.'
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
