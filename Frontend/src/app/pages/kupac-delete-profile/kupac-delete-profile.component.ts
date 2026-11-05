import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { KupacService } from '../../services/kupac.service';
import { AuthService } from '../../services/auth.service';
import { DeleteConfirmationDialogComponent } from '../../components/delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-kupac-delete-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './kupac-delete-profile.component.html',
  styleUrls: ['./kupac-delete-profile.component.scss']
})
export class KupacDeleteProfileComponent implements OnInit {
  loading = false;
  deleting = false;
  confirmationChecked = false;
  confirmationControl = new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue });
  kupacId: number = 0;
  kupacData: any = null;

  warningItems = [
    { icon: 'warning', text: 'Svi vaši oglasi i zahtjevi će biti trajno obrisani' },
    { icon: 'delete_forever', text: 'Vaš profil i sve informacije će biti uklonjeni' },
    { icon: 'chat_bubble_outline', text: 'Svi razgovori i poruke će biti obrisani' },
    { icon: 'star_outline', text: 'Recenzije koje ste dali više neće biti dostupne' },
    { icon: 'receipt', text: 'Svi ugovori povezani sa vašim profilom će biti obrisani' },
    { icon: 'restore', text: 'Ovu akciju NIJE moguće poništiti' }
  ];

  constructor(
    private kupacService: KupacService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.kupacId = parseInt(idParam, 10);
      this.loadKupacData();
    } else {
      alert('ID kupca nije naveden u URL-u');
      this.router.navigate(['/']);
    }
  }

  loadKupacData(): void {
    this.loading = true;
    
    this.kupacService.getKupacById(this.kupacId).subscribe({
      next: (data) => {
        this.loading = false;
        this.cdr.detectChanges(); // 🔥 Forsiraj Angular da detektuje promjene!
        
        if (data) {
          this.kupacData = data;
        } else {
          console.warn('⚠️ Backend vratio null/undefined');
          alert(`Kupac sa ID ${this.kupacId} nije pronađen u bazi!`);
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('❌ HTTP Error:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        
        this.loading = false;
        alert(`Greška pri učitavanju profila: ${error.status === 404 ? 'Kupac nije pronađen' : error.message}`);
        this.router.navigate(['/']);
      },
      complete: () => {
      }
    });
  }

  deleteProfile(): void {
    this.confirmationChecked = this.confirmationControl.value;
    if (this.confirmationControl.invalid) {
      alert('Morate potvrditi da razumijete posljedice brisanja profila.');
      return;
    }

    // Otvaranje Material Dialog modala
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Potvrda Brisanja Profila',
        message: `Da li ste APSOLUTNO sigurni da želite obrisati vaš profil?\n\nProfil: ${this.kupacData?.ime} ${this.kupacData?.prezime}\nEmail: ${this.kupacData?.email}\n\nOva akcija je TRAJNA i NEPOVRATNA!`,
        confirmText: 'Obriši Profil',
        cancelText: 'Otkaži'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performDelete();
      }
    });
  }

  private performDelete(): void {

    this.deleting = true;
    this.kupacService.deleteKupac(this.kupacId).subscribe({
      next: (response) => {
        alert('Vaš profil je uspješno obrisan. Hvala što ste koristili našu platformu.');
        this.authService.logout();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Greška pri brisanju profila:', error);
        alert('Greška pri brisanju profila. Molimo pokušajte ponovo.');
        this.deleting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/kupac/edit-profile', this.kupacId]);
  }
}
