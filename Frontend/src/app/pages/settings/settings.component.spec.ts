import { TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { vi } from 'vitest';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let snackBarSpy: any;

  beforeEach(() => {
    const spy = { open: vi.fn() };
    
    TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        { provide: MatSnackBar, useValue: spy }
      ]
    });
    
    component = TestBed.createComponent(SettingsComponent).componentInstance;
    snackBarSpy = TestBed.inject(MatSnackBar);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load default settings on init', () => {
    component.ngOnInit();
    
    expect(component.settings.language).toBe('sr-Latn-BA');
    expect(component.settings.theme).toBe('light');
    expect(component.settings.enableNotifications).toBe(true);
  });

  it('should save settings to localStorage', () => {
    component.settings.theme = 'dark';
    component.saveSettings();
    
    const saved = localStorage.getItem('appSettings');
    expect(saved).toBeTruthy();
    
    const parsed = JSON.parse(saved!);
    expect(parsed.theme).toBe('dark');
  });

  it('should load settings from localStorage', () => {
    const testSettings = {
      language: 'en-US',
      theme: 'dark' as const,
      enableNotifications: false,
      emailNotifications: false,
      pushNotifications: false,
      pageSize: 25
    };
    
    localStorage.setItem('appSettings', JSON.stringify(testSettings));
    component.loadSettings();
    
    expect(component.settings.language).toBe('en-US');
    expect(component.settings.theme).toBe('dark');
    expect(component.settings.pageSize).toBe(25);
  });

  it('should toggle theme', () => {
    component.settings.theme = 'light';
    component.toggleTheme();
    
    expect(component.settings.theme).toBe('dark');
    
    component.toggleTheme();
    expect(component.settings.theme).toBe('light');
  });

  it('should reset settings to defaults', () => {
    component.settings.language = 'en-US';
    component.settings.theme = 'dark';
    component.settings.pageSize = 50;
    
    component.resetSettings();
    
    expect(component.settings.language).toBe('sr-Latn-BA');
    expect(component.settings.theme).toBe('light');
    expect(component.settings.pageSize).toBe(10);
  });
});
