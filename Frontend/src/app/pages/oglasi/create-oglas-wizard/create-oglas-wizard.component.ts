import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { OglasService } from '../../../services/oglas.service';
import { CustomDatePipe } from '../../../shared/pipes/date.pipe';
import { AuthService } from '../../../services/auth.service';

interface Kategorija {
  kategorijaId: number;
  naziv: string;
}

@Component({
  selector: 'app-create-oglas-wizard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    CustomDatePipe
  ],
  templateUrl: './create-oglas-wizard.component.html',
  styleUrls: ['./create-oglas-wizard.component.scss']
})
export class CreateOglasWizardComponent implements OnInit {
  basicInfoForm: FormGroup;
  categoryForm: FormGroup;
  isSubmitting = false;
  submitError = '';
  currentDate = new Date();

  kategorije: Kategorija[] = [
    { kategorijaId: 1, naziv: 'Vodoinstalacije' },
    { kategorijaId: 2, naziv: 'Keramika' },
    { kategorijaId: 3, naziv: 'Grejanje' },
    { kategorijaId: 4, naziv: 'Elektrika' }
  ];

  selectedKategorije: Kategorija[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private oglasService: OglasService,
    private router: Router,
    private authService: AuthService
  ) {
    this.basicInfoForm = this.formBuilder.group({
      naslov: ['', [
        Validators.required, 
        Validators.minLength(10),
        Validators.maxLength(200)
      ]],
      opis: ['', [
        Validators.required, 
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]]
    });

    // Step 2: Kategorije
    this.categoryForm = this.formBuilder.group({
      kategorijeIds: [[], [Validators.required]]
    });
  }

  ngOnInit(): void {}

  goBack(): void {
    this.router.navigate(['/majstor']);
  }

  // Dodaj kategoriju
  addKategorija(kategorija: Kategorija): void {
    if (!this.selectedKategorije.find(k => k.kategorijaId === kategorija.kategorijaId)) {
      this.selectedKategorije.push(kategorija);
      this.categoryForm.patchValue({
        kategorijeIds: this.selectedKategorije.map(k => k.kategorijaId)
      });
    }
  }

  // Ukloni kategoriju
  removeKategorija(kategorija: Kategorija): void {
    this.selectedKategorije = this.selectedKategorije.filter(
      k => k.kategorijaId !== kategorija.kategorijaId
    );
    this.categoryForm.patchValue({
      kategorijeIds: this.selectedKategorije.map(k => k.kategorijaId)
    });
  }

  // Provera da li je kategorija selektovana
  isSelected(kategorija: Kategorija): boolean {
    return this.selectedKategorije.some(k => k.kategorijaId === kategorija.kategorijaId);
  }

  // Finalno slanje
  onSubmit(): void {
    if (this.basicInfoForm.valid && this.categoryForm.valid) {
      this.isSubmitting = true;
      this.submitError = '';

      const oglasData = {
        majstorId: this.authService.getCurrentUser()?.korisnikId
          ?? this.authService.getCurrentUser()?.userId,
        naslov: this.basicInfoForm.value.naslov,
        opis: this.basicInfoForm.value.opis,
        kategorijeIds: this.categoryForm.value.kategorijeIds,
        status: 'Aktivan'
      };

      this.oglasService.createOglas(oglasData).subscribe({
        next: (response) => {
          console.log('Oglas kreiran:', response);
          this.router.navigate(['/oglasi']);
        },
        error: (error) => {
          console.error('Greška pri kreiranju oglasa:', error);
          this.submitError = error.error?.errors?.message
            ?? error.error?.message
            ?? 'Oglas nije moguće objaviti. Pokušajte ponovo.';
          this.isSubmitting = false;
        }
      });
    }
  }

  // Getter za lak pristup validacijama
  get naslov() { return this.basicInfoForm.get('naslov'); }
  get opis() { return this.basicInfoForm.get('opis'); }
}
