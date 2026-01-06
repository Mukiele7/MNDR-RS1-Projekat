import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MajstorService } from '../../services/majstor.service';

@Component({
  selector: 'app-majstor-register',
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
    MatStepperModule
  ],
  templateUrl: './majstor-register.component.html',
  styleUrls: ['./majstor-register.component.scss']
})
export class MajstorRegisterComponent {
  personalInfoForm: FormGroup;
  professionalInfoForm: FormGroup;
  
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
    private router: Router
  ) {
    // Korak 1: Lični podaci
    this.personalInfoForm = this.formBuilder.group({
      ime: ['', [Validators.required, Validators.minLength(2)]],
      prezime: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^@\s]+@[^@\s]+\.com$/)]],
      telefon: ['', [Validators.required, Validators.pattern(/^(\+387[6-9]\d{7}|0[6-9]\d{7}|[6-9]\d{7})$/)]],
      lozinka: ['', [Validators.required, Validators.minLength(6)]],
      potvrdaLozinke: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Korak 2: Profesionalni podaci
    this.professionalInfoForm = this.formBuilder.group({
      grad: ['', Validators.required],
      specijalizacija: ['', Validators.required],
      godineIskustva: [0, [Validators.required, Validators.min(0)]],
      cijenaSat: [0, [Validators.required, Validators.min(1)]],
      opisProfila: ['', [Validators.required, Validators.minLength(50)]]
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('lozinka')?.value;
    const confirmPassword = group.get('potvrdaLozinke')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  register(): void {
    if (this.personalInfoForm.valid && this.professionalInfoForm.valid) {
      const registrationData = {
        ...this.personalInfoForm.value,
        ...this.professionalInfoForm.value
      };
      delete registrationData.potvrdaLozinke;

      this.majstorService.createMajstor(registrationData).subscribe({
        next: (response) => {
          alert('Registracija uspješna! Možete se prijaviti.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Greška pri registraciji:', error);
          alert(error.error?.message || 'Greška pri registraciji. Provjerite da li email već postoji.');
        }
      });
    } else {
      alert('Molimo popunite sva polja pravilno!');
    }
  }

  getErrorMessage(field: string, form: FormGroup): string {
    const control = form.get(field);
    if (control?.hasError('required')) return 'Ovo polje je obavezno';
    if (control?.hasError('email')) return 'Unesite validnu email adresu';
    if (control?.hasError('pattern')) {
      if (field === 'telefon') return 'Format: +387XXXXXXXX ili 06XXXXXXXX';
      if (field === 'email') return 'Email mora biti u formatu: email@domen.com';
    }
    if (control?.hasError('minlength')) return `Minimum ${control.errors?.['minlength'].requiredLength} karaktera`;
    if (control?.hasError('min')) return 'Vrijednost mora biti veća od 0';
    return '';
  }
}
