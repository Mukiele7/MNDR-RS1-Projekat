import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RazgovorService } from '../../services/razgovor.service';
import { AuthService } from '../../services/auth.service';

interface RazgovorPreview {
  razgovorId: number;
  kupacIme: string;
  majstorIme: string;
  zadnjaPoruka: string;
  vrijemeZadnjePoruke: string;
  brojNeprocitanih: number;
  otherUserName: string;
}

@Component({
  selector: 'app-razgovori-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="razgovori-list-page">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="container">
          <div class="logo" routerLink="/">
            <img src="/Assets/Logo.png" alt="MNDR Logo" class="logo-image"/>
          </div>

          <button class="hamburger-menu" (click)="toggleMenu()" [class.active]="isMenuOpen">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div class="nav-links" [class.active]="isMenuOpen">
            <a routerLink="/" (click)="closeMenu()">Naslovna</a>
            <a routerLink="/oglasi" (click)="closeMenu()">Pretraga</a>
            <a routerLink="/oglasi" (click)="closeMenu()">Ponude</a>
            <a routerLink="/majstor" (click)="closeMenu()">Majstori</a>
            <a routerLink="/favorites" (click)="closeMenu()">Omiljeni</a>
            <a routerLink="/razgovori" (click)="closeMenu()" class="active">Razgovori</a>
            
            <!-- Prikaži dugme za prijavu/registraciju ako korisnik nije ulogovan -->
            <a *ngIf="!isAuthenticated" routerLink="/login" class="btn-primary" (click)="closeMenu()">Prijava/Registracija</a>
            
            <!-- Prikaži profil dugme sa dropdown menijem ako je korisnik ulogovan -->
            <div *ngIf="isAuthenticated" class="profile-dropdown">
              <button class="profile-button" (click)="toggleDropdown()">
                <img [src]="getProfileImage()" alt="Profil" class="profile-avatar">
                <span class="profile-name">{{currentUser?.ime}} {{currentUser?.prezime}}</span>
              </button>
              
              <div class="dropdown-menu" [class.open]="isDropdownOpen">
                <a [routerLink]="profileRoute" (click)="isDropdownOpen = false; closeMenu()" class="dropdown-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Moj profil
                </a>
                <a (click)="logout(); closeMenu()" class="dropdown-item logout">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Odjavi se
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

    <div class="razgovori-list-container">
      
      <mat-card class="header-card">
        <div class="header-content">
          <div class="header-left">
            <h2><mat-icon>forum</mat-icon> Moji razgovori</h2>
            <p class="subtitle">Sve vaše konverzacije na jednom mjestu</p>
          </div>
        </div>
      </mat-card>

      <div *ngIf="loading" class="loading">
        <mat-spinner color="primary"></mat-spinner>
        <p>Učitavanje razgovora...</p>
      </div>

      <div *ngIf="!loading && razgovori.length === 0" class="empty-state">
        <div class="empty-icon-wrapper">
          <mat-icon class="empty-icon">forum</mat-icon>
        </div>
        <h3>Nemate aktivnih razgovora</h3>
        <p>Započnite razgovor sa majstorom klikom na "Kontaktiraj" dugme na oglasu</p>
        <button mat-raised-button color="primary" routerLink="/oglasi" class="cta-button">
          <mat-icon>search</mat-icon>
          Pretraži oglase
        </button>
      </div>

      <div class="razgovori-grid" *ngIf="!loading && razgovori.length > 0">
        <mat-card *ngFor="let razgovor of razgovori" 
                  class="razgovor-card"
                  [class.has-unread]="razgovor.brojNeprocitanih > 0"
                  (click)="openRazgovor(razgovor.razgovorId)">
          <div class="card-content">
            <div class="avatar-section">
              <div class="avatar">
                <mat-icon>person</mat-icon>
              </div>
              <span class="online-indicator"></span>
            </div>
            <div class="info-section">
              <div class="name-row">
                <h3>{{ razgovor.otherUserName }}</h3>
                <span class="time">{{ razgovor.vrijemeZadnjePoruke | date:'short' }}</span>
              </div>
              <p class="last-message">{{ razgovor.zadnjaPoruka || 'Započnite konverzaciju' }}</p>
            </div>
            <div class="action-section">
              <span class="badge" *ngIf="razgovor.brojNeprocitanih > 0">
                {{ razgovor.brojNeprocitanih }}
              </span>
              <mat-icon class="chevron">chevron_right</mat-icon>
            </div>
          </div>
        </mat-card>
      </div>
    </div>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-main">
            <!-- Logo i Social Media -->
            <div class="footer-brand">
              <div class="logo-and-social">
                <img src="/Assets/Logo.png" alt="MNDR Logo" class="footer-logo"/>
                <div class="social-icons">
                  <a href="#" class="social-icon" aria-label="Instagram">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="#" class="social-icon" aria-label="Facebook">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" class="social-icon" aria-label="TikTok">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div class="app-downloads">
                <a href="#" class="app-badge">
                  <img src="/Assets/App store.png" alt="Download on App Store"/>
                </a>
                <a href="#" class="app-badge">
                  <img src="/Assets/Google play.png" alt="Get it on Google Play"/>
                </a>
              </div>
            </div>

            <!-- Newsletter -->
            <div class="footer-newsletter">
              <h3>Prvi saznajte o promocijama</h3>
              <p class="newsletter-desc">Pretplatite se na naš newsletter</p>
              <form class="newsletter-form">
                <input type="email" placeholder="vasemail@gmail.com" required/>
                <button type="submit" class="btn-subscribe">Pretplatite se</button>
              </form>
            </div>

            <!-- Legalne stvari -->
            <div class="footer-links">
              <h4>Legalne stvari ba</h4>
              <a href="#">Uslovi korišćenja</a>
              <a href="#">Polica privatnosti</a>
              <a href="#">Dobre misli</a>
            </div>

            <!-- Važni linkovi -->
            <div class="footer-links">
              <h4>Važni linkovi</h4>
              <a href="#">Pomoć</a>
              <a routerLink="/register">Sign up to work</a>
              <a routerLink="/register">Create a business account</a>
            </div>
          </div>

          <!-- Footer Bottom -->
          <div class="footer-bottom">
            <p class="copyright">MNDR Copyright 2025, All Rights Reserved.</p>
            <div class="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms</a>
              <a href="#">Pricing</a>
              <a href="#">Do not sell or share my personal information</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .razgovori-list-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%);
    }

    // Navbar styles
    .navbar {
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .navbar .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;
    }

    .navbar .logo {
      cursor: pointer;
      transition: opacity 0.3s;
    }

    .navbar .logo:hover {
      opacity: 0.8;
    }

    .navbar .logo-image {
      height: 50px;
      object-fit: contain;
    }

    .navbar .hamburger-menu {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: transparent;
      border: none;
      cursor: pointer;
      z-index: 1001;
    }

    .navbar .hamburger-menu span {
      width: 25px;
      height: 3px;
      background: #2d3748;
      transition: all 0.3s;
      border-radius: 3px;
    }

    .navbar .hamburger-menu.active span:nth-child(1) {
      transform: rotate(45deg) translate(7px, 7px);
    }

    .navbar .hamburger-menu.active span:nth-child(2) {
      opacity: 0;
    }

    .navbar .hamburger-menu.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -7px);
    }

    .navbar .nav-links {
      display: flex;
      gap: 35px;
      align-items: center;
    }

    .navbar .nav-links a {
      text-decoration: none;
      color: #4a5568;
      font-weight: 500;
      font-size: 1rem;
      transition: all 0.3s;
      position: relative;
    }

    .navbar .nav-links a:hover {
      color: #13ab24;
    }

    .navbar .nav-links a.active {
      color: #13ab24;
      font-weight: 600;
    }

    .navbar .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      right: 0;
      height: 3px;
      background: #13ab24;
      border-radius: 2px;
    }

    .navbar .nav-links a.btn-primary {
      background: linear-gradient(135deg, #13ab24, #0f8a1e);
      color: white;
      padding: 12px 30px;
      border-radius: 8px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(19, 171, 36, 0.25);
    }

    .navbar .nav-links a.btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(19, 171, 36, 0.35);
      color: white;
    }

    /* Profile dropdown styles */
    .navbar .nav-links .profile-dropdown {
      position: relative;
    }

    .navbar .nav-links .profile-dropdown .profile-button {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px;
      border: 2px solid rgb(19,171,36);
      border-radius: 25px;
      background: white;
      cursor: pointer;
      transition: all 0.3s;
      font-family: 'Poppins', sans-serif;
    }

    .navbar .nav-links .profile-dropdown .profile-button:hover {
      background: rgb(19,171,36);
    }

    .navbar .nav-links .profile-dropdown .profile-button:hover .profile-name {
      color: white;
    }

    .navbar .nav-links .profile-dropdown .profile-avatar {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgb(19,171,36);
    }

    .navbar .nav-links .profile-dropdown .profile-name {
      color: rgb(19,171,36);
      font-weight: 700;
      font-size: 14px;
      transition: color 0.3s;
    }

    .navbar .nav-links .profile-dropdown .dropdown-menu {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      min-width: 200px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s;
      overflow: hidden;
      z-index: 1000;
    }

    .navbar .nav-links .profile-dropdown .dropdown-menu.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .navbar .nav-links .profile-dropdown .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      color: #333;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
    }

    .navbar .nav-links .profile-dropdown .dropdown-item svg {
      width: 20px;
      height: 20px;
      stroke: rgb(19,171,36);
    }

    .navbar .nav-links .profile-dropdown .dropdown-item:hover {
      background: #f9fafb;
      padding-left: 22px;
    }

    .navbar .nav-links .profile-dropdown .dropdown-item.logout {
      border-top: 1px solid #e5e7eb;
      color: #ef4444;
    }

    .navbar .nav-links .profile-dropdown .dropdown-item.logout svg {
      stroke: #ef4444;
    }

    .navbar .nav-links .profile-dropdown .dropdown-item.logout:hover {
      background: #fef2f2;
    }

    @media (max-width: 968px) {
      .navbar .hamburger-menu {
        display: flex;
      }

      .navbar .nav-links {
        position: fixed;
        top: 0;
        right: -100%;
        width: 300px;
        height: 100vh;
        background: white;
        flex-direction: column;
        padding: 100px 40px 40px;
        box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
        transition: right 0.3s;
        gap: 25px;
        align-items: flex-start;
      }

      .navbar .nav-links.active {
        right: 0;
      }
    }

    .razgovori-list-container {
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      padding: 24px 30px;
      flex: 1;
    }

    .header-card {
      background: white;
      padding: 28px;
      margin-bottom: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .header-left h2 {
      margin: 0 0 8px 0;
      color: #1a1a1a;
      font-size: 2em;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-left h2 mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #4caf50;
    }

    .subtitle {
      margin: 0;
      color: #666;
      font-size: 0.95em;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .loading mat-spinner {
      margin: 0 auto 24px;
    }

    .loading p {
      color: #666;
      font-size: 1.1em;
    }

    .empty-state {
      text-align: center;
      padding: 80px 40px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .empty-icon-wrapper {
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: white;
    }

    .empty-state h3 {
      margin: 20px 0 12px 0;
      color: #1a1a1a;
      font-size: 1.5em;
      font-weight: 600;
    }

    .empty-state p {
      margin: 0 0 32px 0;
      color: #666;
      font-size: 1em;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta-button {
      padding: 12px 32px !important;
      font-size: 1.05em !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3) !important;
    }

    .razgovori-grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }

    .razgovor-card {
      background: white;
      border-radius: 12px;
      padding: 0;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .razgovor-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .razgovor-card.has-unread {
      border-left: 4px solid #4caf50;
      background: linear-gradient(to right, #f1f8e9 0%, white 100%);
    }

    .card-content {
      display: flex;
      gap: 16px;
      padding: 20px;
      align-items: center;
    }

    .avatar-section {
      position: relative;
      flex-shrink: 0;
    }

    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .avatar mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .online-indicator {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      background: #4caf50;
      border: 3px solid white;
      border-radius: 50%;
    }

    .info-section {
      flex: 1;
      min-width: 0;
    }

    .name-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      gap: 12px;
    }

    .info-section h3 {
      margin: 0;
      font-size: 1.1em;
      font-weight: 600;
      color: #1a1a1a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .time {
      color: #999;
      font-size: 0.85em;
      white-space: nowrap;
    }

    .last-message {
      margin: 0;
      color: #666;
      font-size: 0.95em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .action-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .badge {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
      color: white;
      border-radius: 12px;
      padding: 4px 10px;
      font-size: 0.8em;
      font-weight: 600;
      min-width: 24px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(238, 90, 111, 0.3);
    }

    .chevron {
      color: #999;
      transition: all 0.3s ease;
    }

    .razgovor-card:hover .chevron {
      color: #4caf50;
      transform: translateX(4px);
    }

    @media (max-width: 768px) {
      .razgovori-list-container {
        padding: 16px;
      }

      .header-content {
        flex-direction: column;
        align-items: stretch;
      }

      .razgovori-grid {
        grid-template-columns: 1fr;
      }
    }

    // Footer styles
    .footer {
      padding: 60px 0 30px;
      background: #D9D9D9;
      color: #000;
      margin-top: 60px;
    }

    .footer .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 30px;
    }

    .footer .footer-main {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
      padding-bottom: 40px;
      border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    }

    .footer .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .footer .logo-and-social {
      display: flex;
      align-items: flex-start;
      gap: 20px;
    }

    .footer .footer-logo {
      width: 150px;
      height: auto;
    }

    .footer .social-icons {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-left: 35px;
    }

    .footer .social-icon {
      width: 45px;
      height: 45px;
      background: #000;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: all 0.3s;
    }

    .footer .social-icon:hover {
      background: #13AB24;
      transform: scale(1.1);
    }

    .footer .social-icon svg {
      width: 24px;
      height: 24px;
    }

    .footer .app-downloads {
      display: flex;
      flex-direction: row;
      gap: 10px;
      justify-content: center;
    }

    .footer .app-badge img {
      height: 40px;
      width: auto;
    }

    .footer .footer-newsletter h3 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #000;
    }

    .footer .newsletter-desc {
      font-size: 14px;
      color: #333;
      margin-bottom: 15px;
    }

    .footer .newsletter-form {
      display: flex;
      gap: 10px;
      max-width: 400px;
    }

    .footer .newsletter-form input {
      flex: 1;
      padding: 14px 20px;
      border: 1px solid #ccc;
      border-radius: 25px;
      font-size: 14px;
      background: #f5f5f5;
      outline: none;
    }

    .footer .newsletter-form input:focus {
      border-color: #13AB24;
      background: white;
    }

    .footer .newsletter-form input::placeholder {
      color: #999;
    }

    .footer .btn-subscribe {
      padding: 14px 30px;
      background: #13AB24;
      color: white;
      border: none;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      white-space: nowrap;
    }

    .footer .btn-subscribe:hover {
      background: #0f8a1d;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(19, 171, 36, 0.3);
    }

    .footer .footer-links h4 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #000;
    }

    .footer .footer-links a {
      display: block;
      color: #333;
      text-decoration: none;
      margin-bottom: 12px;
      font-size: 14px;
      transition: all 0.3s;
    }

    .footer .footer-links a:hover {
      color: #13AB24;
      text-decoration: underline;
    }

    .footer .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer .copyright {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .footer .footer-bottom-links {
      display: flex;
      gap: 20px;
    }

    .footer .footer-bottom-links a {
      color: #666;
      text-decoration: none;
      font-size: 14px;
      transition: color 0.3s;
    }

    .footer .footer-bottom-links a:hover {
      color: #13AB24;
    }

    @media (max-width: 1024px) {
      .footer .footer-main {
        grid-template-columns: 1fr 1fr;
        gap: 30px;
      }
    }

    @media (max-width: 768px) {
      .razgovori-list-container {
        padding: 16px;
      }

      .header-content {
        flex-direction: column;
        align-items: stretch;
      }

      .razgovori-grid {
        grid-template-columns: 1fr;
      }

      .footer .footer-main {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .footer .logo-and-social {
        flex-direction: column;
        align-items: center;
      }

      .footer .social-icons {
        flex-direction: row;
        padding-left: 0;
      }

      .footer .newsletter-form {
        flex-direction: column;
        margin: 0 auto;
      }

      .footer .footer-bottom {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }

      .footer .footer-bottom-links {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class RazgovoriListComponent implements OnInit {
  razgovori: RazgovorPreview[] = [];
  loading = true;
  currentUserId: number | null = null;
  isMenuOpen = false;
  isDropdownOpen = false;
  private loadingStarted = false; // Prevent double loading

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  get profileRoute(): string {
    const user = this.currentUser;
    if (user?.uloga === 'Majstor') {
      return `/majstor/${user.korisnikId ?? user.userId}`;
    }
    if (user?.uloga === 'Administrator' || user?.role === 'Administrator') {
      return '/dashboard';
    }
    return '/kupac/moj-profil';
  }

  getProfileImage(): string {
    const user = this.currentUser;
    if (user?.slikaProfila) {
      return `http://localhost:5017${user.slikaProfila}`;
    }
    const firstName = this.currentUser?.ime || 'K';
    const lastName = this.currentUser?.prezime || 'K';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + '+' + lastName)}&size=200&background=13ab24&color=ffffff&bold=true`;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.isDropdownOpen = false;
    this.authService.logout();
  }

  constructor(
    private razgovorService: RazgovorService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('ngOnInit called, loadingStarted:', this.loadingStarted);
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.log('User not logged in');
      this.loading = false;
      alert('Morate biti prijavljeni da biste vidjeli razgovore.');
      this.router.navigate(['/login']);
      return;
    }
    
    // Prevent double initialization
    if (this.loadingStarted) {
      console.log('Already loading, skipping...');
      return;
    }
    
    this.currentUserId = currentUser.userId;
    console.log('Loading razgovori for user:', this.currentUserId);
    this.loadRazgovori();
  }

  loadRazgovori() {
    if (!this.currentUserId || this.loadingStarted) {
      return;
    }

    this.loadingStarted = true;
    console.log('Calling API for razgovori...');
    this.razgovorService.getUserRazgovori(this.currentUserId).subscribe({
      next: (data: any) => {
        console.log('Razgovori loaded:', data);
        this.razgovori = data.map((r: any) => ({
          ...r,
          otherUserName: r.kupacId === this.currentUserId ? r.majstorIme : r.kupacIme
        }));
        this.loading = false;
        this.cdr.markForCheck(); // Force change detection
        console.log('Loading set to false, razgovori count:', this.razgovori.length);
      },
      error: (err) => {
        console.error('Greška pri učitavanju razgovora:', err);
        this.loading = false;
        this.loadingStarted = false;
        this.cdr.markForCheck(); // Force change detection
      }
    });
  }

  openRazgovor(razgovorId: number) {
    this.router.navigate(['/razgovori', razgovorId]);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
