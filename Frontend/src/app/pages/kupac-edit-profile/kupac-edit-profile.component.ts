import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { KupacService } from '../../services/kupac.service';

@Component({
  selector: 'app-kupac-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './kupac-edit-profile.component.html',
  styleUrls: ['./kupac-edit-profile.component.scss']
})
export class KupacEditProfileComponent implements OnInit {
  editForm: FormGroup;
  loading = true;
  saving = false;
  kupacId: number = 0;
  
  gradovi = ['Sarajevo', 'Banja Luka', 'Tuzla', 'Zenica', 'Mostar', 'Bijeljina', 'Brčko', 'Travnik'];

  constructor(
    private formBuilder: FormBuilder,
    private kupacService: KupacService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.editForm = this.formBuilder.group({
      ime: ['', [Validators.required, Validators.minLength(2)]],
      prezime: ['', [Validators.required, Validators.minLength(2)]],
      grad: ['', Validators.required],
      opcina: ['', Validators.required],
      adresa: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    // Učitaj ID iz URL parametra
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
        if (data) {
          this.editForm.patchValue({
            ime: data.ime,
            prezime: data.prezime,
            grad: data.grad,
            opcina: data.opcina || '',
            adresa: data.adresa || ''
          });
          this.loading = false;
          this.cdr.detectChanges();
        } else {
          this.loading = false;
          this.cdr.detectChanges();
          alert(`Kupac sa ID ${this.kupacId} nije pronađen u bazi!`);
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Greška pri učitavanju podataka:', error);
        alert(`Greška: ${error.status === 404 ? 'Kupac nije pronađen' : 'Nemoguće učitati profil'}`);
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/']);
      }
    });
  }

  updateProfile(): void {
    if (this.editForm.valid) {
      this.saving = true;
      this.kupacService.updateKupac(this.kupacId, this.editForm.value).subscribe({
        next: (response) => {
          alert('Profil uspješno ažuriran!');
          this.saving = false;
          // Možda redirektovati na dashboard ili profil stranicu
          // this.router.navigate(['/kupac/profile']);
        },
        error: (error) => {
          console.error('Greška pri ažuriranju:', error);
          alert(error.error?.message || 'Greška pri ažuriranju profila');
          this.saving = false;
        }
      });
    } else {
      alert('Molimo popunite sva obavezna polja pravilno!');
    }
  }

  cancel(): void {
    if (confirm('Da li ste sigurni da želite otkazati? Sve izmjene će biti izgubljene.')) {
      this.router.navigate(['/dashboard']);
    }
  }

  getErrorMessage(field: string): string {
    const control = this.editForm.get(field);
    if (control?.hasError('required')) return 'Ovo polje je obavezno';
    if (control?.hasError('minlength')) return `Minimum ${control.errors?.['minlength'].requiredLength} karaktera`;
    return '';
  }
}
