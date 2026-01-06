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
import { MajstorService } from '../../services/majstor.service';

@Component({
  selector: 'app-majstor-edit-profile',
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
  templateUrl: './majstor-edit-profile.component.html',
  styleUrls: ['./majstor-edit-profile.component.scss']
})
export class MajstorEditProfileComponent implements OnInit {
  editForm: FormGroup;
  loading = true;
  saving = false;
  majstorId: number = 0;
  
  specijalizacije = [
    'Električar',
    'Vodoinstalater',
    'Stolar',
    'Moler',
    'Zidanje',
    'Keramičar',
    'Limarski Radovi',
    'Gipsarski Radovi',
    'Soboslikarstvo',
    'Parketi'
  ];
  
  gradovi = ['Sarajevo', 'Banja Luka', 'Tuzla', 'Zenica', 'Mostar', 'Bijeljina', 'Brčko', 'Travnik'];

  constructor(
    private formBuilder: FormBuilder,
    private majstorService: MajstorService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.editForm = this.formBuilder.group({
      ime: ['', [Validators.required, Validators.minLength(2)]],
      prezime: ['', [Validators.required, Validators.minLength(2)]],
      grad: ['', Validators.required],
      specijalizacija: ['', Validators.required],
      godineIskustva: [0, [Validators.required, Validators.min(0)]],
      cijenaSat: [0, [Validators.required, Validators.min(1)]],
      opisProfila: ['', [Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    // Učitaj ID iz URL parametra
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
    this.majstorService.getMajstorById(this.majstorId).subscribe({
      next: (data) => {
        if (data) {
          this.editForm.patchValue({
            ime: data.ime,
            prezime: data.prezime,
            grad: data.grad,
            specijalizacija: data.specijalizacija,
            godineIskustva: data.godineIskustva,
            cijenaSat: data.cijenaSat,
            opisProfila: data.opisProfila || ''
          });
          this.loading = false;
          this.cdr.detectChanges();
        } else {
          this.loading = false;
          this.cdr.detectChanges();
          alert(`Majstor sa ID ${this.majstorId} nije pronađen u bazi!`);
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Greška pri učitavanju podataka:', error);
        alert(`Greška: ${error.status === 404 ? 'Majstor nije pronađen' : 'Nemoguće učitati profil'}`);
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/']);
      }
    });
  }

  updateProfile(): void {
    if (this.editForm.valid) {
      this.saving = true;
      
      // Pripremi podatke - dodaj cijenaMjesecne = 0 da backend može kalkulisati
      const updateData = {
        ...this.editForm.value,
        cijenaMjesecne: 0 // Backend će automatski izračunati iz cijenaSat
      };
      
      this.majstorService.updateMajstor(this.majstorId, updateData).subscribe({
        next: (response) => {
          alert('Profil uspješno ažuriran!');
          this.saving = false;
          // Možda redirektovati na dashboard ili profil stranicu
          // this.router.navigate(['/majstor/profile']);
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
    if (control?.hasError('min')) return 'Vrijednost mora biti veća od 0';
    return '';
  }
}
