import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MajstorService } from '../../services/majstor.service';
import { DeleteConfirmationDialogComponent } from '../../components/delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-majstor-delete-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './majstor-delete-profile.component.html',
  styleUrls: ['./majstor-delete-profile.component.scss']
})
export class MajstorDeleteProfileComponent implements OnInit {
  loading = false;
  deleting = false;
  confirmationChecked = false;
  majstorId: number = 0;
  majstorData: any = null;

  warningItems = [
    { icon: 'warning', text: 'Svi vaši oglasi će biti trajno obrisani' },
    { icon: 'delete_forever', text: 'Vaš profil i sve informacije će biti uklonjeni' },
    { icon: 'chat_bubble_outline', text: 'Svi razgovori i poruke će biti obrisani' },
    { icon: 'star_outline', text: 'Recenzije koje ste dobili više neće biti dostupne' },
    { icon: 'receipt', text: 'Svi ugovori i krediti povezani sa vašim profilom će biti obrisani' },
    { icon: 'restore', text: 'Ovu akciju NIJE moguće poništiti' }
  ];

  constructor(
    private majstorService: MajstorService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.majstorId = parseInt(idParam, 10);
      this.loadMajstorData();
    } else {
      alert('ID majstora nije naveden u URL-u');
      this.router.navigate(['/']);
    }
  }

  loadMajstorData(): void {
    this.loading = true;
    console.log('🔍 Pozivam API za ID:', this.majstorId);
    console.log('📡 URL:', `http://localhost:5017/api/majstor/${this.majstorId}`);
    
    this.majstorService.getMajstorById(this.majstorId).subscribe({
      next: (data) => {
        console.log('✅ Dobio response:', data);
        console.log('📊 Tip podatka:', typeof data, 'Null?', data === null);
        console.log('🔑 Keys u objektu:', Object.keys(data));
        console.log('👤 data.ime:', data.ime, 'data.Ime:', data.Ime);
        
        console.log('⏹️ PRIJE: this.loading =', this.loading);
        this.loading = false;
        console.log('⏹️ POSLIJE: this.loading =', this.loading);
        this.cdr.detectChanges(); // 🔥 Forsiraj Angular da detektuje promjene!
        console.log('✨ Change detection forced!');
        
        if (data) {
          this.majstorData = data;
          console.log('💾 Podaci sačuvani u component:', this.majstorData);
        } else {
          console.warn('⚠️ Backend vratio null/undefined');
          alert(`Majstor sa ID ${this.majstorId} nije pronađen u bazi!`);
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('❌ HTTP Error:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        
        this.loading = false;
        alert(`Greška pri učitavanju profila: ${error.status === 404 ? 'Majstor nije pronađen' : error.message}`);
        this.router.navigate(['/']);
      },
      complete: () => {
        console.log('🏁 Observable completed');
      }
    });
  }

  deleteProfile(): void {
    if (!this.confirmationChecked) {
      alert('Morate potvrditi da razumijete posljedice brisanja profila.');
      return;
    }

    // Otvaranje Material Dialog modala
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Potvrda Brisanja Profila',
        message: `Da li ste APSOLUTNO sigurni da želite obrisati vaš profil?\n\nProfil: ${this.majstorData?.ime} ${this.majstorData?.prezime}\nEmail: ${this.majstorData?.email}\n\nOva akcija je TRAJNA i NEPOVRATNA!`,
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
    this.majstorService.deleteMajstor(this.majstorId).subscribe({
      next: (response) => {
        alert('Vaš profil je uspješno obrisan. Hvala što ste koristili našu platformu.');
        // TODO: Logout korisnika i redirektuj na landing
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
    this.router.navigate(['/majstor/edit-profile', this.majstorId]);
  }
}
