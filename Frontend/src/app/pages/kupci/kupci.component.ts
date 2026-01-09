import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { KupacService } from '../../services/kupac.service';
import { CustomDatePipe } from '../../shared/pipes/date.pipe';
import { CustomCurrencyPipe } from '../../shared/pipes/currency.pipe';
import { CustomPhonePipe } from '../../shared/pipes/phone.pipe';

interface Kupac {
  korisnikId: number;
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  grad: string;
  opcina: string;
  brojNarudzbi: number;
  ocjenaPouzdanosti: number;
  datumRegistracije: string;
}

@Component({
  selector: 'app-kupci',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    CustomPhonePipe,
    CustomDatePipe,
    CustomCurrencyPipe
  ],
  templateUrl: './kupci.component.html',
  styleUrls: ['./kupci.component.scss']
})
export class KupciComponent implements OnInit {
  displayedColumns: string[] = ['ime', 'prezime', 'email', 'telefon', 'grad', 'brojNarudzbi', 'ocjena', 'actions'];
  dataSource: Kupac[] = [];
  totalCount = 0;
  pageSize = 10;
  pageNumber = 1;

  gradFilter = '';
  opcinaFilter = '';
  searchFilter = '';
  minOcjenaFilter: number | null = null;
  minBrojNarudzbiFilter: number | null = null;

  createForm: FormGroup;
  updateForm: FormGroup;
  showCreateForm = false;
  showUpdateForm = false;
  selectedKupac: Kupac | null = null;

  gradovi = ['Sarajevo', 'Banja Luka', 'Tuzla', 'Zenica', 'Mostar', 'Bihać', 'Goražde', 'Doboj', 'Brčko', 'Cazin', 'Trebinje', 'Zvornik', 'Prijedor', 'Sanski Most', 'Lukavac', 'Gradačac', 'Vitez', 'Bugojno', 'Jajce', 'Livno', 'Foča', 'Konjic', 'Neum', 'Prozor-Rama', 'Bosanska Krupa', 'Kalesija', 'Kladanj', 'Kotor Varoš', 'Modriča', 'Orašje', 'Rogatica', 'Srebrenik', 'Velika Kladuša', 'Žepče', 'Čapljina', 'Čelić',  'Široki Brijeg'];
  opcine = ['Centar', 'Novi Grad', 'Stari Grad', 'Ilidža', 'Vogošća', 'Hadžići','Ilijaš','Trnovo','Novi Travnik','Bugojno','Gornji Vakuf-Uskoplje','Jajce','Donji Vakuf','Fojnica','Kiseljak','Kreševo','Busovača','Dobretići','Gračanica','Lukavac','Čelić','Srebrenik','Tuzla','Živinice','Banovići','Kladanj','Olovo','Vareš','Zavidovići','Maglaj','Tešanj','Doboj Istok','Doboj Jug','Modriča','Derventa','Brodski Varoš','Bosanski Brod','Odžak','Orašje','Bijeljina','Lopare','Ugljevik','Zvornik','Vlasenica','Milići','Bratunac','Srebrenica','Foča','Rogatica','Pale','Istočno Sarajevo','Čajniče','Kaljina','Trebinje','Nevesinje','Bileća','Gacko','Ljubinje','Cazin','Bihać','Bosanska Krupa','Bužim','Velika Kladuša','Kljuc','Sanski Most','Oštra Luka','Ključ','Bosanski Petrovac','Drvar','Glamoč','Glamoč','Šipovo','Jajce','Mrkonjić Grad','Ribnik','Petrovo','Kotor Varoš','Šipovo','Kupres','Dobretići','Fojnica'];

  constructor(
    private kupacService: KupacService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.createForm = this.formBuilder.group({
      ime: ['', [Validators.required, Validators.minLength(2)]],
      prezime: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^@\s]+@[^@\s]+\.com$/)]],
      telefon: ['', [Validators.required, Validators.pattern(/^(\+\d{1,4}\s?)?(\d{3}-?\d{3}-?\d{3}|\d{9})$/)]],
      lozinka: ['', [Validators.required, Validators.minLength(6)]],
      grad: [''],
      opcina: ['']
    });

    this.updateForm = this.formBuilder.group({
      ime: ['', [Validators.required, Validators.minLength(2)]],
      prezime: ['', [Validators.required, Validators.minLength(2)]],
      grad: [''],
      opcina: [''],
      opisProfila: ['']
    });
  }

  ngOnInit(): void {
    this.loadKupci();
  }

  loadKupci(): void {
    this.kupacService.getKupci(
      this.pageNumber,
      this.pageSize,
      this.gradFilter || undefined,
      this.opcinaFilter || undefined,
      this.searchFilter || undefined,
      this.minOcjenaFilter || undefined,
      this.minBrojNarudzbiFilter || undefined
    ).subscribe({
      next: (response) => {
        this.dataSource = response.items;
        this.totalCount = response.totalCount;
      },
      error: (error) => console.error('Greška pri učitavanju kupaca:', error)
    });
  }

  applyFilters(): void {
    this.pageNumber = 1;
    this.loadKupci();
  }

  clearFilters(): void {
    this.gradFilter = '';
    this.opcinaFilter = '';
    this.searchFilter = '';
    this.minOcjenaFilter = null;
    this.minBrojNarudzbiFilter = null;
    this.pageNumber = 1;
    this.loadKupci();
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadKupci();
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.createForm.reset();
  }

  cancelCreate(): void {
    this.showCreateForm = false;
    this.createForm.reset();
  }

  createKupac(): void {
    if (this.createForm.valid) {
      this.kupacService.createKupac(this.createForm.value).subscribe({
        next: (response) => {
          console.log('Kupac kreiran:', response);
          this.showCreateForm = false;
          this.createForm.reset();
          this.loadKupci();
        },
        error: (error) => {
          console.error('Greška:', error);
          alert(error.error?.message || 'Greška pri kreiranju kupca');
        }
      });
    }
  }

  openUpdateForm(kupac: Kupac): void {
    this.selectedKupac = kupac;
    this.showUpdateForm = true;
    this.updateForm.patchValue({
      ime: kupac.ime,
      prezime: kupac.prezime,
      grad: kupac.grad,
      opcina: kupac.opcina
    });
  }

  cancelUpdate(): void {
    this.showUpdateForm = false;
    this.selectedKupac = null;
    this.updateForm.reset();
  }

  updateKupac(): void {
    if (this.updateForm.valid && this.selectedKupac) {
      this.kupacService.updateKupac(this.selectedKupac.korisnikId, this.updateForm.value).subscribe({
        next: (response) => {
          console.log('Kupac ažuriran:', response);
          this.showUpdateForm = false;
          this.selectedKupac = null;
          this.updateForm.reset();
          this.loadKupci();
        },
        error: (error) => {
          console.error('Greška:', error);
          alert(error.error?.message || 'Greška pri ažuriranju kupca');
        }
      });
    }
  }

  deleteKupac(kupac: Kupac): void {
    if (confirm(`Da li ste sigurni da želite obrisati kupca ${kupac.ime} ${kupac.prezime}?`)) {
      this.kupacService.deleteKupac(kupac.korisnikId).subscribe({
        next: (response) => {
          console.log('Kupac obrisan:', response);
          this.loadKupci();
        },
        error: (error) => console.error('Greška:', error)
      });
    }
  }
}
