import { Component, ChangeDetectorRef } from '@angular/core';
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
import { KupacService } from '../../services/kupac.service';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-kupac-register',
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
    MatStepperModule,
    RecaptchaModule
  ],
  templateUrl: './kupac-register.component.html',
  styleUrls: ['./kupac-register.component.scss']
})
export class KupacRegisterComponent {
  personalInfoForm: FormGroup;
  locationInfoForm: FormGroup;
  profileInfoForm: FormGroup;
  recaptchaToken: string | null = null;
  
  gradovi = ['Sarajevo', 'Banja Luka', 'Tuzla', 'Zenica', 'Mostar', 'Bijeljina', 'Brčko', 'Travnik'];
  
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isDragging = false;

  constructor(
    private formBuilder: FormBuilder,
    private kupacService: KupacService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Korak 1: Lični podaci
    this.personalInfoForm = this.formBuilder.group({
      ime: ['', [Validators.required, Validators.minLength(2)]],
      prezime: ['', [Validators.required, Validators.minLength(2)]],
      korisnikoIme: [''],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^@\s]+@[^@\s]+\.com$/i)]],
      telefon: ['', [Validators.required, Validators.pattern(/^(\+387[6-9]\d{7}|0[6-9]\d{7}|[6-9]\d{7})$/)]],
      lozinka: ['', [Validators.required, Validators.minLength(6)]],
      potvrdaLozinke: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Korak 2: Informacije o lokaciji
    this.locationInfoForm = this.formBuilder.group({
      grad: ['', Validators.required],
      opcina: ['', Validators.required]
    });
    
    // Korak 3: Opis profila i slika
    this.profileInfoForm = this.formBuilder.group({
      opisProfila: ['', Validators.maxLength(500)],
      slikaProfila: [null]
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('lozinka')?.value;
    const confirmPassword = group.get('potvrdaLozinke')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onRecaptchaResolved(token: string | null) {
    this.recaptchaToken = token;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File): void {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      alert('Dozvoljeni su samo JPG, JPEG, PNG i GIF formati!');
      return;
    }
    
    if (file.size > maxSize) {
      alert('Slika ne može biti veća od 5MB!');
      return;
    }
    
    this.selectedFile = file;
    this.profileInfoForm.patchValue({ slikaProfila: file.name });
    
    // Kreiranje preview-a
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
      this.cdr.detectChanges(); // Osigurava da se slika odmah prikaže
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.profileInfoForm.patchValue({ slikaProfila: null });
  }

  register(): void {
    if (this.personalInfoForm.valid && this.locationInfoForm.valid && this.profileInfoForm.valid) {
      const formData = new FormData();
      
      // Dodavanje ličnih podataka
      formData.append('ime', this.personalInfoForm.value.ime);
      formData.append('prezime', this.personalInfoForm.value.prezime);
      if (this.personalInfoForm.value.korisnikoIme) {
        formData.append('korisnikoIme', this.personalInfoForm.value.korisnikoIme);
      }
      formData.append('email', this.personalInfoForm.value.email);
      formData.append('telefon', this.personalInfoForm.value.telefon);
      formData.append('lozinka', this.personalInfoForm.value.lozinka);
      
      // Dodavanje lokacije
      formData.append('grad', this.locationInfoForm.value.grad);
      formData.append('opcina', this.locationInfoForm.value.opcina);
      
      // Dodavanje opisa profila
      if (this.profileInfoForm.value.opisProfila) {
        formData.append('opisProfila', this.profileInfoForm.value.opisProfila);
      }
      
      // Dodavanje slike
      if (this.selectedFile) {
        formData.append('slikaProfila', this.selectedFile);
      }

      this.kupacService.createKupac(formData).subscribe({
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
      alert('Molimo popunite sva obavezna polja pravilno!');
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
    return '';
  }
}
