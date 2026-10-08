import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { MajstorService } from '../../services/majstor.service';

export interface MajstorLocation {
  korisnikId: number;
  ime: string;
  prezime: string;
  specijalizacija: string;
  prosjecnaOcjena: number;
  cijenaMjesecne: number;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-majstor-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-container">
      <div id="map" #mapContainer></div>
      <div class="map-legend">
        <h4>Legenda</h4>
        <div class="legend-item">
          <span class="legend-icon electrician"></span>
          <span>Električar</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon plumber"></span>
          <span>Vodoinstalater</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon carpenter"></span>
          <span>Stolar</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon painter"></span>
          <span>Moler</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon default"></span>
          <span>Ostalo</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-container {
      position: relative;
      width: 100%;
      height: 600px;
    }

    #map {
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .map-legend {
      position: absolute;
      bottom: 20px;
      right: 20px;
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1000;
    }

    .map-legend h4 {
      margin: 0 0 10px 0;
      font-size: 14px;
      font-weight: 600;
    }

    .legend-item {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      font-size: 12px;
    }

    .legend-icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      margin-right: 8px;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }

    .legend-icon.electrician { background-color: #f59e0b; }
    .legend-icon.plumber { background-color: #3b82f6; }
    .legend-icon.carpenter { background-color: #8b4513; }
    .legend-icon.painter { background-color: #10b981; }
    .legend-icon.default { background-color: #6b7280; }
  `]
})
export class MajstorMapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  majstori: MajstorLocation[] = [];
  searchQuery: string = '';

  constructor(
    private majstorService: MajstorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get search query from URL params
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.loadMajstori();
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Centar na Sarajevo
    this.map = L.map('map').setView([43.8563, 18.4131], 13);

    // Dodaj OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
  }

  private loadMajstori(): void {
    const params: any = { pageNumber: 1, pageSize: 100 };
    
    // Add search term if provided
    if (this.searchQuery) {
      // Search can be used for grad, specijalizacija, or name
      // Backend will handle the search logic
      params.searchTerm = this.searchQuery;
    }

    this.majstorService.getMajstori(params).subscribe({
      next: (response: any) => {
        this.majstori = response.items
          .filter((m: any) => m.latitude && m.longitude)
          .map((m: any) => ({
            korisnikId: m.korisnikId,
            ime: m.ime,
            prezime: m.prezime,
            specijalizacija: m.specijalizacija,
            prosjecnaOcjena: m.prosjecnaOcjena,
            cijenaMjesecne: m.cijenaMjesecne,
            latitude: m.latitude!,
            longitude: m.longitude!
          }));

        this.addMarkers();
      },
      error: (err) => console.error('Error loading majstori:', err)
    });
  }

  private addMarkers(): void {
    this.majstori.forEach(majstor => {
      const icon = this.getMarkerIcon(majstor.specijalizacija);
      
      const marker = L.marker([majstor.latitude, majstor.longitude], { icon })
        .addTo(this.map);

      const popupContent = `
        <div style="padding: 10px; min-width: 200px;">
          <h3 style="margin: 0 0 10px 0; font-size: 16px;">${majstor.ime} ${majstor.prezime}</h3>
          <p style="margin: 5px 0;"><strong>Specijalizacija:</strong> ${majstor.specijalizacija}</p>
          <p style="margin: 5px 0;"><strong>Ocjena:</strong> ⭐ ${majstor.prosjecnaOcjena.toFixed(1)}</p>
          <p style="margin: 5px 0;"><strong>Cijena:</strong> ${majstor.cijenaMjesecne} KM/mjesec</p>
          <button 
            onclick="window.location.href='/majstor/${majstor.korisnikId}'" 
            style="margin-top: 10px; padding: 8px 16px; background-color: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">
            Pogledaj profil
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      this.markers.push(marker);
    });
  }

  private getMarkerIcon(specijalizacija: string): L.Icon {
    const color = this.getSpecijalizacijaColor(specijalizacija);
    
    const svgIcon = `
      <svg width="32" height="42" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26c0-8.837-7.163-16-16-16z" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `;

    return L.icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon),
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42]
    });
  }

  private getSpecijalizacijaColor(specijalizacija: string): string {
    const spec = specijalizacija.toLowerCase();
    
    if (spec.includes('elektr')) return '#f59e0b'; // Orange za električare
    if (spec.includes('vodo') || spec.includes('instalat')) return '#3b82f6'; // Blue za vodoinstlatere
    if (spec.includes('stol') || spec.includes('tesar')) return '#8b4513'; // Brown za stolare
    if (spec.includes('mol') || spec.includes('farbaj') || spec.includes('bojadis')) return '#10b981'; // Green za molere
    
    return '#6b7280'; // Gray za ostale
  }

  goToProfile(korisnikId: number): void {
    this.router.navigate(['/majstor', korisnikId]);
  }
}
