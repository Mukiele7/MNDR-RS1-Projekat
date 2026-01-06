import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { KupacService } from '../../services/kupac.service';

@Component({
  selector: 'app-kupac-moj-profil',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './kupac-moj-profil.component.html',
  styleUrls: ['./kupac-moj-profil.component.scss']
})
export class KupacMojProfilComponent implements OnInit {
  loading = true;
  kupac: any = null;
  defaultAvatar = 'assets/default-avatar.png';

  constructor(
    private authService: AuthService,
    private kupacService: KupacService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadKupacProfile();
  }

  loadKupacProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.korisnikId) {
      this.router.navigate(['/login']);
      return;
    }

    this.kupacService.getKupacById(currentUser.korisnikId).subscribe({
      next: (data) => {
        this.kupac = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Greška pri učitavanju profila:', err);
        this.loading = false;
      }
    });
  }

  getProfileImage(): string {
    if (this.kupac?.slikaProfila) {
      return `http://localhost:5017${this.kupac.slikaProfila}`;
    }
    return this.defaultAvatar;
  }

  navigateToEdit(): void {
    if (this.kupac?.korisnikId) {
      this.router.navigate(['/kupac/edit-profile', this.kupac.korisnikId]);
    }
  }

  navigateToDelete(): void {
    if (this.kupac?.korisnikId) {
      this.router.navigate(['/kupac/delete-profile', this.kupac.korisnikId]);
    }
  }
}
