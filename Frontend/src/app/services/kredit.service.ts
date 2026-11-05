import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KreditService {
  private apiUrl = `${environment.apiUrl}/kredit`;

  constructor(private http: HttpClient) { }

  getKrediti(korisnikId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/korisnik/${korisnikId}`);
  }

  addKredite(korisnikId: number, kolicina: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      majstorId: korisnikId,
      iznos: kolicina
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
