import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService, PortfolioSlikaDto } from '../../services/portfolio.service';
import { OwlOptions, CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-portfolio-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './portfolio-carousel.component.html',
  styleUrls: ['./portfolio-carousel.component.scss']
})
export class PortfolioCarouselComponent implements OnInit {
  @Input() majstorId!: number;

  istaknuteSlike: PortfolioSlikaDto[] = [];
  loading: boolean = true;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true
  };

  constructor(
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadIstaknuteSlike();
    }, 0);
  }

  loadIstaknuteSlike(): void {
    this.loading = true;
    this.portfolioService.getPortfolioSlike(this.majstorId).subscribe({
      next: (response: any) => {
        const slike = response.slike || response.Slike || [];
        // Uzmi samo istaknutе slike (max 3)
        this.istaknuteSlike = slike.filter((s: any) => s.jeIstaknuta === true).slice(0, 3);
        console.log('Istaknutе slike:', this.istaknuteSlike);
        if (this.istaknuteSlike.length > 0) {
          console.log('Prva slika keys:', Object.keys(this.istaknuteSlike[0]));
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading featured images:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
