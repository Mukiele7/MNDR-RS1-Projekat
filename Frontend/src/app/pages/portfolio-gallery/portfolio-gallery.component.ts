import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PortfolioService, PortfolioSlikaDto } from '../../services/portfolio.service';

@Component({
  selector: 'app-portfolio-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './portfolio-gallery.component.html',
  styleUrls: ['./portfolio-gallery.component.scss']
})
export class PortfolioGalleryComponent implements OnInit {
  @Input() majstorId!: number;
  @Input() isOwner: boolean = false; // Da li prikazujemo delete dugme

  portfolioSlike: PortfolioSlikaDto[] = [];
  loading: boolean = true;
  selectedImageUrl: string = '';
  showLightbox: boolean = false;

  constructor(
    private portfolioService: PortfolioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPortfolioSlike();
  }

  loadPortfolioSlike(): void {
    this.loading = true;
    this.portfolioService.getPortfolioSlike(this.majstorId).subscribe({
      next: (response: any) => {
        this.portfolioSlike = response.slike || response.Slike || [];
        console.log('Gallery loaded images:', this.portfolioSlike);
        console.log('First image URL:', this.portfolioSlike[0]?.slikaUrl);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading portfolio:', error);
        this.snackBar.open('Greška pri učitavanju portfolia', 'Zatvori', { duration: 3000 });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openLightbox(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
    this.showLightbox = true;
  }

  closeLightbox(): void {
    this.showLightbox = false;
    this.selectedImageUrl = '';
  }

  deleteSlika(portfolioSlikaId: number): void {
    if (!confirm('Da li ste sigurni da želite obrisati ovu sliku?')) {
      return;
    }

    this.portfolioService.deletePortfolioSlika(portfolioSlikaId, this.majstorId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.snackBar.open('Slika uspješno obrisana', 'Zatvori', { duration: 3000 });
          this.loadPortfolioSlike(); // Refresh lista
        }
      },
      error: (error: any) => {
        console.error('Error deleting image:', error);
        this.snackBar.open('Greška pri brisanju slike', 'Zatvori', { duration: 3000 });
      }
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      // TODO: Implement file upload to storage (e.g., Cloudinary, AWS S3)
      // For now, we'll just accept image URLs
      this.snackBar.open('Upload funkcionalnost će biti dodana uskoro', 'Zatvori', { duration: 3000 });
    }
  }

  addImageUrl(): void {
    const imageUrl = prompt('Unesite URL slike:');
    if (!imageUrl) return;

    const opis = prompt('Unesite opis slike (opciono):');

    this.portfolioService.uploadPortfolioSlika({
      majstorId: this.majstorId,
      slikaUrl: imageUrl,
      opis: opis || undefined
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.snackBar.open('Slika uspješno dodana', 'Zatvori', { duration: 3000 });
          this.loadPortfolioSlike();
        }
      },
      error: (error: any) => {
        console.error('Error uploading image:', error);
        this.snackBar.open('Greška pri dodavanju slike', 'Zatvori', { duration: 3000 });
      }
    });
  }
}
