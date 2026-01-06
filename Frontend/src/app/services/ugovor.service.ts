import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UgovorService {
  private apiUrl = 'http://localhost:5017/api/ugovor';

  constructor(private http: HttpClient) { }

  getUgovori(korisnikId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/korisnik/${korisnikId}`);
  }

  createUgovor(kupacId: number, oglasId: number, datumOd: Date, datumDo: Date, cena: number, opis: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      kupacId,
      oglasId,
      datumOd,
      datumDo,
      cena,
      opis
    });
  }

  completeUgovor(ugovorId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${ugovorId}/complete`, {});
  }
}
