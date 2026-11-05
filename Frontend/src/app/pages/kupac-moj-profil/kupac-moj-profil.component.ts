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
import { environment } from '../../../environments/environment';

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
    
    if (!currentUser || (!currentUser.korisnikId && !currentUser.userId)) {
      this.router.navigate(['/login']);
      return;
    }

    const userId = currentUser.korisnikId || currentUser.userId;
    this.kupacService.getKupacById(userId).subscribe({
      next: data => {
        this.kupac = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.kupac = null;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getProfileImage(): string {
    if (this.kupac?.slikaProfila) {
      return `${environment.apiRoot}${this.kupac.slikaProfila}`;
    }
    // Fallback na UI Avatars sa inicijalima
    const firstName = this.kupac?.ime || 'K';
    const lastName = this.kupac?.prezime || 'K';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + '+' + lastName)}&size=200&background=13ab24&color=ffffff&bold=true`;
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
