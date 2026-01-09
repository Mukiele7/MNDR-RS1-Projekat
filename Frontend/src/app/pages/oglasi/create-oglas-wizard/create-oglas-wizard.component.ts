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
  currentDate = new Date();

  kategorije: Kategorija[] = [
    { kategorijaId: 1, naziv: 'Vodoinstalater' },
    { kategorijaId: 2, naziv: 'Električar' },
    { kategorijaId: 3, naziv: 'Automehaničar' },
    { kategorijaId: 4, naziv: 'Gradjevinar' },
    { kategorijaId: 5, naziv: 'Moler' },
    { kategorijaId: 6, naziv: 'Stolar' },
    { kategorijaId: 7, naziv: 'Limar' },
    { kategorijaId: 8, naziv: 'Krovopokrivač' },
    { kategorijaId: 9, naziv: 'Zidar' },
    { kategorijaId: 10, naziv: 'Keramičar' },
    { kategorijaId: 11, naziv: 'Bravar' },
    { kategorijaId: 12, naziv: 'Soboslikar' },
    { kategorijaId: 13, naziv: 'Baštovan' },
    { kategorijaId: 14, naziv: 'Čistač' },
    { kategorijaId: 15, naziv: 'Klimatizacija i grijanje' },
    { kategorijaId: 16, naziv: 'Drugo' },
    { kategorijaId: 17, naziv: 'Majstor za bijelu tehniku' },
    { kategorijaId: 18, naziv: 'Majstor za računare' },
    { kategorijaId: 19, naziv: 'Majstor za mobilne telefone' },
    { kategorijaId: 20, naziv: 'Majstor za TV i audio opremu' },
    { kategorijaId: 21, naziv: 'Majstor za vrtne mašine' },
    { kategorijaId: 22, naziv: 'Majstor za kućne aparate' },
    { kategorijaId: 23, naziv: 'Majstor za sigurnosne sisteme' },
    { kategorijaId: 24, naziv: 'Majstor za solarne sisteme' },
    { kategorijaId: 25, naziv: 'Majstor za bazene' },
    { kategorijaId: 26, naziv: 'Majstor za podne obloge' },
    { kategorijaId: 27, naziv: 'Majstor za fasade' },
    { kategorijaId: 28, naziv: 'Majstor za izolacije' },
    { kategorijaId: 29, naziv: 'Majstor za demontažu i montažu namještaja' },
    { kategorijaId: 30, naziv: 'Majstor za selidbe' },
    { kategorijaId: 31, naziv: 'Majstor za popravku prozora i vrata' },
    { kategorijaId: 32, naziv: 'Majstor za popravku podova' },
    { kategorijaId: 34, naziv: 'Majstor za popravku ograda' },
    { kategorijaId: 35, naziv: 'Majstor za popravku dimnjaka' },
    { kategorijaId: 36, naziv: 'Majstor za popravku roletni i žaluzina' },
    { kategorijaId: 37, naziv: 'Majstor za popravku rasvjete' },
    { kategorijaId: 38, naziv: 'Majstor za popravku kanalizacionih sistema' },
    { kategorijaId: 39, naziv: 'Majstor za popravku grijanja' } 

  ];

  selectedKategorije: Kategorija[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private oglasService: OglasService,
    private router: Router
  ) {
    this.basicInfoForm = this.formBuilder.group({
      naslov: ['', [
        Validators.required, 
        Validators.minLength(10),
        Validators.maxLength(200)
      ]],
      opis: ['', [
        Validators.required, 
        Validators.minLength(50),
        Validators.maxLength(1000)
      ]]
    });

    // Step 2: Kategorije
    this.categoryForm = this.formBuilder.group({
      kategorijeIds: [[], [Validators.required]]
    });
  }

  ngOnInit(): void {}

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

      const oglasData = {
        majstorId: 1, // TODO: Uzeti iz sesije/auth servisa
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
          this.isSubmitting = false;
        }
      });
    }
  }

  // Getter za lak pristup validacijama
  get naslov() { return this.basicInfoForm.get('naslov'); }
  get opis() { return this.basicInfoForm.get('opis'); }
}
