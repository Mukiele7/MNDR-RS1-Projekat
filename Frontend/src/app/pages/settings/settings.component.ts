import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface AppSettings {
  language: string;
  theme: 'light' | 'dark';
  enableNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  pageSize: number;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings: AppSettings = {
    language: 'sr-Latn-BA',
    theme: 'light',
    enableNotifications: true,
    emailNotifications: true,
    pushNotifications: false,
    pageSize: 10
  };

  languages = [
    { value: 'sr-Latn-BA', label: 'Srpski (Latinica)' },
    { value: 'sr-Cyrl-BA', label: 'Српски (Ћирилица)' },
    { value: 'en-US', label: 'English' }
  ];

  pageSizeOptions = [
    { value: 5, label: '5 po strani' },
    { value: 10, label: '10 po strani' },
    { value: 25, label: '25 po strani' },
    { value: 50, label: '50 po strani' }
  ];

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
      this.applyTheme();
    }
  }

  saveSettings(): void {
    localStorage.setItem('appSettings', JSON.stringify(this.settings));
    this.applyTheme();
    
    this.snackBar.open('Podešavanja uspješno sačuvana', 'Zatvori', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  resetSettings(): void {
    this.settings = {
      language: 'sr-Latn-BA',
      theme: 'light',
      enableNotifications: true,
      emailNotifications: true,
      pushNotifications: false,
      pageSize: 10
    };
    
    localStorage.removeItem('appSettings');
    this.applyTheme();
    
    this.snackBar.open('Podešavanja vraćena na početne vrijednosti', 'Zatvori', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  private applyTheme(): void {
    const body = document.body;
    if (this.settings.theme === 'dark') {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }

  toggleTheme(): void {
    this.settings.theme = this.settings.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
  }
}
