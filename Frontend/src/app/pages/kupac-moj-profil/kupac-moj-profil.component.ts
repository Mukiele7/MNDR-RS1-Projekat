import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatTooltipModule,
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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadKupacProfile();
  }

  loadKupacProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log('Current user:', currentUser);
    
    if (!currentUser || (!currentUser.korisnikId && !currentUser.userId)) {
      console.log('No user found, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    const userId = currentUser.korisnikId || currentUser.userId;
    console.log('Loading profile for userId:', userId);

    this.kupacService.getKupacById(userId).subscribe({
      next: (data) => {
        console.log('Kupac data loaded:', data);
        this.kupac = data;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Loading set to false, kupac:', this.kupac);
      },
      error: (err) => {
        console.error('Greška pri učitavanju profila:', err);
        this.loading = false;
        this.cdr.detectChanges();
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
