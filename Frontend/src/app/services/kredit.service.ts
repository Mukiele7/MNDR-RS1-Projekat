import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KreditService {
  private apiUrl = 'http://localhost:5017/api/kredit';

  constructor(private http: HttpClient) { }

  getKrediti(korisnikId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/korisnik/${korisnikId}`);
  }

  addKredite(korisnikId: number, kolicina: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      korisnikId,
      kolicina,
      tip: 'Uplata'
    });
  }

  useKredite(korisnikId: number, kolicina: number, opis: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/use`, {
      korisnikId,
      kolicina,
      opis,
      tip: 'Trošak'
    });
  }
}
